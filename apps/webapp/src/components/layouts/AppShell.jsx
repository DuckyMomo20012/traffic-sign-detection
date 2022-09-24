import { AppShell as MantineAppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { Footer } from '@/components/layouts/Footer';
import { Header } from '@/components/layouts/Header';

const AppShell = ({ children }) => {
  return (
    <MantineAppShell
      className="relative"
      footer={<Footer />}
      header={<Header />}
    >
      {children || <Outlet />}
    </MantineAppShell>
  );
};

export { AppShell };
