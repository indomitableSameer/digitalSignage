import { useState } from 'react';
import axios, { HttpStatusCode } from 'axios';
// @mui
import { Grid, FormControl, TextField, Button, Card } from '@mui/material';
// component
import Iconify from '../../../components/iconify';

const api = axios.create({
  baseURL: 'http://api.dss.com:8000',
});

export default function ContentForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

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
      })
      .then((response) => {
        // handle the response
        console.log(response);
      })
      .catch((error) => {
        // handle errors
        console.log(error);
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
            <input type="file" hidden />
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
    </FormControl>
  );
}
