import React,{useState} from 'react';
import { Box, styled,Card, CardHeader, Button,Alert} from '@mui/material';
import { Breadcrumb } from "app/components";
import EquipmentTable from './shared/EquipmentTable';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios.js';

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const  equipmentsData  = [
  {
    name: 'title',
    age_type: 'Adult',
    days: [
      {
        name: 'Day_1',
        price: '234'
      },
      {
        name: 'Day_2',
        price: '233'
      },
      {
        name: 'Day_3',
        price: '264'
      }
    ]
  },
  {
    name: 'title 2',
    age_type: 'Child',
    days: [
      {
        name: 'Day_1',
        price: '34'
      },
      {
        name: 'Day_2',
        price: '36'
      },
      {
        name: 'Day_3',
        price: '45'
      }
    ]
  }
]

const CardRoot = styled(Card)(() => ({
  height: '100%',
  padding: '20px 24px',
  marginTop: '2rem',
}));

const Equipments = () => {
  const navigate = useNavigate();
  const [equipments,setEquipments] = useState({
    data: [...equipmentsData],
    isLoading: true,
    error: true,
    message: null
  });
  const handleRemove = function(id){
    axios.delete(`/admin/equipments/${id}`).then(response=>{
      const {equipments:data,message} = response.data;
      setEquipments({data,isLoading:false,error:false,message}) 
    }).catch(err=>{
      setEquipments({...equipments,isLoading:false,error:true,message:err.message});
    });
  }

  useEffect(()=>{
    axios.get('/admin/equipments/all').then(response=>{
      const {equipments:data} = response.data;
      setEquipments({data,isLoading:false,error:false,message:null}) 
    }).catch(err=>{
      setEquipments({...equipments,isLoading:false,error:true,message:err.message});
    })
  },[]);

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Equipments" }]} />
      </Box>

      <CardRoot elevation={6}>
        {equipments.message ? equipments.error ? 
          <Alert severity='error'>{equipments.message}</Alert> : 
          <Alert severity='success'>{equipments.message}</Alert> : ""}
        <CardHeader title="Equipments" action={<Button variant='outlined' onClick={()=>(navigate('/admin/equipments/add'))}>ADD</Button>}/>
        { equipments.data.length != 0 && <EquipmentTable items={equipments.data} onRemoveHandler={handleRemove} />}
      </CardRoot>

    </Container>
  );
};

export default Equipments;