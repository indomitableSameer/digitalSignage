import PropTypes from 'prop-types';
import axios from 'axios';
// @mui
import { Grid } from '@mui/material';
import ContentCard from './ContentCard';

// ----------------------------------------------------------------------

ContentList.propTypes = {
  content: PropTypes.array.isRequired,
};

const api = axios.create({
  baseURL: 'http://api.dss.com:8001',
});

export default function ContentList({ content, ...other }) {
  const handleRemoveButton = async (data) => {
    const response = await api.post('/removeContent', data, { headers: { 'Content-Type': 'application/json' } });
    console.log(response);
  };

  return (
    <Grid container spacing={3} {...other}>
      {content.map((content) => (
        <Grid key={content.Id} item xs={12} sm={6} md={3}>
          <ContentCard content={content} onButtonClick={handleRemoveButton} />
        </Grid>
      ))}
    </Grid>
  );
}
