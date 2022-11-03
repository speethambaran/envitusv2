import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = (props) => {
    const options = {
        responsive: true
    }
    // console.log(props.chartData)
    return (
        <Bar data={props.chartData} options={options} />
    )
}

export default BarChart;
