import React, { useState } from 'react';
import JSZip from 'jszip';
import { toast, ToastContainer } from 'react-toastify';
import sax, { Tag } from 'sax';

import { parseISO, startOfWeek, startOfMonth, startOfYear, format } from 'date-fns';


const aggregateData = (data: WorkoutRecord[]): AggregatedData => {
  const aggregated: AggregatedData = {
    weekly: {},
    monthly: {},
    yearly: {}
  };

  data.forEach(record => {
    try {
      const date = parseISO(record.startDate);
      const weekStart = format(startOfWeek(date), 'yyyy-MM-dd');
      const monthStart = format(startOfMonth(date), 'yyyy-MM');
      const yearStart = format(startOfYear(date), 'yyyy');

      aggregated.weekly[weekStart] = (aggregated.weekly[weekStart] || 0) + record.value;
      aggregated.monthly[monthStart] = (aggregated.monthly[monthStart] || 0) + record.value;
      aggregated.yearly[yearStart] = (aggregated.yearly[yearStart] || 0) + record.value;
    } catch {
      // Handle invalid date
      console.error('Invalid date', record.startDate);
      return;
    }
  });

  return aggregated;
};

const formatDateString = (dateString: string): string => {
  // Replace the first space with 'T' and remove the space before the timezone
  return dateString.replace(' ', 'T').replace(/\s(?=\+\d{4})/, '');
};




// Define a structure to hold aggregated data
export interface AggregatedData {
  weekly: { [key: string]: number };
  monthly: { [key: string]: number };
  yearly: { [key: string]: number };
}

export interface WorkoutRecord {
  type: string;
  sourceName: string;
  sourceVersion: string;
  device: string;
  unit: string;
  creationDate: string;
  startDate: string;
  endDate: string;
  value: number; // Assuming 'value' is a numerical value like distance
}

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
          console.log("Reading zip file")
          const zip = await JSZip.loadAsync(file);

          console.log("Reading export.xml")
          const xmlFile = zip.file("apple_health_export/export.xml");
          if (xmlFile) {
            const xmlText = await xmlFile.async("text");
            // Now parse the XML text
            toast.update(toastId, { render: "File loaded successfully!", type: "success", isLoading: false, autoClose: 5000, theme: "colored" });
            parseHealthData(xmlText);
          } else {
            console.log("export.xml not found in the zip")
            toast.update(toastId, { render: "export.xml not found in the zip", type: "error", isLoading: false, autoClose: 5000, theme: "colored" });
          }
        } catch (error) {
          console.error("Error reading zip file: ", error);
          toast.update(toastId, { render: `Error reading zip file: ${error}`, type: "error", isLoading: false, autoClose: 5000, theme: "colored" });
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