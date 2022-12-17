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

export default function LessonTypes() {
  const [lessontypes,setLessontypes] = useState({
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
    axios.post('/admin/storefront/add-lessontype',{
      data
    }).then(data=>{
      setLessontypes({...lessontypes,data: data.data.lessontypes,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setLessontypes({...lessontypes, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  const hanldeRemove = function(id){
    axios.post('/admin/storefront/remove-lessontype',{
      data:id
    }).then(data=>{
      setLessontypes({...lessontypes,data: data.data.lessontypes,message:data.data.message, isLoading:false, error: false});
      setOpen(false);
    }).catch(err=>{
      setLessontypes({...lessontypes, message:err.message, isLoading:false, error: true});
      setOpen(false);
    })
  }

  useEffect(()=>{
    axios.get('/admin/storefront/get-lessontypes').then((data)=>{
      setLessontypes({...lessontypes,data: data.data.lessontypes, isLoading:false,error:false});
    }).catch(err=>{
      setLessontypes({...lessontypes,message:err.message, isLoading:false,error:true});
    });
  },[]);

  return (
    <>
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add LessonType</DialogTitle>
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
    {lessontypes.message ? lessontypes.error ? 
      <Alert severity='error'>{lessontypes.message}</Alert> : 
      <Alert severity='success'>{lessontypes.message}</Alert> : ''}
    <CardHeader title="LessonTypes" action={<Button variant='outlined' onClick={()=>setOpen(true)}>ADD</Button>}/>
    { lessontypes.data.length != 0 && <SimpleTable items={lessontypes.data} onRemoveHandler={hanldeRemove}/>}
    </CardRoot>
    </>
  );
}