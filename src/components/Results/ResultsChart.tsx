import { FC } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { PollChartData } from "../../types";
import {Chart as ChartJS} from "chart.js/auto";
import { Chart } from "chart.js";

interface ResultsChartProps {
    chartData: PollChartData
}

const ResultsChart:FC<ResultsChartProps> = ({chartData}) => {
    return <></>
    //<Chart data={chartData.data} config/>     
}

export default ResultsChart;
