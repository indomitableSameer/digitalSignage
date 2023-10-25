import axios, { HttpStatusCode } from 'axios';
import { map } from 'lodash';
import { useEffect, useState } from 'react';
import baseApi from '../api/baseApi';

const apiEndpoints = {
  contentlist: '/getContentList',
  countrylist: '/getCountryList',
  citylist: '/getCityList',
  buildinglist: '/getBuildingList',
  arealist: '/getAreaList',
  deviceInfoList: '/getDeviceInfoList',
};

const GetFromCloud = (what) => {
  const [data, setData] = useState(null);

  let apiendoint = '';
  switch (what) {
    case 'contentlist':
      apiendoint = apiEndpoints.contentlist;
      break;
    case 'countrylist':
      apiendoint = apiEndpoints.countrylist;
      break;
    case 'citylist':
      apiendoint = apiEndpoints.citylist;
      break;
    case 'buildinglist':
      apiendoint = apiEndpoints.buildinglist;
      break;
    case 'arealist':
      apiendoint = apiEndpoints.arealist;
      break;
    case 'deviceInfoList':
      apiendoint = apiEndpoints.deviceInfoList;
      break;
    default:
      apiendoint = '';
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await baseApi.get(apiendoint);
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

export default GetFromCloud;
