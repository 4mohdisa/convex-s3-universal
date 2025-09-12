"use client";

import { useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@convex-s3-universal/backend/convex/_generated/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Trash2, Download, Upload, Loader2, FileText, Sparkles } from "lucide-react";
import type { Id } from "@convex-s3-universal/backend/convex/_generated/dataModel";

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [summarizingFiles, setSummarizingFiles] = useState<Set<string>>(new Set());
  
  const files = useQuery(api.r2.getFiles) || [];
  const generateUploadUrl = useMutation(api.r2.generateUploadUrl);
  const deleteFile = useMutation(api.r2.deleteFile);
  const summarizePDF = useAction(api.pdfActions.summarizePDF);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    try {
      const result = await generateUploadUrl({ 
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        contentType: selectedFile.type 
      });
      toast.success(`File "${selectedFile.name}" uploaded successfully!`);
      setSelectedFile(null);
      const input = document.getElementById("file-input") as HTMLInputElement;
      if (input) input.value = "";
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload failed. Check storage configuration in Convex Dashboard.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: Id<"files">) => {
    try {
      await deleteFile({ fileId });
      toast.success("File deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete file");
    }
  };

  const handleSummarize = async (fileId: Id<"files">) => {
    setSummarizingFiles(prev => new Set(prev.add(fileId)));
    try {
      await summarizePDF({ fileId });
      toast.success("PDF summary generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate summary");
    } finally {
      setSummarizingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
    }
  };

  const isPDF = (fileType: string) => {
    return fileType.includes('pdf');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            File Upload
          </CardTitle>
          <CardDescription>
            Upload files to your universal S3 storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-input">Select File</Label>
            <Input
              id="file-input"
              type="file"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>
          
          {selectedFile && (
            <div className="p-3 bg-muted rounded-md">
              <div className="text-sm font-medium">{selectedFile.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </div>
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </div>
            ) : (
              "Upload File"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Files List Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Files</CardTitle>
          <CardDescription>
            Manage your uploaded files
          </CardDescription>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <div className="text-muted-foreground">
                📁 No files uploaded yet
              </div>
              <div className="text-sm text-muted-foreground">
                Upload your first file above to see it here!
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file._id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {isPDF(file.type) ? (
                          <FileText className="h-5 w-5 text-red-500" />
                        ) : (
                          <Upload className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{file.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {file.storageProvider} • 
                          Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                        </div>
                        
                        {file.summary && (
                          <div className="mt-2 p-3 bg-muted rounded-md">
                            <div className="text-sm font-medium flex items-center gap-2 mb-2">
                              <Sparkles className="h-4 w-4" />
                              Summary
                            </div>
                            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {file.summary}
                            </div>
                          </div>
                        )}
                        
                        {file.summaryStatus === "processing" && (
                          <div className="mt-2 p-3 bg-muted rounded-md">
                            <div className="text-sm flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Generating summary...
                            </div>
                          </div>
                        )}
                        
                        {file.summaryStatus === "failed" && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                            <div className="text-sm text-red-700">
                              Failed to generate summary. Please try again.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {isPDF(file.type) && !file.summary && file.summaryStatus !== "processing" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSummarize(file._id)}
                          disabled={summarizingFiles.has(file._id)}
                        >
                          {summarizingFiles.has(file._id) ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              Summarizing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-1" />
                              Summarize
                            </>
                          )}
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast.info("Download functionality available with proper storage setup");
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}