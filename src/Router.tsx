import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Simple } from "./translation/Simple";
import { Recording } from "./components/Recording";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/translation/simple" element={<Simple />} />
        <Route path="/recording" element={<Recording />} />
      </Routes>
    </BrowserRouter>
  );
};
