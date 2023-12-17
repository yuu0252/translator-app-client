import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './Home';
import { Simple } from './translation/Simple';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Simple />} />
      </Routes>
    </BrowserRouter>
  );
};
