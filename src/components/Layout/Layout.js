import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import FloatingCart from '../FloatingCart/FloatingCart';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <FloatingCart />
      <main className="app-layout__content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

