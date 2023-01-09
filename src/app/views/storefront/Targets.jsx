import { Box, styled} from '@mui/material';
import { Breadcrumb } from "app/components";
import Cities from './shared/Cities';
import Airports from './shared/Airports';

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
        <Breadcrumb routeSegments={[{ name: "Storefront", path: "/admin/storefront/targets" }, { name: "Targets" }]} />
      </Box>
      <Cities/>
      <Airports/>
    </Container>
  );
};

export default Assets;