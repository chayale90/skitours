import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import DeleteIcon from '@mui/icons-material/Delete';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Grid, TextField } from '@mui/material';
import axios from 'axios.js';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
  { 
    id: 'title', 
    label: 'Name', 
    minWidth: 170,
    paddingLeft:'1.5rem'
  },
  {
    id: 'en',
    label: 'English',
    minWidth: 170,
    align: 'left'
  },
  {
    id: 'he',
    label: 'Hebrew',
    minWidth: 170,
    align: 'left'
  }
];

function createData(data) {
  console.log("Date",data);
  var rows = Object.keys(data).map((key,i)=>{
    let title = key;
    let en = data[key].en;
    let he = data[key].he;
    return {title,en,he};
  })
  return rows;
}



export default function LanguagesTable({data,handleUpdateTranslation,handleDeleteTranslation}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [open, setOpen] = React.useState(false);
  const [title,setTitle] = React.useState('');
  const [hebrewText,setHebrewText] = React.useState('');
  const [englishText,setEnglishText] = React.useState('');
  const rows = createData(data);


  const handleClickOpen = (t) => {
    setTitle(t);
    console.log("English",data[t].en,englishText,hebrewText);
    setHebrewText(data[t].he);
    setEnglishText(data[t].en);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    setOpen(false);
    handleUpdateTranslation(title,englishText,hebrewText);
  }

  const handleRemove = () => {
    setOpen(false);
    handleDeleteTranslation(title);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth,paddingLeft: column.paddingLeft }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.title}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} onClick={(e)=>handleClickOpen(row.title)} align={column.align} style={{paddingLeft:column.paddingLeft}}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20, 30, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Update '{title}'</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Translation will be updated on fronend immediately. So be careful while updating any translation prop.
          </DialogContentText>
          <Grid container spacing={2} style={{marginTop:'1rem'}}>
            <Grid item sm={6}>
            <TextField id='english-text' label="English" value={englishText} defaultValue={data[title]?.en} onChange={(e)=>setEnglishText(e.target.value)} style={{width:'100%'}}/>
            </Grid>
            <Grid item sm={6}>
            <TextField id="hebrew-text" label="Hebrew" value={hebrewText} defaultValue={data[title]?.he} onChange={(e)=>setHebrewText(e.target.value)} style={{width:'100%'}}/>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container>
            <Grid item sm={4}>
              <Button variant='outlined' color="error" startIcon={<DeleteIcon/>} onClick={handleRemove}>Remove</Button>
            </Grid>
            <Grid item sm={8} style={{textAlign:"right"}}>
              <Button onClick={handleUpdate}>Update</Button>
              <Button onClick={handleClose}>Discard</Button>
            </Grid>
          </Grid>
        </DialogActions>
    </Dialog>
    </>
  );
}