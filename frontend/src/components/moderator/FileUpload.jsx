import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const FileUpload = ({
  label,
  id,
  accept = "image/*,.pdf",
  helperText,
  onChange,
  error,
}) => {
  const [fileName, setFileName] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setFileName(file.name);
      onChange(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFileName(null);
      setPreviewUrl(null);
      onChange(null);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setPreviewUrl(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      
      <div className={cn(
        "border rounded-md p-4 transition-all",
        fileName ? "bg-secondary/30" : "bg-transparent",
        error ? "border-destructive" : "border-input"
      )}>
        {!fileName ? (
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="flex flex-col items-center gap-1">
              <Label 
                htmlFor={id} 
                className="cursor-pointer text-sm font-medium text-primary hover:underline"
              >
                Click to upload {label}
              </Label>
              {helperText && (
                <p className="text-xs text-muted-foreground">{helperText}</p>
              )}
            </div>
            <Input
              id={id}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {previewUrl ? (
                <div className="h-10 w-10 rounded-md overflow-hidden bg-background flex items-center justify-center">
                  <img 
                    src={previewUrl} 
                    alt={fileName} 
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate max-w-[200px]">
                  {fileName}
                </span>
                <Label 
                  htmlFor={id} 
                  className="text-xs text-primary cursor-pointer hover:underline"
                >
                  Replace
                </Label>
                <Input
                  id={id}
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={clearFile}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
