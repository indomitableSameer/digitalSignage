import PropTypes from 'prop-types';
// @mui
import { Box, Card, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ContentCard.propTypes = {
  content: PropTypes.object,
};

export default function ContentCard({ content }) {
  const { cover, Name, Description, Date, Time } = content;

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledProductImg alt={Name} src={`/assets/images/contents/testimg.jpg`} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="subtitle2">{Name}</Typography>
        <Typography variant="subtitle2">{Description}</Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">{Date}</Typography>
          <Typography variant="subtitle2">{Time}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
