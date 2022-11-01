import { Box, styled} from '@mui/material';
import { Breadcrumb } from "app/components";
import Vehicles from './shared/Vehicles';
import Airports from './shared/Airports';
import Helments from './shared/Helments';
import Equipments from './shared/Equipments';
import LessonTypes from './shared/LessonType';
import SkillLevels from './shared/SkillLevel';

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
        <Breadcrumb routeSegments={[{ name: "Storefront", path: "/admin/storefront" }, { name: "Assets" }]} />
      </Box>

      <Vehicles/>
      <Airports/>
      <Helments/>
      <Equipments/>
      <LessonTypes/>
      <SkillLevels/>

    </Container>
  );
};

export default Assets;
