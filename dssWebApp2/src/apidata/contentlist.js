import axios, { HttpStatusCode } from 'axios';
import { map } from 'lodash';
import { useEffect, useState } from 'react';

const api = axios.create({
  baseURL: 'http://api.dss.com:8000',
});

const GetContent = () => {
  const [data, setData] = useState(null);
  console.log('test');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/getContentList');
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

    fetchData();
  }, []); // Empty dependency array to run the effect only once

  return data;
};

export default GetContent;
