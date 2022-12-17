import { Alert, Box, Button, Card, Grid, styled, TextField,CircularProgress } from '@mui/material';
import { useNavigate,useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios.js';
import { useReducer } from 'react';
import { Helmet } from 'react-helmet';

const FlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: 'center',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default,
}));

const ResetPasswordRoot = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100vh !important',
  '& .card': {
    maxWidth: 800,
    margin: '1rem',
    borderRadius: 12,
  },
}));

// inital login credentials
const initialValues = {
  password: '',
  confirmPassword: ''
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be 6 character length')
    .required('Password is required!'),
  confirmPassword: Yup.string()
    .min(6, 'Password must be 6 character length')
    .required('Confirm Password is required!')
});

const reducer = function(state,action){
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {...state, message:action.payload, error:false,isLoading: false};
    case 'FETCH_ERROR':
      return {...state, message:action.payload, error:true,isLoading: false};
    case 'IS_LOADING':
      return {...state, isLoading:true};
    default:
      return state;
  }
}

const ResetPassword = () => {
  const {token} = useParams();
  console.log("Token",token);
  const navigate = useNavigate();
  const [state,dispatch] = useReducer(reducer,{
    message: null,
    error: false,
    isLoading: false
  })

  const handleFormSubmit = async (values) => {
    if(values.password !== values.confirmPassword){
      dispatch({type:"FETCH_ERROR",payload:"Password must match Confirm Password."});
      return;
    }
    dispatch({type:"IS_LOADING"})
    try {
      let response = await axios.post('/admin/api/auth/reset-password',{
        password:values.password,
        confirmPassword:values.confirmPassword,
        token
      });
      dispatch({type:"FETCH_SUCCESS",payload:response.data.message})
    } catch (error) {
      console.log('error',error);
      dispatch({type:"FETCH_ERROR",payload:error.message})
    }
  };

  return (
    <ResetPasswordRoot>
      <Helmet>
        <title>Snow Fun | ResetPassword</title>
      </Helmet>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <JustifyBox p={4}>
              <img width="300" src="/assets/images/illustrations/dreamer.svg" alt="" />
            </JustifyBox>
            {state.message ? state.error ? (<Alert severity='error' style={{margin:"2rem"}}>{state.message}</Alert>) : (<Alert severity='success' style={{margin:"2rem"}}>{state.message}</Alert>) : ''}
            <ContentBox>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  type="password"
                  name="password"
                  size="small"
                  label="Password"
                  variant="outlined"
                  onBlur={handleBlur}
                  value={values.password}
                  onChange={handleChange}
                  helperText={touched.password && errors.password}
                  error={Boolean(errors.password && touched.password)}
                  sx={{ mb: 3, width: '100%' }}
                />
                <TextField
                  type="password"
                  name="confirmPassword"
                  size="small"
                  label="Confirm Password"
                  variant="outlined"
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                  onChange={handleChange}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  error={Boolean(errors.confirmPassword && touched.confirmPassword)}
                  sx={{ mb: 3, width: '100%' }}
                />

                <Button fullWidth variant="contained" color="primary" type="submit">
                  Submit
                </Button>

                <Button
                  fullWidth
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate('/admin/session/signin')}
                  sx={{ mt: 2 }}
                >
                  Login
                </Button>
              </form>
              )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </ResetPasswordRoot>
  );
};

export default ResetPassword;
