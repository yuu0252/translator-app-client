import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Simple } from './translation/Simple';
import { ImageTranslation } from './translation/ImageTranslate';

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
