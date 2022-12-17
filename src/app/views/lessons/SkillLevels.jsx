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


const Assets = () => {

  const [skilllevels,setSkillLevels] = useState({
    data: [],
    isLoading: true,
    error: true,
    message: null
  });
  const [open,setOpen] = useState(false);
  const [name,setName] = useState('');
  const [type,setType] = useState('');

  function handleClose() {
    setOpen(false);
  }

  const onSubmitHandler = function(e){
    e.preventDefault();
    const data = {
      name,
      type
    }
    axios.post('/admin/storefront/add-skilllevel',{
      data
    }).then(data=>{
      setSkillLevels({...skilllevels,data: data.data.skilllevels,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setSkillLevels({...skilllevels, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  const hanldeRemove = function(id){
    axios.post('/admin/storefront/remove-skilllevel',{
      data:id
    }).then(data=>{
      setSkillLevels({...skilllevels,data: data.data.skilllevels,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setSkillLevels({...skilllevels, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  useEffect(()=>{
    axios.get('/admin/storefront/get-skilllevels').then((data)=>{
      setSkillLevels({...skilllevels,data: data.data.skilllevels, isLoading:false,error:false});
    }).catch(err=>{
      setSkillLevels({...skilllevels,message:err.message, isLoading:false,error:true});
    });
  },[]);

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Storefront", path: "/admin/storefront" }, { name: "Assets" }]} />
      </Box>
      <Box>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add Skill-Level</DialogTitle>
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
                <FormControl fullWidth style={{marginTop:'8px',marginBottom:'4px'}}>
                  <InputLabel id='skilllevel-type'>Type</InputLabel>
                <Select labelId='skilllevel-type' label="Type" value={type} onChange={(e)=>setType(e.target.value)}>
                  <MenuItem value="skiing">Skiing</MenuItem>
                  <MenuItem value="snowboarding">Snowboarding</MenuItem>
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
      {skilllevels.message ? skilllevels.error ? 
        <Alert severity='error'>{skilllevels.message}</Alert> : 
        <Alert severity='success'>{skilllevels.message}</Alert> : ''}
      <CardHeader title="SkillLevels" action={<Button variant='outlined' onClick={()=>setOpen(true)}>ADD</Button>}/>
      { skilllevels.data.length != 0 && <SimpleTable items={skilllevels.data} onRemoveHandler={hanldeRemove}/>}
      </CardRoot>
    </Container>
  );
};

export default Assets;
