import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <Container>
        <Row>
          <Col md={6} lg={8} className="d-flex justify-content-center">
            <ul className="footer-links">  
              <li className="mx-4">
                <a href="https://github.com/Gonzalo-diez" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li className="mx-4">
                <a href="https://www.linkedin.com/in/gdiezbuchanan/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li className="mx-4">
                <a href="https://portfolio-gonzalo-diez.netlify.app/" target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;