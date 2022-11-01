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
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));


const LessonTable = ({items, onRemoveHandler}) => {
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
                if(key === 'lesson_type'){
                  return value === '0' ? <TableCell key={i}>{"Group"}</TableCell> : <TableCell key={i}>{"Private"}</TableCell>;
                }if(key === 'hours'){
                  return <TableCell key={i}>{value+" hrs"}</TableCell>
                }if(key === 'days'){
                  return <TableCell key={i}>{value.length + " day(s)"}</TableCell>
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

export default LessonTable;
