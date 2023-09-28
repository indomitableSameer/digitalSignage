import axios, { HttpStatusCode } from 'axios';
import { useEffect, useState } from 'react';

const api = axios.create({
  baseURL: 'http://api.dss.com:8000',
});

const UploadContent = (file, name, description) => {
  const [data, setData] = useState([]);
  const formData = new FormData();
  formData.append('File', file);
  formData.append('FileName', name);
  formData.append('Description', description);
  formData.append('FileSize', file.size);

  useEffect(() => {
    const uploadfile = async () => {
      try {
        const response = await api.post('/addContent', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setData(response.data);
      } catch (error) {
        if (error.response) {
          console.log('Data:', error.response.data);
          console.log('Status:', error.response.status);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error:', error.message);
        }
      }
    };

    uploadfile();
  }, []); // Empty dependency array to run the effect only once

  return data;
};

export default UploadContent;
