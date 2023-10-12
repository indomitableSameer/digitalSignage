import { useEffect, useState } from 'react';
import GetFromCloud from './getApiCalls';

const GetDevicesData = () => {
  const [data, setData] = useState(null);
  const dataRec = GetFromCloud('deviceInfoList');

  useEffect(() => {
    if (dataRec != null) {
      console.log('DashboardAppPage: Devices Data:', dataRec);
      setData(dataRec);
    }
  }, [dataRec]);

  return data;
};

export default GetDevicesData;
