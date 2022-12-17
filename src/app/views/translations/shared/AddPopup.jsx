import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TextField, Grid,Button} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function AddPopup({open,setOpen,handleAddTranslation}) {
  const [title,setTitle] = React.useState('');
  const [hebrewText,setHebrewText] = React.useState('');
  const [englishText,setEnglishText] = React.useState('');
  const [error,setError] = React.useState({
    value: false,
    message: ''
  });

  const handleAdd = () => {
    if(title.length <= 0){
      setError({value:true,message:'Is required'});
      return;
    }else{
      setError({value:false,message:''});
    }
    handleAddTranslation(title,englishText,hebrewText);
    setOpen(false);
  }

  const handleClose = () => {
    setTitle('');
    setHebrewText('');
    setEnglishText('');
    setOpen(false);
  };

  return (
    <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
  >
    <DialogTitle>Add Translation</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">
        Translation need to be added on frontend as well. So please contact developer to add new text on fronend. Then you can add translation for it with given 'title'.
      </DialogContentText>
      <Grid container style={{marginTop: '1rem'}}>
        <Grid item sm={12}>
          <TextField 
            error={error.value}
            id="title" label="title" 
            value={title} 
            helperText={error.message}
            onChange={(e)=>setTitle(e.target.value)} style={{width: '100%'}} />
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{marginTop:'1rem'}}>
        <Grid item sm={6}>
        <TextField id='english-text' label="English" value={englishText} onChange={(e)=>setEnglishText(e.target.value)} style={{width:'100%'}}/>
        </Grid>
        <Grid item sm={6}>
        <TextField id="hebrew-text" label="Hebrew" value={hebrewText} onChange={(e)=>setHebrewText(e.target.value)} style={{width:'100%'}}/>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleAdd}>Add</Button>
      <Button onClick={handleClose}>Discard</Button>
    </DialogActions>
  </Dialog>
  )
}

export default AddPopup