import axios, { HttpStatusCode } from 'axios';
import { useEffect, useState } from 'react';

const api = axios.create({
  baseURL: 'http://api.dss.com:8001',
});

const apiEndpoints = {
  removeContent: '/removeContent',
};

const usePostToCloud = (what, data) => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    let apiEndpoint = '';
    switch (what) {
      case 'removeContent':
        apiEndpoint = apiEndpoints.removeContent;
        break;
      default:
        apiEndpoint = '';
    }

    const postData = async () => {
      try {
        const response = await api.post(apiEndpoint, data, { headers: { 'Content-Type': 'application/json' } });
        setResponse(response.data);
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

    postData();
  }, [what, data]); // Include dependencies in the dependency array

  return response;
};

export default usePostToCloud;
