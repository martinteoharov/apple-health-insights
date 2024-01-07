import React from "react";
import styled from 'styled-components';
import BarChart from "./BarChart";
import { AggregatedData, getDetailedInsights, getMostActiveMonth, getYearlyComparison } from "../utils";

interface DataDisplayProps {
  data: AggregatedData;
}

const DataDisplayContainer = styled.div`
  color: inherit;
  background-color: inherit;
  border-radius: 8px;
  padding: 20px;
  text-align: left;
  margin: 20px auto; // Reduced margin for mobile
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: var(--content-width); // Maximum width for the whole container

  @media (max-width: 768px) {
    margin: 20px 10px; // Adjust margin for smaller screens
    padding: 10px; // Adjust padding for smaller screens
  }
`;

const Title = styled.h2`
  color: var(--accent-color);
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1.5rem; // Adjust font size for smaller screens
  }
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  
  @media (max-width: 768px) {
    align-items: stretch; // Stretch charts to the full width on smaller screens
  }
`;

const ChartFullWidth = styled.div`
  width: 100%;
  // On small screens, each chart will take the full width automatically
`;

const ChartHalfWidth = styled(ChartFullWidth)`
  @media (min-width: 769px) {
    display: flex;
    justify-content: space-between;

    > div {
      width: calc(50% - 10px); // Only applies to screens wider than 768px
    }
  }
`;

const DataLists = styled.div`
  margin-top: 20px;

  h3 {
    margin-top: 15px;
    color: #333;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 5px;
    font-size: 0.9em;

    @media (max-width: 768px) {
      font-size: 0.8em; // Adjust font size for smaller screens
    }
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const Highlight = styled.strong`
  color: var(--highlight-color);
`;

const Statistic = styled.p`
  margin: 10px 0;
`;



const DataDisplay = (props: DataDisplayProps) => {
  const { data } = props;
  const {
    mostActiveMonth,
    mostActiveMonthDistance,
    yearlyComparison,
    averageComparison,
  } = getDetailedInsights(data);

  return (
    <DataDisplayContainer>
      <Title>Walking & Running Distance</Title>
      <p>Explore the detailed analysis of your walking and running distances. Discover patterns, compare your activity over time, and set new fitness goals.</p>

      <Section>
        <Statistic>
          In <Highlight>{mostActiveMonth}</Highlight>, you reached your peak activity,
          covering <Highlight>{mostActiveMonthDistance} km</Highlight>. That's <Highlight>{averageComparison}% more</Highlight>
          than the average person's monthly distance!
        </Statistic>
        <Statistic>{yearlyComparison}</Statistic>
        <ChartFullWidth>
          <BarChart data={data.monthly} title="Monthly Data" />
        </ChartFullWidth>
      </Section>

      <Section>
        <Statistic>
          Here's how your activity breaks down on a weekly basis.
        </Statistic>
        <ChartFullWidth>
          <BarChart data={data.weekly} title="Weekly Data" />
        </ChartFullWidth>
      </Section>

      <Section>
        <Statistic>
          Year-over-year, see how your commitment to health has evolved.
        </Statistic>
        <ChartFullWidth>
          <BarChart data={data.yearly} title="Yearly Data" />
        </ChartFullWidth>
      </Section>

      {/* Render data lists with more spacing or as part of a carousel/slider for interactivity */}
      {/* <Section>
        {renderDataList(data.monthly, "Monthly Distance (km)")}
        {renderDataList(data.yearly, "Yearly Distance (km)")}
      </Section> */}
    </DataDisplayContainer>
  );
};

export default DataDisplay;
