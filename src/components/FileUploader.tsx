import React, { useState } from 'react';
import JSZip from 'jszip';
import { toast, ToastContainer } from 'react-toastify';
import { parseStringPromise } from 'xml2js';


interface FileUploaderProps {
  setAnalyzedData: (data: any) => void; // Define a more specific type according to your data structure
}


const FileUploader: React.FC<FileUploaderProps> = ({ setAnalyzedData }) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentFileName, setCurrentFileName] = useState<string>('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessing(true);
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setCurrentFileName(file.name);
      if (file.name.endsWith('.zip')) {
        const toastId = toast.loading("Processing file...", { autoClose: false });
        try {
          const zip = await JSZip.loadAsync(file);
          const xmlFile = zip.file("apple_health_export/export.xml");
          if (xmlFile) {
            const xmlText = await xmlFile.async("text");
            // Now parse the XML text
            toast.update(toastId, { render: "File loaded successfully!", type: "success", isLoading: false, autoClose: 5000, theme: "colored" });
            parseHealthData(xmlText);
          } else {
            toast.update(toastId, { render: "export.xml not found in the zip", type: "error", isLoading: false, autoClose: 5000, theme: "colored" });
          }
        } catch (error) {
          console.error("Error reading zip file: ", error);
          toast.update(toastId, { render: "Error reading zip file", type: "error", isLoading: false, autoClose: 5000, theme: "colored" });
        } finally {
          setIsProcessing(false);
        }
      } else {
        toast.error("Please upload a .zip file");
        setIsProcessing(false);
      }
    }
  };

  const parseHealthData = async (xmlText: string) => {
    const toastId = toast.loading("Parsing data...", { autoClose: false });

    try {
      const result = await parseStringPromise(xmlText);
      const workouts = result.HealthData.Record.filter((record: any) => record.$.type === 'HKQuantityTypeIdentifierDistanceWalkingRunning' || record.$.type === 'HKQuantityTypeIdentifierActiveEnergyBurned');

      setAnalyzedData(workouts);
      toast.update(toastId, { render: "Data parsed successfully!", type: "success", isLoading: false, autoClose: 5000, theme: "colored" });
    } catch (error) {
      console.error("Error parsing XML: ", error);
      toast.update(toastId, { render: "Error parsing data", type: "error", isLoading: false, autoClose: 5000, theme: "colored" });
    }
  };

  return (
    <div className="file-uploader">
      <input type="file" accept=".zip" onChange={handleFileChange} disabled={isProcessing} />
      {isProcessing
        ? <p>Processing {currentFileName}, please wait...</p>
        : currentFileName
          ? <p>Visualizing data from {currentFileName}. You can upload a different file to analyze.</p>
          : <p>Drag and drop your Apple Health .zip file here, or click to select a file.</p>}
      <ToastContainer />
    </div>
  );
};

export default FileUploader;