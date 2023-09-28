import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Card, Stack, Typography } from '@mui/material';
// components
import { ContentList } from '../sections/@dashboard/contents';
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
        <Typography variant="h4" sx={{ mb: 5 }}>
          Content
        </Typography>
        <ContentList content={CONTENT_INFO} />
      </Container>
    </>
  );
}
