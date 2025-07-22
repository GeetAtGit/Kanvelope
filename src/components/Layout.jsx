import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const noHeaderPaths = ['/login', '/register'];

  const showHeader = !noHeaderPaths.includes(pathname);

  return (
    <div className="min-h-screen bg-gray-100">
      {showHeader && <Header />}
      <main >{children}</main>
    </div>
  );
};

export default Layout;
