import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SimpleTranslator } from "./pages/simple/SimpleTranslator";
import { ImageTranslation } from "./pages/image/ImageTranslate";
import { TranslatedImageArea } from "./pages/image/TranslatedImageArea";
import { Login } from "./pages/auth/Login";
import { Favorite } from "./pages/favorite/Favorite";
import { AppLayout } from "./components/layouts/AppLayout";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/translatedImage" element={<TranslatedImageArea />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<SimpleTranslator />} />
          <Route path="/image" element={<ImageTranslation />} />
          <Route path="/favorite" element={<Favorite />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
