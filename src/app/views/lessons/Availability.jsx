import { Box, Button, Card, CardContent, Grid, styled, Typography} from '@mui/material';
import { Breadcrumb } from "app/components";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));


const Assets = () => {
  function createData(hours, slot) {
    return { hours,slot };
  }
  
  const rows = [
    createData(2,'11:00-13:00'),
    createData(2,'13:00-15:00'),
    createData(2,'15:00-17:00'),
    createData(4,'11:00-15:00'),
    createData(4,'15:00-19:00')
  ];
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Lessons", path: "/admin/lessons" }, { name: "Availability" }]} />
      </Box>
      <Card>
        <CardContent>
          <Grid container sm={12} style={{marginBottom:'2rem'}}>
            <Grid item sm={6}>
              <Typography gutterBottom variant="h5" component="div">
                Group
              </Typography>
            </Grid>
            <Grid item sm={6} style={{textAlign:'right'}}>
              <Button variant='outlined'>Add</Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Hours</TableCell>
                  <TableCell align="left">Slots</TableCell>
                  <TableCell align="left">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.hours}
                    </TableCell>
                    <TableCell align="left">{row.slot}</TableCell>
                    <TableCell align="left">Button</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </CardContent>
      </Card>
    </Container>
  );
};

export default Assets;
