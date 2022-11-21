import React from 'react';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../index.css';
import "react-datepicker/dist/react-datepicker.css";
import { Helmet } from 'react-helmet';

function UserLayout() {
  return (
    <>
      <Helmet>
        <title>Snow Fun</title>
      </Helmet>
      <Outlet/>
    </>
  )
}

export default UserLayout