import {CardHeader,Alert,Button,Card,styled,CardContent} from '@mui/material';
import React,{useState} from 'react';
import axios from 'axios.js';
import SimpleTable from './SimpleTable';
import AddCurrency from './AddCurrency';
import { useEffect } from 'react';
import UpdateCurrency from './UpdateCurrency';

const CardRoot = styled(Card)(() => ({
  height: '100%',
  padding: '20px 24px',
  marginTop: '2rem',
}));

export default function Currency() {
  const [open,setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [currencies,setCurrencies] = useState([]);
  const [currencyToUpdate, setCurrencyToUpdate] = useState(null);
  const [message, setMessage] = useState({
    type:null,
    text: ''
  });

  function handleClose() {
    setOpen(false);
  }

  function hanldeCloseAdd(){
    setOpenAdd(false);
    setCurrencyToUpdate(null);
  }

  const handleRemove = function(value){
    axios.delete('/admin/settings/currency',{
      data:{
        id:value
      }
    }).then(data=>{
      console.log(data);
      setMessage({type:'success',text: data.data.message});
      setCurrencies(data.data.currencies);
    }).catch(err=>{
      setMessage({type:'error',text: err.message});
    })
  }

  const updateCurrency = function(e,data){
    e.preventDefault();
    axios.put('/admin/settings/currency',{
      id: data.id,
      code: data.code,
      symbol: data.symbol,
      exchangeRate: data.exchangeRate,
      auto: data.auto
    }).then(data=>{
      console.log(data);
      setMessage({type:'success',text: data.data.message});
      setCurrencies(data.data.currencies);
      setOpenAdd(false);
    }).catch(err=>{
      setMessage({type:'error',text: err.message});
      setOpenAdd(false);
    })
  }

  const handleAddOpen = function(id){
    setOpenAdd(true);
    let item = currencies.find(c=>{
      return c.id === id
    });
    console.log('item>>',item);
    setCurrencyToUpdate(item);
  }

  const addCurrency = function(e,data){
    e.preventDefault();
    axios.post('/admin/settings/currency',{
      code: data.code,
      symbol: data.symbol,
      exchangeRate: data.exchangeRate,
      auto: data.auto
    }).then(data=>{
      console.log(data);
      setMessage({type:'success',text: data.data.message});
      setCurrencies(data.data.currencies);
      setOpen(false);
    }).catch(err=>{
      setMessage({type:'error',text: err.message});
      setOpen(false);
    })
  }

  useEffect(()=>{
    axios.get('/admin/settings/currency').then((data)=>{
      console.log("Data",data);
      setCurrencies(data.data.currencies);
    }).catch(err=>{
      setMessage({type:'error',text: err.message});
    })
  },[])

  return (
    <>
    <AddCurrency handleSubmit={addCurrency} open={open} handleClose={handleClose}/>
    {currencyToUpdate && <UpdateCurrency handleSubmit={updateCurrency} open={openAdd} handleClose={hanldeCloseAdd} item={currencyToUpdate} />}
    <CardRoot elevation={6}>
    {message.text ? message.type === 'error' ? 
      <Alert severity='error'>{message.text}</Alert> : 
      <Alert severity='success'>{message.text}</Alert> : ''}
    <CardHeader title={"Currency"} action={<Button variant='outlined' onClick={()=>setOpen(true)}>Add</Button>}/>
      <CardContent>
        { currencies.length != 0 && <SimpleTable items={currencies} onRemoveHandler={handleRemove} onEditHandler={handleAddOpen}/>}
      </CardContent>
    </CardRoot>
    </>
  );
}