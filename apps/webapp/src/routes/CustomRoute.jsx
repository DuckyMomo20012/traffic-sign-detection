import { Route, Routes } from 'react-router-dom';

import { NotFound } from '@/pages/404.jsx';
import { HomePage } from '@/pages/index.jsx';

const CustomRoute = () => {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<NotFound />} path="*" />
    </Routes>
  );
};

export { CustomRoute };
