import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  currentImage?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  currentImage, 
  className = '' 
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image must be smaller than 5MB');
        return;
      }
      onImageUpload(file);
      toast.success('Image uploaded successfully!');
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  return (
    <motion.div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
        isDragActive 
          ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/10' 
          : 'border-[color:var(--border)] hover:border-[color:var(--accent)]'
      } ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input {...getInputProps()} />
      
      {currentImage ? (
        <div className="relative">
          <img 
            src={currentImage} 
            alt="Current" 
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
            <p className="text-white font-semibold">Click or drag to change</p>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center">
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="mx-auto h-12 w-12 text-[color:var(--muted)] mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <p className="text-[color:var(--text-primary)] font-semibold mb-2">
            {isDragActive ? 'Drop image here' : 'Upload profile image'}
          </p>
          <p className="text-[color:var(--text-secondary)] text-sm">
            Drag & drop or click to select (Max 5MB)
          </p>
        </div>
      )}
    </motion.div>
  );
};