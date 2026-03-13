import { BrowserRouter, Routes, Route } from "react-router-dom";
import InternsHubOverview from "./pages/InternsHubOverview";
import LearningFramework from "./pages/LearningFramework";
import HowItWorks from "./pages/How-It-Works";
import CollegePartnership from "./pages/college-partnership";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PAGE 1 */}
        <Route path="/" element={<InternsHubOverview />} />

        {/* PAGE 2 */}
        <Route path="/learning-framework" element={<LearningFramework />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/college-partnership" element={<CollegePartnership />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
