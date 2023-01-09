import { Box, CardHeader,Alert,Button,Card,styled, Grid} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React,{useState,useEffect} from 'react';
import axios from 'axios.js';
import SimpleTable from './SimpleTable';

const CardRoot = styled(Card)(() => ({
  height: '100%',
  padding: '20px 24px',
  marginTop: '2rem',
}));

export default function Cities() {
  const [cities,setCities] = useState({
    data: [],
    isLoading: true,
    error: true,
    message: null
  });
  const [open,setOpen] = useState(false);
  const [name,setName] = useState('');

  function handleClose() {
    setOpen(false);
  }

  const onSubmitHandler = function(e){
    e.preventDefault();
    const data = {
      name
    }
    axios.post('/admin/target/city/add',{
      data
    }).then(data=>{
      setCities({...cities,data: data.data.cities,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setCities({...cities, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  const hanldeRemove = function(id){
    axios.delete(`/admin/target/city/${id}`).then(data=>{
      setCities({...cities,data: data.data.cities,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setCities({...cities, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  useEffect(()=>{
    axios.get('/admin/target/city/all').then((data)=>{
      setCities({...cities,data: data.data.cities, isLoading:false,error:false});
    }).catch(err=>{
      setCities({...cities,message:err.message, isLoading:false,error:true});
    });
  },[]);

  return (
    <>
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add City</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12} md={12}>
              <TextField
                required
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={onSubmitHandler} type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>

    <CardRoot elevation={6}>
    {cities.message ? cities.error ? 
      <Alert severity='error'>{cities.message}</Alert> : 
      <Alert severity='success'>{cities.message}</Alert> : ''}
    <CardHeader title="Cities" action={<Button variant='outlined' onClick={()=>setOpen(true)}>ADD</Button>}/>
    { cities.data.length != 0 && <SimpleTable items={cities.data} onRemoveHandler={hanldeRemove}/>}
    </CardRoot>
    </>
  );
}