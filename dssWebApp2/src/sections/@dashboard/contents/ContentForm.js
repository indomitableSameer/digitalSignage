import { useState } from 'react';
// @mui
import { Grid, FormControl, TextField, Button, Card } from '@mui/material';
// component
import Iconify from '../../../components/iconify';
import ContentDropzone from './ContentDropzone';

export default function ContentForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState('');

  const handleSubmit = async () => {
    console.log(name);
    console.log(description);
    console.log(file);
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
              setFile(event.target.value);
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
