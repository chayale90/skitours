import { Alert, Box, styled,Button} from '@mui/material';
import { Breadcrumb } from "app/components";
import { useEffect } from 'react';
import axios from 'axios.js';
import LanguagesTable from './shared/LanguagesTable';
import { useState } from 'react';
import { sortObj } from '../utils';
import Snackbar from '@mui/material/Snackbar';
import AddPopup from './shared/AddPopup';

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const Translations = () => {

  const [translations,setTranslations] = useState([]);
  const [error,setError] = useState(false);
  const [message,setMessage] = useState('');
  const [open,setOpen] = useState(false);
  const [openAdd,setOpenAdd] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleUpdateTranslation = (title,en,he) => {
    axios.patch('/admin/translations',{
      title,
      en,
      he
    }).then((response) => {
      let obj = sortObj(response.data.translations);
      setTranslations(obj);
      setError(false);
      setOpen(true);
      setMessage(response.data.message);
    }).catch((err) => {
      setError(true);
      setOpen(true);
      setMessage(err.message);
    });
  }

  const handleAddTranslation = (title,en,he) => {
    axios.post('/admin/translations',{
      title,en,he
    }).then((response)=>{
      let obj = sortObj(response.data.translations);
      setTranslations(obj);
      setError(false);
      setOpen(true);
      setMessage(response.data.message);
    }).catch((err)=>{
      setError(true);
      setOpen(true);
      setMessage(err.message);
    })
  }

  const handleDeleteTranslation = (title) => {
    axios.delete('/admin/translations',{
      data:{
        title
      }
    }).then((response)=>{
      let obj = sortObj(response.data.translations);
      setTranslations(obj);
      setError(false);
      setOpen(true);
      setMessage(response.data.message);
    }).catch((err)=>{
      setError(true);
      setOpen(true);
      setMessage(err.message);
    });
  }

  useEffect(()=>{
    axios.get('/admin/translations').then(response=>{
      let obj = sortObj(response.data);
      setTranslations(obj);
    })
  },[]);
  return (
    <Container>
      <Box className="breadcrumb" style={{display:'flex',justifyContent:'space-between'}}>
        <Breadcrumb routeSegments={[{ name: "Translations", path: "/admin/translations" }, { name: "Translations" }]} />
        <Button variant='outlined' onClick={()=>setOpenAdd(true)}>Add</Button>
      </Box>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity={error ? 'error' : 'success'}>{message}</Alert>
      </Snackbar>
      <LanguagesTable data={translations} handleDeleteTranslation={handleDeleteTranslation} handleUpdateTranslation={handleUpdateTranslation}/>
      <AddPopup open={openAdd} setOpen={setOpenAdd} handleAddTranslation={handleAddTranslation}/>
    </Container>
  );
};

export default Translations;