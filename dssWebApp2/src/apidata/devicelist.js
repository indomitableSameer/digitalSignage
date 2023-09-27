import axios, { HttpStatusCode } from 'axios';
import { map } from 'lodash';
import { useEffect, useState } from 'react';

const api = axios.create({
  baseURL: 'http://api.dss.com:8000',
});

function countOccurrences(jsonObj, key, value) {
  return Object.values(jsonObj).reduce((count, obj) => {
    if (key in obj && obj[key] === value) {
      count += 1;
    }
    return count;
  }, 0);
}

const countUniqueValues = (arr, key) => {
  const counts = {};
  const datamap = new Map();

  arr.forEach((item) => {
    const value = item[key];
    counts[value] = (counts[value] || 0) + 1;
  });

  console.log(datamap);
  return counts;
};

function genWebData(jsonObj) {
  console.log('Data Received:', jsonObj);
  const dashboardData = {
    Online: countOccurrences(jsonObj, 'Online', true),
    Ofline: countOccurrences(jsonObj, 'Online', false),
    Registered: countOccurrences(jsonObj, 'Registered', true),
    Available: countOccurrences(jsonObj, 'Registered', false),
    Countries: countUniqueValues(jsonObj, 'Location'),
  };
  return dashboardData;
}

const GetDevices = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/deviceList');
        setData(genWebData(response.data));
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

export default GetDevices;
