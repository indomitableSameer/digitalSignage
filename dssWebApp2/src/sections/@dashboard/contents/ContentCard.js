import PropTypes from 'prop-types';
// @mui
import { Box, Card, Typography, Stack, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
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

export default function ContentCard({ content, onButtonClick }) {
  const { cover, Id, Name, Description, Date, Time } = content;

  const handleClick = () => {
    const value = { ContentId: Id }; // Object to be passed
    onButtonClick(value); // Call the parent function with the value
  };

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledProductImg alt={Name} src={`/assets/images/contents/testimg.jpg`} />
        <IconButton
          style={{
            position: 'absolute',
            top: '10%',
            left: '90%',
            transform: 'translate(-50%, -50%)',
          }}
          onClick={handleClick}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="h6">{Name}</Typography>
        <Typography variant="subtitle2">{Description}</Typography>
        <Typography variant="subtitle2">Screens showing: 5</Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">{Date}</Typography>
          <Typography variant="subtitle2">{Time}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
