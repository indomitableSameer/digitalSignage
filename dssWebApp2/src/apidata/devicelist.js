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

const generateCountriesOverview = (arr, key) => {
  const counts = {};

  arr.forEach((item) => {
    const value = item[key];
    counts[value] = (counts[value] || 0) + 1;
  });

  const overview = Object.keys(counts).map((label) => ({ label, value: counts[label] }));
  console.log(overview);
  return overview;
};

function genWebData(jsonObj) {
  const totalEntries = Object.keys(jsonObj).length;
  const registerd = countOccurrences(jsonObj, 'IsRegistered', true);
  const online = countOccurrences(jsonObj, 'IsOnline', true);
  const offline = registerd - online;
  const available = totalEntries - registerd;

  // console.log('registerd', registerd);
  // console.log('online', online);
  // console.log('offline = registerd - online', offline);
  // console.log('available = totalEntries - registerd', available);
  const dashboardData = {
    Online: online,
    Offline: offline,
    Registered: registerd,
    Available: available,
    Countries: generateCountriesOverview(jsonObj, 'Country'),
  };
  return dashboardData;
}

const GetDevices = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/getDeviceInfoList');
        setData(genWebData(response.data));
      } catch (error) {
        if (error.response) {
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
