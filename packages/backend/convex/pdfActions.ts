"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import pdf from "pdf-parse";

export const summarizePDF = action({
  args: { 
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.");
    }

    const file = await ctx.runMutation(internal.openai.getFileForSummary, { fileId: args.fileId });
    if (!file) {
      throw new Error("File not found or access denied");
    }

    if (!file.type.includes("pdf")) {
      throw new Error("Only PDF files can be summarized");
    }

    await ctx.runMutation(internal.openai.updateSummaryStatus, {
      fileId: args.fileId,
      status: "processing",
    });

    try {
      // Download PDF from storage
      let pdfBuffer: Buffer;
      
      try {
        const pdfResponse = await fetch(file.uploadUrl);
        if (!pdfResponse.ok) {
          throw new Error(`Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
        }
        
        const arrayBuffer = await pdfResponse.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);
      } catch (downloadError) {
        throw new Error(`Could not download PDF from storage: ${downloadError instanceof Error ? downloadError.message : 'Unknown error'}`);
      }

      // Extract text from PDF
      let extractedText: string;
      
      try {
        const pdfData = await pdf(pdfBuffer);
        extractedText = pdfData.text;
        
        if (!extractedText || extractedText.trim().length === 0) {
          throw new Error("No text content found in PDF");
        }
      } catch (extractError) {
        throw new Error(`Could not extract text from PDF: ${extractError instanceof Error ? extractError.message : 'Unknown error'}`);
      }

      // Limit text length for API (OpenAI has token limits)
      const maxTextLength = 4000; // Approximately 1000 tokens
      const textToSummarize = extractedText.length > maxTextLength 
        ? extractedText.substring(0, maxTextLength) + "... [content truncated]"
        : extractedText;

      // Generate summary with actual PDF content
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that summarizes documents. Provide a concise summary in 2-3 paragraphs highlighting the main points, key information, and important details from the provided text content."
            },
            {
              role: "user",
              content: `Please provide a comprehensive summary of the following document content:\n\n${textToSummarize}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const summary = data.choices[0]?.message?.content || "Unable to generate summary";

      await ctx.runMutation(internal.openai.updateSummaryStatus, {
        fileId: args.fileId,
        status: "completed",
        summary: summary,
      });

      return {
        success: true,
        summary: summary,
      };
    } catch (error) {
      await ctx.runMutation(internal.openai.updateSummaryStatus, {
        fileId: args.fileId,
        status: "failed",
      });

      throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});