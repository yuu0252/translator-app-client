import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Simple } from './translate/Simple';
import { ImageTranslation } from './translate/ImageTranslate';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Simple />} />
        <Route path="/image" element={<ImageTranslation />} />
      </Routes>
    </BrowserRouter>
  );
};
