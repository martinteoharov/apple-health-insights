import React, { useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader'; // Assuming FileUploader is in the same directory
import 'react-toastify/dist/ReactToastify.css';
import DataDisplay from './components/DataDisplay';
import { AggregatedData } from './utils';
import styled from 'styled-components';

const Title = styled.h1`
  color: var(--accent-color);
  margin: 20px 0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Adding a shadow to the text */

  @media (max-width: 768px) {
    font-size: 1.5rem; // Smaller font size for mobile
  }
`;

const Logo = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 50px;
  border-radius: 20%; // Rounded edges on the logo
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5); /* Adding a glow effect to the logo */
  transition: box-shadow 0.3s ease-in-out; /* Smooth transition for hover effect */

  @media (max-width: 768px) {
    width: 50%; // Adjust logo size for mobile
    margin-top: 20px; // Reduce margin for mobile
  }
`;

const DisclaimerText = styled.p`
  color: var(--text-color);
  font-size: 0.75em;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 0.65em; // Even smaller font size for mobile
  }
`;

const Container = styled.div`
  text-align: center;
`;

const Content = styled.div`
  padding: 20px;
  max-width: 1400px;

  @media (max-width: 768px) {
    padding: 10px; // Less padding for mobile
  }
`;

const App: React.FC = () => {
  const [analyzedData, setAnalyzedData] = useState<AggregatedData | null>(null); // Define a more specific type according to your data structure

  return (
    <Container>
      <Content>
        <Logo src="/logo4-compress.jpg" width={300} height={300} alt="Health Data Analysis Logo" />
        <Title>Explore Your <b>Apple Health</b> Data Privately</Title>
        <p>Analyze your Apple Health data directly in your browser - your data never leaves your device.</p>
        <FileUploader setAnalyzedData={setAnalyzedData} />
        <DisclaimerText>
          Disclaimer: This service is not affiliated with or endorsed by Apple. It is an independent web application that respects and protects your privacy.
        </DisclaimerText>
        {analyzedData && <DataDisplay data={analyzedData} />}
      </Content>
    </Container>
  );

};

export default App;
