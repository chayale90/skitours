import { Box, CardHeader,Alert,Button,Card,styled, Grid, Select, MenuItem, InputLabel, FormControl} from '@mui/material';
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
  const [cityId,setCityId] = useState(null);
  const [cities,setCities] = useState(null);

  function handleClose() {
    setOpen(false);
  }

  function handleOpen() {
    axios.get('/admin/target/city/all').then((data)=>{
        setCities(data.data.cities);
        console.log("Cities",data.data.cities);
    }).catch(err=>{
        console.log("Error",err);
    });
    setOpen(true);
  }

  const onSubmitHandler = function(e){
    e.preventDefault();
    const data = {
      name,
      cityId
    }
    axios.post('/admin/target/airport/add',{
      data
    }).then(data=>{
      const newAirports = data.data?.airports.map((airport)=>{return {id:airport.id,name:airport.name,City: airport?.City?.name}})
      setAirports({...airports,data: newAirports,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setAirports({...airports, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  const hanldeRemove = function(id){
    axios.delete(`/admin/target/airport/${id}`).then(data=>{
      const newAirports = data.data?.airports.map((airport)=>{return {id:airport.id,name:airport.name,City: airport?.City?.name}})
      setAirports({...airports,data: newAirports,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setAirports({...airports, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  useEffect(()=>{
    axios.get('/admin/target/airport/all').then((data)=>{
      const newAirports = data.data?.airports.map((airport)=>{return {id:airport.id,name:airport.name,City: airport?.City?.name}})
      setAirports({...airports,data: newAirports, isLoading:false,error:false});
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
            <Grid item xs={12} md={12} marginTop={3}>
                <FormControl style={{width:'100%'}}>
                <InputLabel id='city-label'>City</InputLabel>
                <Select   
                    labelId='city-label'  
                    required
                    id="city"
                    label="City"
                    margin='dense'
                    value={cityId}
                    fullWidth
                    onChange={(e)=>setCityId(e.target.value)}>
                        <MenuItem selected disabled>Select City</MenuItem>
                    {cities?.map((city)=>{
                        return <MenuItem value={city.id}>{city.name}</MenuItem>
                    })}
                </Select>
                </FormControl>
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
    {airports.message ? airports.error ? 
      <Alert severity='error'>{airports.message}</Alert> : 
      <Alert severity='success'>{airports.message}</Alert> : ''}
    <CardHeader title="Airports" action={<Button variant='outlined' onClick={()=>handleOpen()}>ADD</Button>}/>
    { airports.data.length != 0 && <SimpleTable items={airports.data} onRemoveHandler={hanldeRemove}/>}
    </CardRoot>
    </>
  );
}