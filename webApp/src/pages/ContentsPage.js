import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Card, Stack, Typography } from '@mui/material';
// components
import { ContentList, ContentForm } from '../sections/@dashboard/contents';
// mock
import { ContentUpdateProvider } from '../sections/@dashboard/contents/UpdateContentContext';

// ----------------------------------------------------------------------
export default function ContentsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Content | DSS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} spacing={1}>
          <Typography variant="h4" gutterBottom>
            Content
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <ContentUpdateProvider>
            <Card>
              <ContentForm />
            </Card>
            <Card>
              <ContentList />
            </Card>
          </ContentUpdateProvider>
        </Stack>
      </Container>
    </>
  );
}
