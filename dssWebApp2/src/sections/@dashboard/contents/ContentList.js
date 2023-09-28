import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import ContentCard from './ContentCard';

// ----------------------------------------------------------------------

ContentList.propTypes = {
  content: PropTypes.array.isRequired,
};

export default function ContentList({ content, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {content.map((content) => (
        <Grid key={content.id} item xs={12} sm={6} md={3}>
          <ContentCard content={content} />
        </Grid>
      ))}
    </Grid>
  );
}
