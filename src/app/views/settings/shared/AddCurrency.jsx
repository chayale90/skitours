import React,{useState} from 'react';
import {Box,Dialog,DialogActions,DialogContent,DialogTitle,TextField, Grid,FormGroup,FormControlLabel,Checkbox,FormHelperText,Button} from '@mui/material';

function AddCurrency({handleSubmit,open,handleClose}) {
  const [code,setCode] = useState('');
  const [symbol,setSymbol] = useState('');
  const [exchangeRate, setExchangeRate] = useState();
  const [auto,setAuto] = useState(false);
  return (
    <Box>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Currency</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6}>
            <TextField
              required
              autoFocus
              margin="dense"
              id="code"
              placeholder='USD'
              label="Code"
              type="text"
              value={code}
              onChange={(e)=>setCode(e.target.value)}
            />
          </Grid>
          <Grid item sm={12} md={6}>
            <TextField
              required
              margin="dense"
              placeholder='$'
              id="symbol"
              label="Symbol"
              type="text"
              value={symbol}
              onChange={(e)=>setSymbol(e.target.value)}
            />
          </Grid>
        </Grid>
        <TextField 
          required
          margin='dense'
          placeholder='0.00'
          id="exchangeRate"
          label="Exchange Rate"
          type="number"
          value={exchangeRate}
          onChange={(e)=>setExchangeRate(e.target.value)}
          fullWidth
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={auto} onChange={()=>setAuto(!auto)} name="auto" />
            }
            label="Auto exchange rate."
          />
        </FormGroup>
        <FormHelperText>Note! Auto exchange rate will bi set from API on priodically basis.</FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={(e)=>handleSubmit(e,{
          code,
          symbol,
          exchangeRate,
          auto
        })} type="submit" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
  )
}

export default AddCurrency