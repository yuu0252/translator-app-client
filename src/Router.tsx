import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Simple } from './translate/Simple';
import { ImageTranslation } from './translate/ImageTranslate';
import { Calculator } from './calculator/Calculator';
import { TestRecording } from './components/TestRecording';
import { TranslatedImageArea } from './translate/TranslatedImageArea';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Simple />} />
        <Route path="/image" element={<ImageTranslation />} />
        <Route path="/translatedImage" element={<TranslatedImageArea />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/recorder" element={<TestRecording />} />
      </Routes>
    </BrowserRouter>
  );
};
