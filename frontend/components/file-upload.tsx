'use client';

import { useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text';
  size: number;
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  acceptedTypes?: string[];
  multiple?: boolean;
  maxFiles?: number;
}

export default function FileUpload({
  onFilesChange,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.txt'],
  multiple = true,
  maxFiles = 10,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const getFileType = (filename: string): 'pdf' | 'image' | 'text' => {
    const ext = filename.toLowerCase().split('.').pop() || '';
    if (ext === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    if (ext === 'txt') return 'text';
    return 'text';
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < Math.min(files.length, maxFiles - uploadedFiles.length); i++) {
      const file = files[i];
      newFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: getFileType(file.name),
        size: Math.round(file.size / 1024 / 1024 * 10) / 10,
      });
    }

    const allFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(allFiles);
    onFilesChange(allFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    const newFiles = uploadedFiles.filter((f) => f.id !== id);
    setUploadedFiles(newFiles);
    onFilesChange(newFiles);
  };

  const getFileIcon = (type: 'pdf' | 'image' | 'text') => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'text':
        return <FileText className="w-5 h-5 text-green-500" />;
    }
  };

  const getFileTypeLabel = (type: 'pdf' | 'image' | 'text') => {
    switch (type) {
      case 'pdf':
        return 'PDF';
      case 'image':
        return 'IMAGE';
      case 'text':
        return 'TEXT';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {uploadedFiles.length < maxFiles && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-secondary bg-secondary/5'
              : 'border-border hover:border-secondary/50'
          }`}
        >
          <input
            type="file"
            multiple={multiple}
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFiles(e.target.files)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Drop files here or click to upload</p>
              <p className="text-sm text-muted-foreground">
                PDF, Images, or Text files ({uploadedFiles.length}/{maxFiles})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Uploaded Files</p>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size} MB</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    file.type === 'pdf'
                      ? 'bg-red-100 text-red-700'
                      : file.type === 'image'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {getFileTypeLabel(file.type)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="ml-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
