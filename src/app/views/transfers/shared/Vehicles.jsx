import { Box,Grid, CardHeader,Alert,Button,Card,styled,InputAdornment} from '@mui/material';
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
}));

export default function Vehicles() {

  const [vehicles,setVehicles] = useState({
    data: [],
    isLoading: true,
    error: true,
    message: null
  });
  const [open,setOpen] = useState(false);
  const [name,setName] = useState('');
  const [destination,setDestination] = useState('');
  const [price,setPrice] = useState(0.00);
  const [minPassengers, setMinPassengers] = useState(0);
  const [maxPassengers, setMaxPassengers] = useState(0);
  const [minChilds, setMinChilds] = useState(0);
  const [maxChilds, setMaxChilds] = useState(0);

  function handleClose() {
    setOpen(false);
  }

  const onSubmitHandler = function(e){
    e.preventDefault();
    const data = {
      name,
      price,
      minPassengers:minPassengers.toString(),
      maxPassengers:maxPassengers.toString(),
      minChilds:minChilds.toString(),
      maxChilds:maxChilds.toString(),
      destination: destination
    }
    axios.post('/admin/transfers/add-vehicle',{
      data
    }).then(data=>{
      setVehicles({...vehicles,data: data.data.vehicles,message:data.data.message, isLoading:false, error: false});
      setName('');setDestination('');setPrice(0.00);setMinPassengers(0);setMaxPassengers(0);setMinChilds(0);setMaxChilds(0);
      setOpen(false);
    }).catch(err=>{
      setVehicles({...vehicles, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  const hanldeRemoveVehicle = function(id){
    axios.post('/admin/transfers/remove-vehicle',{
      data:id
    }).then(data=>{
      setVehicles({...vehicles,data: data.data.vehicles,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setVehicles({...vehicles, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  useEffect(()=>{
    axios.get('/admin/transfers/get-vehicles').then((data)=>{
      setVehicles({...vehicles,data: data.data.vehicles, isLoading:false,error:false});
    }).catch(err=>{
      setVehicles({...vehicles,message:err.message, isLoading:false,error:true});
    });
  },[]);

  return (
    <>
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Vehicle</DialogTitle>
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
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                margin="dense"
                id="passengers_min"
                label="Passengers(min)"
                type="number"
                value={minPassengers}
                onChange={(e)=>setMinPassengers(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                margin="dense"
                id="passengers_max"
                label="Passengers(max)"
                type="number"
                value={maxPassengers}
                onChange={(e)=>setMaxPassengers(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                margin="dense"
                id="childs_min"
                label="Childs(min)"
                type="number"
                value={minChilds}
                onChange={(e)=>setMinChilds(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                margin="dense"
                id="childs_max"
                label="Childs(max)"
                type="number"
                value={maxChilds}
                onChange={(e)=>setMaxChilds(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={12}>
              <TextField
                required
                margin="dense"
                id="destination"
                label="Destination"
                type="text"
                value={destination}
                onChange={(e)=>setDestination(e.target.value)}
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
    {vehicles.message ? vehicles.error ? 
      <Alert severity='error'>{vehicles.message}</Alert> : 
      <Alert severity='success'>{vehicles.message}</Alert> : ''}
    <CardHeader title="Vehicles" action={<Button variant='outlined' onClick={()=>setOpen(true)}>ADD</Button>}/>
    { vehicles.data.length != 0 && <SimpleTable items={vehicles.data} onRemoveHandler={hanldeRemoveVehicle}/>}
    </CardRoot>
    </>
  );
}