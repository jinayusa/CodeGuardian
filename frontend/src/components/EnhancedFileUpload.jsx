import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const EnhancedFileUpload = ({ onFileUpload }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      setErrorMessage('Invalid file type. Please upload a valid image.');
      return;
    }
    setErrorMessage('');
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    // Simulate upload progress
    const simulateProgress = () => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          onFileUpload({ message: 'File uploaded successfully', fileName: file.name });
          return 0;
        }
        return prev + 10;
      });
    };

    const progressInterval = setInterval(simulateProgress, 200);

    setTimeout(() => {
      clearInterval(progressInterval);
    }, 2000);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="bg-white shadow px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">File Uploader</h2>
        </div>
        
        {/* Main drop zone - takes all available space */}
        <div 
          {...getRootProps()}
          className={`flex-1 flex items-center justify-center border-2 border-dashed m-6 rounded-lg cursor-pointer transition-colors duration-200 ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center p-6">
            {isDragActive ? (
              <div>
                <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-2 text-lg font-medium text-blue-500">Drop the files here...</p>
              </div>
            ) : (
              <div>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-2 text-lg font-medium text-gray-700">Drag & drop files anywhere on this screen</p>
                <p className="mt-1 text-sm text-gray-500">or click to browse</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with error message and progress bar */}
        <div className="bg-white px-6 py-4">
          {errorMessage && <p className="text-red-500 mb-3">{errorMessage}</p>}
          {uploadProgress > 0 && (
            <div>
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Uploading
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300 ease-in-out"
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedFileUpload;