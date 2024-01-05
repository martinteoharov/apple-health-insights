import React from "react";

const DataDisplay: React.FC<{ data: any }> = ({ data }) => {
    // Render the analyzed data here
    // You can use different components for different types of data
    // Example: return <div>{data && <ChartComponent data={data} />}</div>

    return (
        <div>
            {data ? (
                <div>
                    {data}
                </div>
            ) : (
                <p>No data to display. Please upload a file.</p>
            )}
        </div>
    );
};


export default DataDisplay;

