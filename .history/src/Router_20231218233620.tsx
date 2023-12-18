import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Simple } from './translation/Simple';
import { Calculate } from './Calculate';
import { SimpleRecorder } from './components/SimpleRecorder';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Simple />} />
        <Route path="/calculate" element={<Calculate />} />
        <Route path="/recorder" element={<SimpleRecorder />} />
      </Routes>
    </BrowserRouter>
  );
};
