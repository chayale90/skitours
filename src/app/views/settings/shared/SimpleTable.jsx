import {
  Box,
  Icon,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import useAuth from "app/hooks/useAuth";

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));


const SimpleTable = ({items, onRemoveHandler, onEditHandler}) => {
  const {currency} = useAuth();
  const headings = Object.keys(items[0]);

  const handleRemove = function(id){
    onRemoveHandler(id);
  }
  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            {headings.map((heading,i)=>{
              return <TableCell key={i}>{heading}</TableCell>
            })}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              {Object.values(item).map(((value,i)=>{
                let key = Object.keys(item)[i];
                if(key === 'price'){
                  return <TableCell key={i}>{value + " " + currency.symbol}</TableCell>
                }
                if(key === 'auto'){
                  return <TableCell key={i}>{value ? <Icon color="success">check</Icon> : <Icon color="error">close</Icon>}</TableCell>
                }
                return <TableCell key={i}>{value}</TableCell>
              }))}
              <TableCell align="right">
              <IconButton sx={{backgroundColor:"green",marginRight:"0.7rem"}} onClick={()=>onEditHandler(item.id)}>
                  <Icon sx={{color:"white"}}>edit</Icon>
                </IconButton>
                <IconButton sx={{backgroundColor:"red"}} onClick={()=>handleRemove(item.id)}>
                  <Icon sx={{color:"white"}}>delete</Icon>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </Box>
  );
};

export default SimpleTable;
