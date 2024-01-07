import React, { useState } from 'react';
import './App.css';
import FileUploader, { AggregatedData } from './components/FileUploader'; // Assuming FileUploader is in the same directory
import 'react-toastify/dist/ReactToastify.css';
import DataDisplay from './components/DataDisplay';

const App: React.FC = () => {
  const [analyzedData, setAnalyzedData] = useState<AggregatedData | null>(null); // Define a more specific type according to your data structure

  return (
    <div className="container">
      <div className="content">
        <h1>Explore Your Health Data Privately</h1>
        <p>Analyze your Apple Health & Fitness data directly in your browser. Your privacy is our priority – your data never leaves your device.</p>
        <FileUploader setAnalyzedData={setAnalyzedData} />
        {analyzedData && <DataDisplay data={analyzedData} />}
      </div>
    </div>
  );
};

export default App;
