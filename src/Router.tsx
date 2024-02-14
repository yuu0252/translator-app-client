import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SimpleTranslator } from './translate/SimpleTranslator';
import { ImageTranslation } from './translate/ImageTranslate';
import { TranslatedImageArea } from './translate/TranslatedImageArea';
import { Login } from './auth/Login';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimpleTranslator />} />
        <Route path="/image" element={<ImageTranslation />} />
        <Route path="/translatedImage" element={<TranslatedImageArea />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};
