import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GoogleMapReact from 'google-map-react';

import './location.scss';

const Locations = (props) => {
    const dispatch = useDispatch();
    const { list } = useSelector(
        state => ({
            list: state.devices.list
        })
    );

    const [locationMarker, setLocationMarker] = useState('');
    const [selectedDev, setSelectedDev] = useState('');
    const [selectedParam, setSelectedParam] = useState('');

    const lat = (selectedDev !== '') ? parseInt(selectedDev.location.latitude, 10) : 0;
    const lng = (selectedDev !== '') ? parseInt(selectedDev.location.longitude, 10) : 0;
    
    useEffect(() => {
        if (list.length > 0) { initMapLocations() }
    }, [list]);

    const initMapLocations = () => {
        const markers = [];
        list.forEach((dev, count) => {
            if (count === 0) {
                setSelectedDev(dev);
                setSelectedParam(dev.paramDefinitions[0].paramName)
            }
            markers.push(
                <button className="loc" lat={dev.location.latitude}
                    lng={dev.location.longitude} key={dev.deviceId}
                    onClick={() => {
                        setSelectedDev(dev);
                        setSelectedParam(dev.paramDefinitions[0].paramName);
                    }}
                />
            )
        });
        setLocationMarker(markers);
    }

    return (
        <div className="block">
            <div id="js-map-search w-100" style={{ height: 500 }}>
                <GoogleMapReact defaultZoom={8} center={{lat: lat, lng: lng}} 
                    bootstrapURLKeys={{ key: 'AIzaSyAIxBnZBrLo32r-af2Oti4CqaMOjkj_OkY' }}
                >
                    {locationMarker}
                </GoogleMapReact>
            </div>
        </div>
    )
}


export default Locations;