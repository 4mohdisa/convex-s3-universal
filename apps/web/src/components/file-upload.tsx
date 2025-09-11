"use client";

import { useState } from "react";
// import { useUploadFile } from "@convex-dev/r2/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex-s3-universal/backend/convex/_generated/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Trash2, Download, Upload, Loader2 } from "lucide-react";

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const generateUploadUrl = useMutation(api.r2.generateUploadUrl);

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
      const result = await generateUploadUrl({ contentType: selectedFile.type });
      toast.success(`File "${selectedFile.name}" upload URL generated! Ready for Cloudflare R2.`);
      setFiles(prev => [...prev, { 
        _id: result.storageId,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      }]);
      setSelectedFile(null);
      const input = document.getElementById("file-input") as HTMLInputElement;
      if (input) input.value = "";
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload failed. Check R2 configuration in Convex Dashboard.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    setFiles(prev => prev.filter(f => f._id !== fileId));
    toast.success("File removed from list");
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
              {files.map((file, index) => (
                <div
                  key={file._id || index}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex-1">
                    <div className="font-medium">{file.name || selectedFile?.name || 'Unknown file'}</div>
                    <div className="text-sm text-muted-foreground">
                      {file.size ? formatFileSize(file.size) : selectedFile?.size ? formatFileSize(selectedFile.size) : 'Unknown size'} • 
                      Uploaded {new Date().toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.info("Download functionality available with proper R2 setup");
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(file._id || index.toString())}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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