import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, Archive, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: FileList) => Promise<void>;
  projectId?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string;
  className?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploading?: boolean;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  projectId,
  maxFiles = 5,
  maxSize = 10,
  accept = "image/*,.pdf,.doc,.docx,.txt,.zip",
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const files = Array.from(fileList);
    
    // Validate file count
    if (files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Files must be smaller than ${maxSize}MB`);
      return;
    }

    setUploading(true);
    
    try {
      await onUpload(fileList);
      
      // Add files to uploaded files list
      const newFiles: UploadedFile[] = files.map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploading: false
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (type === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else if (type.includes('zip') || type.includes('archive')) {
      return <Archive className="w-5 h-5 text-yellow-500" />;
    } else {
      return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="text-center">
          <Upload className={`mx-auto h-12 w-12 ${
            dragActive ? 'text-blue-400' : 'text-gray-400'
          }`} />
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {uploading ? (
                'Uploading...'
              ) : (
                <>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Max {maxFiles} files, {maxSize}MB each
            </p>
          </div>
        </div>

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.error && (
                    <AlertCircle className="w-4 h-4 text-red-500" title={file.error} />
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;