import { Box, styled} from '@mui/material';
import { Breadcrumb } from "app/components";
import Currency from './shared/Currency';

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));


const Assets = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Settings", path: "/admin/settings" }, { name: "Settings" }]} />
      </Box>

      <Currency/>

    </Container>
  );
};

export default Assets;