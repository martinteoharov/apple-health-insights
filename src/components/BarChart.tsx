import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


interface BarChartProps {
    data: { [key: string]: number };
    title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: title,
                data: Object.values(data),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default BarChart;
