import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SimpleTranslator } from './pages/simple/SimpleTranslator';
import { ImageTranslation } from './pages/image/ImageTranslate';
import { TranslatedImageArea } from './pages/image/TranslatedImageArea';
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
