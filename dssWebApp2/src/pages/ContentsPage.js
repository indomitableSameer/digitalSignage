import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Card, Stack, Typography } from '@mui/material';
// components
import { ContentList, ContentForm } from '../sections/@dashboard/contents';
// mock
import CONTENT_INFO from '../_mock/contents';

// ----------------------------------------------------------------------

export default function ContentsPage() {
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
            <ContentList content={CONTENT_INFO} />
          </Card>
        </Stack>
      </Container>
    </>
  );
}
