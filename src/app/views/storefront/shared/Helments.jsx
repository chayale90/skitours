import { Box, CardHeader,Alert,Button,Card,styled,Grid,InputAdornment} from '@mui/material';
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

export default function Helments() {
  const [helments,setHelments] = useState({
    data: [],
    isLoading: true,
    error: true,
    message: null
  });
  const [open,setOpen] = useState(false);
  const [name,setName] = useState('');
  const [price,setPrice] = useState(0.00);

  function handleClose() {
    setOpen(false);
  }

  const onSubmitHandler = function(e){
    e.preventDefault();
    const data = {
      name,
      price
    }
    axios.post('/admin/storefront/add-helment',{
      data
    }).then(data=>{
      setHelments({...helments,data: data.data.helments,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setHelments({...helments, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  const hanldeRemove = function(id){
    axios.post('/admin/storefront/remove-helment',{
      data:id
    }).then(data=>{
      setHelments({...helments,data: data.data.helments,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setHelments({...helments, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  useEffect(()=>{
    axios.get('/admin/storefront/get-helments').then((data)=>{
      setHelments({...helments,data: data.data.helments, isLoading:false,error:false});
    }).catch(err=>{
      setHelments({...helments,message:err.message, isLoading:false,error:true});
    });
  },[]);

  return (
    <>
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Helment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
            <TextField
                required
                margin="dense"
                id="price"
                label="Price(per day)"
                type="number"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₪</InputAdornment>,
                }}
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
    {helments.message ? helments.error ? 
      <Alert severity='error'>{helments.message}</Alert> : 
      <Alert severity='success'>{helments.message}</Alert> : ''}
    <CardHeader title="Helments" action={<Button variant='outlined' onClick={()=>setOpen(true)}>ADD</Button>}/>
    { helments.data.length != 0 && <SimpleTable items={helments.data} onRemoveHandler={hanldeRemove}/>}
    </CardRoot>
    </>
  );
}