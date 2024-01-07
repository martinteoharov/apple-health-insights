import React from "react";
import { AggregatedData } from "./FileUploader";
import './DataDisplay.css';
import BarChart from "./BarChart";

interface DataDisplayProps {
  data: AggregatedData;
}

const DataDisplay = (props: DataDisplayProps) => {
  const { weekly, monthly, yearly } = props.data;

  const renderDataList = (data: { [key: string]: number }, title: string) => (
    <div>
      <h3>{title}</h3>
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>{key}: {value.toFixed(2)} km</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="data-display">
        <h2>Workout Distance Data</h2>
        <p>Below are the visual representations and lists of distances covered during workouts aggregated on a weekly, monthly, and yearly basis.</p>
        <div className="chart-container">
            <div className="chart-full-width">
                <BarChart data={weekly} title="Weekly Data" />
            </div>
            <div className="chart-half-width">
                <BarChart data={monthly} title="Monthly Data" />
                <BarChart data={yearly} title="Yearly Data" />
            </div>
        </div>
        <div className="data-lists">
          {renderDataList(monthly, "Monthly Distance (km)")}
          {renderDataList(yearly, "Yearly Distance (km)")}
        </div>
    </div>
  );
};

export default DataDisplay;
