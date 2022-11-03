import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = (props) => {
    const [chartData, setChartData] = useState({});
    const options = {
        responsive: true
    }

    const chart = () => {
        setChartData(props.chartData)
    }

    useEffect(() =>{
        chart()
    }, [props.chartData])

    return(
        <div><Line data={chartData} options={options}/></div>
    )
}

export default LineChart;
