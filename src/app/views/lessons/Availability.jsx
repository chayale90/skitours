import { Breadcrumb } from "app/components";

import { Box, CardHeader,Alert,Button,Card,styled, Grid, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React,{useState,useEffect} from 'react';
import axios from 'axios.js';
import SimpleTable from './shared/SimpleTable';

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const CardRoot = styled(Card)(() => ({
  height: '100%',
  padding: '20px 24px',
  marginTop: '2rem',
}));


const AvailabilityTable = () => {

  const [availabilities,setAvailabilities] = useState({
    data: [],
    isLoading: true,
    error: true,
    message: null
  });
  const [open,setOpen] = useState(false);
  const [timing,setTiming] = useState('');
  const [hours,setHours] = useState('');

  function handleClose() {
    setOpen(false);
  }

  const onSubmitHandler = function(e){
    e.preventDefault();
    const data = {
      timing,
      hours
    }
    axios.post('/admin/availability/add-availability',{
      data
    }).then(data=>{
      setAvailabilities({...availabilities,data: data.data.availabilities,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setAvailabilities({...availabilities, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  const hanldeRemove = function(id){
    axios.post('/admin/availability/remove-availability',{
      data:id
    }).then(data=>{
      setAvailabilities({...availabilities,data: data.data.availabilities,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setAvailabilities({...availabilities, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  useEffect(()=>{
    axios.get('/admin/availability/get-availabilities').then((data)=>{
      setAvailabilities({...availabilities,data: data.data.availabilities, isLoading:false,error:false});
    }).catch(err=>{
      setAvailabilities({...availabilities,message:err.message, isLoading:false,error:true});
    });
  },[]);

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Lessons", path: "/admin/lessons" }, { name: "Availability" }]} />
      </Box>
      <Box>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add Availability</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="timing"
                  label="Timing"
                  type="text"
                  value={timing}
                  onChange={(e)=>setTiming(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth style={{marginTop:'8px',marginBottom:'4px'}}>
                  <InputLabel id='hours'>Hours</InputLabel>
                <Select labelId='hours' label="Hours" value={hours} onChange={(e)=>setHours(e.target.value)}>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="4">4</MenuItem>
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
      {availabilities.message ? availabilities.error ? 
        <Alert severity='error'>{availabilities.message}</Alert> : 
        <Alert severity='success'>{availabilities.message}</Alert> : ''}
      <CardHeader title="Availability" action={<Button variant='outlined' onClick={()=>setOpen(true)}>ADD</Button>}/>
      { availabilities.data.length != 0 && <SimpleTable items={availabilities.data} onRemoveHandler={hanldeRemove}/>}
      </CardRoot>
    </Container>
  );
};

export default AvailabilityTable;
