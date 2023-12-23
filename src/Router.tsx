import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Simple } from './translate/Simple';
import { ImageTranslation } from './translate/ImageTranslate';
import { Calculator } from './calculator/Calculator';
import { TestRecording } from './functions/audio/TestRecording';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Simple />} />
        <Route path="/image" element={<ImageTranslation />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/recorder" element={<TestRecording />} />
      </Routes>
    </BrowserRouter>
  );
};
