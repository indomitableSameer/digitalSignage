import { useState, useContext } from 'react';
import axios from 'axios';
// @mui
import { Grid, FormControl, TextField, Button, LinearProgress } from '@mui/material';
// component
import Iconify from '../../../components/iconify';
import UpdateContentContext from './UpdateContentContext';

const api = axios.create({
  baseURL: 'https://device.dss.com:4001',
});

export default function ContentForm() {
  const triggerUpdate = useContext(UpdateContentContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('FileName', name);
    formData.append('Description', description);
    formData.append('FileSize', file.size);

    api
      .post('/addContent', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        },
      })
      .then((response) => {
        console.log('Upload successful:', response.data);
        setUploadProgress(0); // Reset progress after successful upload
        triggerUpdate();
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        setUploadProgress(0); // Reset progress on error
      });
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 150 }}>
      <Grid container spacing={2}>
        <Grid item>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </Grid>

        <Grid item>
          <TextField
            id="desc"
            label="Description"
            variant="outlined"
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            component="label"
            onChange={(event) => {
              setFile(event.target.files[0]);
            }}
          >
            select file
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </Grid>

        {/* <Grid item>
          <Button component="label" variant="contained">
            Upload file
          </Button>
        </Grid> */}

        <Grid item>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleSubmit}>
            Add
          </Button>
        </Grid>
      </Grid>
      {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} />}
    </FormControl>
  );
}
