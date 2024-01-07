import React, { useState } from 'react';
import JSZip from 'jszip';
import { toast, ToastContainer } from 'react-toastify';
import sax, { Tag } from 'sax';

import { aggregateData, formatDateString } from '../utils';
import { WorkoutRecord } from '../types';
import styled from 'styled-components';

const FileUploaderContainer = styled.div`
  border: 2px dashed var(--border-color); /* Using CSS variable */
  border-radius: 20px;
  padding: 20px;
  margin-top: 20px;
  background-color: var(--background-color); /* Dark theme background */
  color: var(--text-color); /* Text color */
  width: var(--content-width);
`;

const FileInput = styled.input.attrs({ type: 'file' })`
  width: 100%;
  height: var(--input-height);
  border: none;
  margin-bottom: 10px;
  color: var(--text-color);
`;

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
        try {
          const zip = await JSZip.loadAsync(file);
          const toastId = toast.loading("Analyzing health data from export.xml...", { autoClose: false, theme: "colored" });

          const xmlFile = zip.file("apple_health_export/export.xml");
          if (xmlFile) {
            const xmlText = await xmlFile.async("text");
            toast.update(toastId, { render: "Data processed successfully!", type: "success", isLoading: false, autoClose: 5000, theme: "colored" });
            parseHealthData(xmlText);
          } else {
            toast.update(toastId, { render: "export.xml not found in zip file", type: "error", isLoading: false, autoClose: 5000, theme: "colored" });
          }
        } catch (error) {
          toast.error(`Error reading zip file: ${error}`);
          console.error("Error reading zip file: ", error);
        } finally {
          setIsProcessing(false);
        }
      } else {
        toast.error("Please upload a .zip file");
        setIsProcessing(false);
      }
    }
  };

  const parseHealthData = (xmlText: string) => {
    const parser = sax.parser(true);
    const workouts: WorkoutRecord[] = [];
    let currentRecord: WorkoutRecord | null = null;

    parser.onopentag = (node: Tag) => {
      if (node.name === 'Record' && node.attributes.type === 'HKQuantityTypeIdentifierDistanceWalkingRunning') {
        const type = node.attributes.type;
        const sourceName = node.attributes.sourceName;
        const sourceVersion = node.attributes.sourceVersion;
        const device = node.attributes.device;
        const unit = node.attributes.unit;
        const creationDate = formatDateString(node.attributes.creationDate);
        const startDate = formatDateString(node.attributes.startDate);
        const endDate = formatDateString(node.attributes.endDate);
        const value = parseFloat(node.attributes.value);

        if (startDate && endDate && !isNaN(value)) {
          currentRecord = {
            type,
            sourceName,
            sourceVersion,
            device,
            unit,
            creationDate,
            startDate,
            endDate,
            value
          };
        } else {
          // Handle invalid or missing data
          console.error('Invalid record data', node.attributes);
        }
      }
    };

    parser.onclosetag = (nodeName: string) => {
      if (nodeName === 'Record' && currentRecord) {
        workouts.push(currentRecord);
        currentRecord = null;
      }
    };

    parser.onerror = (error: Error) => {
      console.error("Error parsing XML: ", error);
      // Handle the error appropriately
    };

    parser.onend = () => {
      const aggregatedData = aggregateData(workouts);
      console.log("Aggregated data: ", aggregatedData)
      setAnalyzedData(aggregatedData);
      // setAnalyzedData(workouts);
    };

    parser.write(xmlText).close();
  };

  return (
    <FileUploaderContainer>
      <FileInput type="file" accept=".zip" onChange={handleFileChange} disabled={isProcessing} />
      {isProcessing
        ? <p>Processing {currentFileName}, please wait...</p>
        : currentFileName
          ? <p>Visualizing data from {currentFileName}. You can upload a different file to analyze.</p>
          : <p>Drag and drop your Apple Health .zip file here, or click to select a file.</p>}
      <ToastContainer />
    </FileUploaderContainer>
  );
};

export default FileUploader;
