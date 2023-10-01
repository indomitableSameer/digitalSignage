import { useEffect, useState } from 'react';
import GetFromCloud from './getApiCalls';

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
  if (jsonObj != null) {
    const totalEntries = Object.keys(jsonObj).length;
    const registerd = countOccurrences(jsonObj, 'IsRegistered', true);
    const online = countOccurrences(jsonObj, 'IsOnline', true);
    const offline = registerd - online;
    const available = totalEntries - registerd;

    const dashboardData = {
      Online: online,
      Offline: offline,
      Registered: registerd,
      Available: available,
      Countries: generateCountriesOverview(jsonObj, 'Country'),
    };
    return dashboardData;
  }
  return null;
}

const GetDashboardData = () => {
  const [data, setData] = useState(null);
  const dataRec = GetFromCloud('deviceInfoList');

  useEffect(() => {
    if (dataRec != null) {
      console.log('DashboardAppPage: Devices Data:', dataRec);
      setData(genWebData(dataRec));
    }
  }, [dataRec]);

  return data;
};

export default GetDashboardData;
