import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
// @mui
import { Grid } from '@mui/material';
import ContentCard from './ContentCard';
import UpdateContentContext from './UpdateContentContext';

// ----------------------------------------------------------------------
const api = axios.create({
  baseURL: 'http://api.dss.com:8001',
});

export default function ContentList() {
  const triggerUpdate = useContext(UpdateContentContext);
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/getContentList');
        setContent(response.data);
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
  }, [triggerUpdate]);

  const handleRemoveButton = async (data) => {
    const response = await api.post('/removeContent', data, { headers: { 'Content-Type': 'application/json' } });
    console.log(response);
    triggerUpdate();
  };

  return (
    <Grid container spacing={3}>
      {content.map((content) => (
        <Grid key={content.Id} item xs={12} sm={6} md={3}>
          <ContentCard content={content} onButtonClick={handleRemoveButton} />
        </Grid>
      ))}
    </Grid>
  );
}
