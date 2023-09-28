import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ContentDropzone = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles);
      console.log('called');
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drop file to upload</p>
      <ul>
        {uploadedFiles.map((file) => (
          <li key={file.name}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};
export default ContentDropzone;
