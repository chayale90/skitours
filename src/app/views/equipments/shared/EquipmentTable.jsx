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
  import { useNavigate } from "react-router-dom";
  
  const StyledTable = styled(Table)(({ theme }) => ({
    whiteSpace: "pre",
    "& thead": {
      "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
    },
    "& tbody": {
      "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
    },
  }));
  
  
  const EquipmentTable = ({items, onRemoveHandler}) => {
    const headings = Object.keys(items[0]);
    const navigate = useNavigate();
  
    const handleRemove = function(id){
      onRemoveHandler(id);
    }
    const handleEdit = function(id){
      navigate('/admin/equipments/edit/'+id);
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
                  if(key === 'lesson_type'){
                    return value === 'group' ? <TableCell key={i}>{"Group"}</TableCell> : <TableCell key={i}>{"Private"}</TableCell>;
                  }if(key === 'hours'){
                    return <TableCell key={i}>{value+" hrs"}</TableCell>
                  }if(key === 'days'){
                    return <TableCell key={i}>{value.length + " day(s)"}</TableCell>
                  }
                  return <TableCell key={i}>{value}</TableCell>
                }))}
                <TableCell align="right">
                  <IconButton sx={{backgroundColor:"green",marginRight:"0.7rem"}} onClick={()=>handleEdit(item.id)} >
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
  
  export default EquipmentTable;
  