import React,{useState} from 'react';
import { Box, styled,Card, CardHeader, Button,Alert} from '@mui/material';
import { Breadcrumb } from "app/components";
import LessonTable from './shared/LessonTable';

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

const EditLesson = () => {
  const [lessons,setLessons] = useState({
    data: [],
    isLoading: true,
    error: true,
    message: null
  });
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Storefront", path: "/admin/storefront" }, { name: "Lessons" }]} />
      </Box>

      <CardRoot elevation={6}>
        {lessons.message ? lessons.error ? 
          <Alert severity='error'>{lessons.message}</Alert> : 
          <Alert severity='success'>{lessons.message}</Alert> : ''}
        <CardHeader title="Add Lesson"/>
      </CardRoot>

    </Container>
  );
};

export default EditLesson;