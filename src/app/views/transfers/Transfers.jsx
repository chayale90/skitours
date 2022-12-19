import React,{useState} from 'react';
import { Box, styled,Card, CardHeader, Button,Alert} from '@mui/material';
import { Breadcrumb } from "app/components";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Vehicles from './shared/Vehicles';
import Airports from './shared/Airports';
import axios from 'axios.js';

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

const Transfers = () => {
  const navigate = useNavigate();

  useEffect(()=>{

  },[]);

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Transfers" }]} />
      </Box>

      <CardRoot elevation={6}>
        <Vehicles/>
        <Airports/>
      </CardRoot>

    </Container>
  );
};

export default Transfers;