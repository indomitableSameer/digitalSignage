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
  const { cover, name, description, date, time } = content;

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledProductImg alt={name} src={cover} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="subtitle2">{name}</Typography>
        <Typography variant="subtitle2">{description}</Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">{date}</Typography>
          <Typography variant="subtitle2">{time}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
