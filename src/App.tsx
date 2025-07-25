import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";

import AppLayout from "./components/AppLayout";
import NotFound from "./components/NotFound";
import { TripPlannerProvider } from "./contexts/TripPlannerContext";

const App = () => {
  return (
    <TripPlannerProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="*" element={<NotFound />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </TripPlannerProvider>
  );
};

export default App;
