import React,{useState} from 'react';
import { Box, styled,Card, CardHeader, Button,Alert} from '@mui/material';
import { Breadcrumb } from "app/components";
import LessonTable from './shared/LessonTable';
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

const  lessonsData  = [
  {
    name: 'title',
    hours: '2',
    lesson_type: '0',
    number_of_people: '4',
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
    hours: '4',
    lesson_type: '1',
    number_of_people: '2',
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

const Lessons = () => {
  const navigate = useNavigate();
  const [lessons,setLessons] = useState({
    data: [...lessonsData],
    isLoading: true,
    error: true,
    message: null
  });
  const handleRemove = function(id){
    console.log("id",id);
    axios.delete(`/admin/lessons/${id}`).then(response=>{
      const {lessons:data,message} = response.data;
      setLessons({data,isLoading:false,error:false,message}) 
    }).catch(err=>{
      setLessons({...lessons,isLoading:false,error:true,message:err.message});
    });
  }

  useEffect(()=>{
    axios.get('/admin/lessons/all').then(response=>{
      const {lessons:data} = response.data;
      setLessons({data,isLoading:false,error:false,message:null}) 
    }).catch(err=>{
      setLessons({...lessons,isLoading:false,error:true,message:err.message});
    })
  },[]);

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Lessons" }]} />
      </Box>

      <CardRoot elevation={6}>
        {lessons.message ? lessons.error ? 
          <Alert severity='error'>{lessons.message}</Alert> : 
          <Alert severity='success'>{lessons.message}</Alert> : ""}
        <CardHeader title="Lessons" action={<Button variant='outlined' onClick={()=>(navigate('/admin/lessons/add'))}>ADD</Button>}/>
        { lessons.data.length != 0 && <LessonTable items={lessons.data} onRemoveHandler={handleRemove} />}
      </CardRoot>

    </Container>
  );
};

export default Lessons;