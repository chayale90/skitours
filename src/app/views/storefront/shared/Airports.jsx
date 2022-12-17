import { Box, CardHeader,Alert,Button,Card,styled} from '@mui/material';
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

export default function Airports() {
  const [airports,setAirports] = useState({
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
    axios.post('/admin/storefront/add-airport',{
      data
    }).then(data=>{
      setAirports({...airports,data: data.data.airports,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setAirports({...airports, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  const hanldeRemove = function(id){
    axios.post('/admin/storefront/remove-airport',{
      data:id
    }).then(data=>{
      setAirports({...airports,data: data.data.airports,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setAirports({...airports, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  useEffect(()=>{
    axios.get('/admin/storefront/get-airports').then((data)=>{
      setAirports({...airports,data: data.data.airports, isLoading:false,error:false});
    }).catch(err=>{
      setAirports({...airports,message:err.message, isLoading:false,error:true});
    });
  },[]);

  return (
    <>
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Airport</DialogTitle>
        <DialogContent>
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
    {airports.message ? airports.error ? 
      <Alert severity='error'>{airports.message}</Alert> : 
      <Alert severity='success'>{airports.message}</Alert> : ''}
    <CardHeader title="Airports" action={<Button variant='outlined' onClick={()=>setOpen(true)}>ADD</Button>}/>
    { airports.data.length != 0 && <SimpleTable items={airports.data} onRemoveHandler={hanldeRemove}/>}
    </CardRoot>
    </>
  );
}