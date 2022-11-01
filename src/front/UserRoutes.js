import Step1Screen from "./screens/Step1Screen";
import Step2Screen from "./screens/Step2Screen";
import Step3Screen from "./screens/Step3Screen";
import Step4Screen from "./screens/Step4Screen";
import Step5Screen from "./screens/Step5Screen";

const dashboardRoutes = [
  { path: '/' , element: <Step1Screen/> },
  { path: '/step2' , element: <Step2Screen/> },
  { path: '/step3' , element: <Step3Screen/> },
  { path: '/step4' , element: <Step4Screen/> },
  { path: '/step5' , element: <Step5Screen/> },
];

export default dashboardRoutes;