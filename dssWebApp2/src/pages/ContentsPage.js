import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { Container, Card, Stack, Typography } from '@mui/material';
// components
import { ContentList, ContentForm } from '../sections/@dashboard/contents';
// mock
import GetFromCloud from '../apidata/getApiCalls';

// ----------------------------------------------------------------------

export default function ContentsPage() {
  // const contentListData = GetContent();
  const contentListData = GetFromCloud('contentlist');
  const [content, setContent] = useState([]);
  useEffect(() => {
    // Use devicesData as needed
    if (contentListData != null) {
      console.log('Devices Data:', contentListData);
      setContent(contentListData);
    }
  }, [contentListData, content]);

  return (
    <>
      <Helmet>
        <title> Dashboard: Content | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} spacing={1}>
          <Typography variant="h4" gutterBottom>
            Content
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Card>
            <ContentForm />
          </Card>
          <Card>
            <ContentList content={content} />
          </Card>
        </Stack>
      </Container>
    </>
  );
}
