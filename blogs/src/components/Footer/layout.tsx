import React from 'react';
import Footer from './footer';
import { Container } from 'react-bootstrap';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="flex-grow-1">{children}</Container>
      <Footer />
    </div>
  );
};

export default Layout;