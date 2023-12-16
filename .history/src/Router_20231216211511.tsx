import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './Home';
import { ImageTranslation } from './translation/ImageTranslate';
import { Simple } from './translation/Simple';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/translation/image" element={<ImageTranslation />} />
        <Route path="/translation/Simple" element={<Simple />} />
      </Routes>
    </BrowserRouter>
  );
};
