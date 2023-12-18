import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Simple } from './translation/Simple';
import { RecordingIos } from './components/RecordingIos';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Simple />} />
        <Route path="/ios" element={<RecordingIos />} />
      </Routes>
    </BrowserRouter>
  );
};
