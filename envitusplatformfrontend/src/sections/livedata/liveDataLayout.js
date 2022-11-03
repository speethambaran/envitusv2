import React from 'react';
import Layout from './sensorData1/layout';
const LiveDataLayout = (props) => {
    const layout = process.env.REACT_APP_LIVEDATA_TYPE;
    return (
        <div>
            {
                layout === 'livedata' &&
                <Layout preselectedDev={props.location.dev} preselectedTime={props.location.time} />
            }
        </div>
    )
}


export default LiveDataLayout;
