import React from 'react';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../index.css';
import "react-datepicker/dist/react-datepicker.css";

function UserLayout() {
  return (
    <>
      <Outlet/>
    </>
  )
}

export default UserLayout