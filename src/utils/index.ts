import { WorkoutRecord } from "../types";
import { parseISO, startOfWeek, startOfMonth, startOfYear, format } from 'date-fns';

// Define a structure to hold aggregated data
export interface AggregatedData {
  weekly: { [key: string]: number };
  monthly: { [key: string]: number };
  yearly: { [key: string]: number };
}

export const aggregateData = (data: WorkoutRecord[]): AggregatedData => {
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

export const formatDateString = (dateString: string): string => {
  // Replace the first space with 'T' and remove the space before the timezone
  return dateString.replace(' ', 'T').replace(/\s(?=\+\d{4})/, '');
};

export const getMostActiveMonth = (monthlyData: { [key: string]: number }): string => {
  let maxDistance = 0;
  let mostActiveMonth = '';

  Object.entries(monthlyData).forEach(([month, distance]) => {
    if (distance > maxDistance) {
      maxDistance = distance;
      mostActiveMonth = month;
    }
  });

  return mostActiveMonth; // Returns the month with the most activity
};

export const getYearlyComparison = (yearlyData: { [key: string]: number }): string => {
  const years = Object.keys(yearlyData).sort().slice(-2); // Get the latest two years
  if (years.length < 2) return ''; // If less than 2 years of data, return empty string

  const [lastYear, thisYear] = years;
  const lastYearDistance = yearlyData[lastYear];
  const thisYearDistance = yearlyData[thisYear];

  if (thisYearDistance > lastYearDistance) {
    return `You were more active in ${thisYear} compared to ${lastYear}.`;
  } else if (thisYearDistance < lastYearDistance) {
    return `You were more active in ${lastYear} compared to ${thisYear}.`;
  } else {
    return `Your activity levels in ${thisYear} and ${lastYear} were similar.`;
  }
};

// An assumed average distance a person walks/runs in a month for comparison
const AVERAGE_MONTHLY_DISTANCE = 75; // Example value in kilometers

export const getDetailedInsights = (aggregatedData: AggregatedData) => {
  const mostActiveMonth = getMostActiveMonth(aggregatedData.monthly);
  const mostActiveMonthDistance = aggregatedData.monthly[mostActiveMonth];
  const yearlyComparison = getYearlyComparison(aggregatedData.yearly);
  
  // Calculate the total distance for the year to get an average
  const totalYearlyDistance = Object.values(aggregatedData.yearly).reduce((sum, distance) => sum + distance, 0);
  const averageMonthlyDistance = totalYearlyDistance / 12;
  
  // Compare to the average person
  const averageComparison = ((averageMonthlyDistance - AVERAGE_MONTHLY_DISTANCE) / AVERAGE_MONTHLY_DISTANCE) * 100;
  
  // Create a message about how much more or less the user has traveled compared to an average person
  const comparedToAverageMsg = averageComparison > 0 
    ? `That's ${averageComparison.toFixed(2)}% more than the average person's monthly distance!`
    : `That's ${Math.abs(averageComparison).toFixed(2)}% less than the average person's monthly distance. Keep pushing your limits!`;

  return {
    mostActiveMonth,
    mostActiveMonthDistance: mostActiveMonthDistance.toFixed(2),
    yearlyComparison,
    averageComparison: comparedToAverageMsg,
  };
};
