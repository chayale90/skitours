import { Box, CardHeader,Alert,Button,Card,styled, Grid,InputAdornment} from '@mui/material';
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

export default function Equipments() {
  const [equipments,setEquipments] = useState({
    data: [],
    isLoading: true,
    error: true,
    message: null
  });
  const [open,setOpen] = useState(false);
  const [name,setName] = useState('');
  const [price,setPrice] = useState(0);

  function handleClose() {
    setOpen(false);
  }

  const onSubmitHandler = function(e){
    e.preventDefault();
    const data = {
      name,
      price
    }
    axios.post('/admin/storefront/add-equipment',{
      data
    }).then(data=>{
      setEquipments({...equipments,data: data.data.equipments,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setEquipments({...equipments, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  const hanldeRemove = function(id){
    axios.post('/admin/storefront/remove-equipment',{
      data:id
    }).then(data=>{
      setEquipments({...equipments,data: data.data.equipments,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setEquipments({...equipments, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  useEffect(()=>{
    axios.get('/admin/storefront/get-equipments').then((data)=>{
      setEquipments({...equipments,data: data.data.equipments, isLoading:false,error:false});
    }).catch(err=>{
      setEquipments({...equipments,message:err.message, isLoading:false,error:true});
    });
  },[]);

  return (
    <>
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Equipment</DialogTitle>
        <DialogContent>
          <Grid container>
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
    {equipments.message ? equipments.error ? 
      <Alert severity='error'>{equipments.message}</Alert> : 
      <Alert severity='success'>{equipments.message}</Alert> : ''}
    <CardHeader title="Equipments" action={<Button variant='outlined' onClick={()=>setOpen(true)}>ADD</Button>}/>
    { equipments.data.length != 0 && <SimpleTable items={equipments.data} onRemoveHandler={hanldeRemove}/>}
    </CardRoot>
    </>
  );
}