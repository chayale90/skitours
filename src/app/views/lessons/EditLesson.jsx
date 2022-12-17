import React,{useState} from 'react';
import { Box, styled,Card, CardHeader, Button,Alert,Grid,TextField,InputAdornment,FormControl,Select,MenuItem,InputLabel,List,ListItem,ListItemText,Icon,Tooltip, CardActions} from '@mui/material';
import { Breadcrumb } from "app/components";
import { useReducer } from 'react';
import axios from 'axios.js';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Loading from 'front/components/MatxLoading';

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

const reducer = function(state,action){
  switch (action.type) {
    case "SAVE_FIELD":
      return {...state,[action.payload.name]:{isValid:true,value:action.payload.value}};
    case "ADD_DAY":{
      let days = [];
      let dayPlusExist = state.days.find((d)=>{
        return Object.keys(d)[0] == 'Day_plus';
      })
      if(action.payload.day === 'day-normal'){
        let key = dayPlusExist ? "Day_"+state.days.length : "Day_"+(state.days.length + 1);
        days = [...state.days, {[key]:action.payload.price}];
      }if(action.payload.day === 'day-plus'){
        if(dayPlusExist) return {...state}
        days = [...state.days, {Day_plus:action.payload.price}];
      }
      return {...state,days};
    }
    case "SET_LESSON":{
      return {...state,name:{...state.name,value:action.payload.name},lesson_type:{value:action.payload.lesson_type},hours:{value:action.payload.hours},number_of_people:{...state.number_of_people,value:action.payload.number_of_people},days:action.payload.days};
    }
    case "REMOVE_DAY":{
      let days = state.days;
      days.splice(action.payload,1);
      return {...state, days}
    }
    case "SET_ISVALID":
      return {...state,[action.payload.field]:{...state[action.payload.field],isValid:action.payload.value}};
    case "ERROR_MESSAGE":
      return {...state,message:action.payload,error:true};
    default:
      return {...state};
  }
}

const EditLesson = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [lesson,setLesson] = useState(null);
  const [day,setDay] = useState('day-normal');
  const [price,setPrice] = useState(0);
  const [state,dispatch] = useReducer(reducer,{
    error: false,
    message: '',
    name: {
      value: '',
      isValid: true
    },
    lesson_type: {
      value: 'private'
    },
    hours: {
      value: '2'
    },
    number_of_people: {
      value: '1',
      isValid: true
    },
    days: []
  })

  const addDay = function(e){
    dispatch({type:'ADD_DAY',payload:{day,price}});
  }

  const changeField = function(e){
    dispatch({type:"SAVE_FIELD",payload:{name:e.target.name,value:e.target.value}});
  }

  const submitLesson = function(e){
    let isValid = true;
    if(state.name.value === ''){
      dispatch({type:"SET_ISVALID", payload:{field:'name',value:false}});
      isValid = false;
    }if(state.number_of_people.value <= 0){
      dispatch({type:"SET_ISVALID", payload:{field:'number_of_people',value:false}});
      isValid = false;
    }if(state.days.length === 0){
      dispatch({type:"ERROR_MESSAGE", payload: "Please add some days."});
      isValid = false;
    }
    if(!isValid) return;
    const data = {
      name:state.name.value,
      hours:state.hours.value,
      lesson_type:state.lesson_type.value,
      number_of_people:state.number_of_people.value,
      days:state.days
    }

    axios.post('/admin/lessons/update',{
      id,
      data
    }).then(data=>{
      console.log('response>>',data);
      navigate('/admin/lessons');
    }).catch(err=>{
      dispatch({type:"ERROR_MESSAGE", payload: err.message});
    })
  }

  const removeDay = function(id){
    dispatch({type:"REMOVE_DAY",payload:id});
  }

  useEffect(()=>{
    axios.get('/admin/lessons/'+id).then(response=>{
      dispatch({type:"SET_LESSON", payload: response.data.lesson});
      setLesson(response.data.lesson);
      console.log("Lesson",response);
    }).catch(err=>{
      dispatch({type:"ERROR_MESSAGE",payload: err.message});
    })
  },[]);

  if(!lesson) return <Loading/>;

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Lessons", path: "/admin/lessons" }, { name: "Add Lesson" }]} />
      </Box>

      <CardRoot elevation={6}>
        {state.message ? state.error ? 
          <Alert severity='error'>{state.message}</Alert> : 
          <Alert severity='success'>{state.message}</Alert> : ''}
        <CardHeader title="Edit Lesson"/>
        <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
              required
              autoFocus
              margin="dense"
              {...(state.name.isValid ? {} : {error:true})}
              id="name"
              name='name'
              label="Name"
              type="text"
              value={state.name.value}
              onChange={(e)=>changeField(e)}
              fullWidth
            />
            </Grid>
            <Grid item xs={12} md={3}>
            <FormControl fullWidth style={{marginTop:'8px',marginBottom:'4px'}}>
              <InputLabel id="lesson-type-label">Lesson Type</InputLabel>
              <Select
                labelId="lesson-type-label"
                id="lesson-type-select"
                value={state.lesson_type.value}
                name="lesson_type"
                label="Lesson Type"
                onChange={(e)=>changeField(e)}
              >
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="group">Group</MenuItem>
              </Select>
            </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth style={{marginTop:'8px',marginBottom:'4px'}}>
                <InputLabel id="hours-label">Hours</InputLabel>
                <Select
                  labelId="hours-label"
                  id="hours-select"
                  value={state.hours.value}
                  name="hours"
                  label="Hours"
                  onChange={(e)=>changeField(e)}
                >
                  <MenuItem value={2}>2 hours</MenuItem>
                  <MenuItem value={4}>4 hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
            <TextField
                required
                margin="dense"
                id="numberOfPeople"
                label="Number Of People"
                name='number_of_people'
                type="number"
                {...(state.number_of_people.isValid ? {} : {error:true})}
                value={state.number_of_people.value}
                onChange={(e)=>changeField(e)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₪</InputAdornment>,
                }}
                fullWidth
              />
            </Grid>
        </Grid>
          <h5 style={{'margin':'2rem 0'}}>Add Days <Tooltip title="Plus Day price will be apply on extra days which are not added in the Lesson." placement='top'><Icon>info</Icon></Tooltip></h5>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth style={{marginTop:'8px',marginBottom:'4px'}}>
                <InputLabel id="hours-label">Day</InputLabel>
                <Select
                  labelId="day-label"
                  id="day-select"
                  value={day}
                  name="day"
                  label="day"
                  onChange={(e)=>setDay(e.target.value)}
                >
                  <MenuItem value="day-normal">Day</MenuItem>
                  <MenuItem value="day-plus">Day plus</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
            <TextField
                required
                margin="dense"
                id="price"
                label="Price"
                name='price'
                type="number"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₪</InputAdornment>,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant='outlined' style={{marginTop:"8px",marginBottom:"4px",height:"82%",width:"100%"}} onClick={(e)=>addDay(e)}>ADD DAY</Button>
            </Grid>
          </Grid>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {state.days.map((item,i) => {
              let keys = Object.keys(item)
              let values = Object.values(item)
              return <ListItem
                key={i}
                disableGutters>
                <ListItemText primary={`${keys[0]}`}  secondary={`₪ ${values[0]}`} />
                <Icon color='error' style={{cursor:'pointer'}} onClick={(e)=>removeDay(i)}>close</Icon>
              </ListItem>
            })}
          </List>
          <CardActions style={{justifyContent:"center"}}>
            <Button variant='contained' color='secondary' onClick={(e)=>submitLesson(e)}>Update</Button>
          </CardActions>
      </CardRoot>

    </Container>
  );
};

export default EditLesson;