import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import "react-tooltip/dist/react-tooltip.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />}>
          <Route path="*" element={<NotFound />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
