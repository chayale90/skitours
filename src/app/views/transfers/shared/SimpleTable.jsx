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
  
  const StyledTable = styled(Table)(({ theme }) => ({
    whiteSpace: "pre",
    "& thead": {
      "& tr": { "& th": { paddingLeft: 0, paddingRight: 0, textTransform: "capitalize" } },
    },
    "& tbody": {
      "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
    },
  }));
  
  
  const SimpleTable = ({items, onRemoveHandler}) => {
    const headings = Object.keys(items[0]);
  
    const handleRemove = function(id){
      onRemoveHandler(id);
    }
    return (
      <Box width="100%" overflow="auto" style={{padding:'1rem'}}>
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
                    return <TableCell key={i}>{"₪ " + value}</TableCell>
                  }
                  return <TableCell key={i}>{value}</TableCell>
                }))}
                <TableCell align="right">
                  <IconButton onClick={()=>handleRemove(item.id)}>
                    <Icon color="error">close</Icon>
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
  