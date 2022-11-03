import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { PieChart } from 'react-minimal-pie-chart';
import Locations from './locations';
import { getAQIColorIndex } from '../../../utils/helpers';

const Pollutants = () => {
    const { statistics } = useSelector(
        state => ({
            statistics: state.dashboard.statistics,
        })
    );

    return (
        <div className="block block-content block-content-full">
            <div className="detail-title">
                <h2>{statistics.device_details ? statistics.device_details.city : ''}</h2>
                <p>{statistics.device_details ? statistics.device_details.landMark : ''}</p>
            </div>
            <div className="update-time">{statistics.device_details.lastDataReceiveTime ? moment(statistics.device_details.lastDataReceiveTime).format('YYYY-MM-DD HH:mm') : ''}</div>

            <div className="row" style={{ paddingBottom: 10 }}>
                <div className="col-12 col-xl-3">
                    <div id="chartBox" className="chart-box js-appear-enabled animated fadeIn" data-toggle="appear" >
                        <div className="title">AQI</div>
                        <div className="levelWrap">
                            <div className="levelWrap2">
                                <div className="level" style={{ background: getAQIColorIndex(statistics.aqi, 'color') }}>{getAQIColorIndex(statistics.aqi, 'remark')}</div>
                            </div>
                        </div>

                        <div id="gauge3" style={{ width: 240, height: 200, marginTop: 25, marginLeft: 10, marginRight: 10 }}
                            className="gauge-container three" max="500" value="100">
                            <PieChart
                                startAngle={120}
                                lengthAngle={300}
                                data={[{ value: statistics.aqi > -1 ? statistics.aqi : '', color: getAQIColorIndex(statistics.aqi, 'color') }]}
                                totalValue={500}
                                lineWidth={8}
                                label={({ dataEntry }) => dataEntry.value}
                                labelStyle={{
                                    fontSize: '30px',
                                    fontFamily: 'sans-serif',
                                    fill: '#000',
                                    fontWeight: 100
                                }}
                                labelPosition={0}
                                background={'#E8E8E8'}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-3">

                    <div className="reading-box">
                        <div className="title">
                            <a id="pollutants_link" className="active">Pollutants</a></div>
                        <div className="pollutants" style={{ display: 'block' }}>
                            {statistics.pollutants.display.PM2p5 &&
                                <div className="pollutant-item odd">
                                    <div className="name">PM2.5</div>
                                    <div className="unit">μg/m³</div>
                                    <div className="value">{statistics.pollutants.PM2p5 ? Math.round(statistics.pollutants.PM2p5) : 0}</div>
                                    <div className="ratio-bar"></div>
                                    <div className="ratio-bar-bg"></div>
                                </div>
                            }
                            {statistics.pollutants.display.PM10 &&
                                <div className="pollutant-item even">
                                    <div className="name">PM10</div>
                                    <div className="unit">μg/m³</div>
                                    <div className="value">{statistics.pollutants.PM10 ? Math.round(statistics.pollutants.PM10) : 0}</div>
                                    <div className="ratio-bar"></div>
                                    <div className="ratio-bar-bg"></div>
                                </div>
                            }
                            {statistics.pollutants.display.CO &&
                                <div className="pollutant-item odd">
                                    <div className="name">CO</div>
                                    <div className="unit">mg/m³</div>
                                    <div className="value">{statistics.pollutants.CO ? Math.round(statistics.pollutants.CO) : 0}</div>
                                    <div className="ratio-bar"></div>
                                    <div className="ratio-bar-bg"></div>
                                </div>
                            }
                            {statistics.pollutants.display.NO2 &&
                                <div className="pollutant-item even">
                                    <div className="name">NO2</div>
                                    <div className="unit">μg/m³</div>
                                    <div className="value">{statistics.pollutants.NO2 ? Math.round(statistics.pollutants.NO2) : 0}</div>
                                    <div className="ratio-bar"></div>
                                    <div className="ratio-bar-bg"></div>
                                </div>
                            }
                            {statistics.pollutants.display.SO2 &&
                                <div className="pollutant-item odd">
                                    <div className="name">SO2</div>
                                    <div className="unit">μg/m³</div>
                                    <div className="value">{statistics.pollutants.SO2 ? Math.round(statistics.pollutants.SO2) : 0}</div>
                                    <div className="ratio-bar"></div>
                                    <div className="ratio-bar-bg"></div>
                                </div>
                            }
                            {statistics.pollutants.display.O3 &&
                                <div className="pollutant-item even">
                                    <div className="name">O3</div>
                                    <div className="unit">μg/m³</div>
                                    <div className="value">{statistics.pollutants.O3 ? Math.round(statistics.pollutants.O3) : 0}</div>
                                    <div className="ratio-bar"></div>
                                    <div className="ratio-bar-bg"></div>
                                </div>
                            }
                            <div className="clr"></div>
                            {/* {statistics.aqi > -1 &&
                                <span className="badge badge-warning mt-15 p-10">{statistics.pollutants ? 'Prominent Pollutant : ' + statistics.pollutants.prominentPollutant : ''}</span>
                            } */}
                        </div>
                    </div>

                </div>
                <div className="col-12 col-xl-6">
                    <Locations />
                </div>
            </div>

        </div>
    )
}


export default Pollutants