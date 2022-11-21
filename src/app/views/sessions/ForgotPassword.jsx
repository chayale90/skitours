import { Alert, Box, Button, Card, Grid, styled, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const ForgotPasswordRoot = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100vh !important',
  '& .card': {
    maxWidth: 800,
    margin: '1rem',
    borderRadius: 12,
  },
}));

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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [state,dispatch] = useReducer(reducer,{
    message: null,
    error: false,
    isLoading: false
  })

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    dispatch({type:"IS_LOADING"})
    try {
      let response = await axios.post('/admin/api/auth/forgot-password',{
        email
      });
      dispatch({type:"FETCH_SUCCESS",payload:response.data.message})
    } catch (error) {
      dispatch({type:"FETCH_ERROR",payload:error.message})
    }
  };

  return (
    <ForgotPasswordRoot>
      <Helmet>
        <title>Snow Fun | ForgotPassword</title>
      </Helmet>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <JustifyBox p={4}>
              <img width="300" src="/assets/images/illustrations/dreamer.svg" alt="" />
            </JustifyBox>
            {state.message ? state.error ? (<Alert severity='error' style={{margin:"2rem"}}>{state.message}</Alert>) : (<Alert severity='success' style={{margin:"2rem"}}>{state.message}</Alert>) : ''}
            <ContentBox>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  type="email"
                  name="email"
                  size="small"
                  label="Email"
                  value={email}
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 3, width: '100%' }}
                />

                <LoadingButton
                      type="submit"
                      color="primary"
                      loading={state.isLoading}
                      variant="contained"
                      fullWidth
                    >
                      Reset password
                </LoadingButton>

                <Button
                  fullWidth
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{ mt: 2 }}
                >
                  Go Back
                </Button>
              </form>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </ForgotPasswordRoot>
  );
};

export default ForgotPassword;
