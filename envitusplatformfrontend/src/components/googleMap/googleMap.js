import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

export class GoogleMap extends Component {
    render() {
        return (
            <div className="shadow" style={{ height: '70vh', width: '100%' }}> 
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyAIxBnZBrLo32r-af2Oti4CqaMOjkj_OkY' }}
                    center={this.props.center} defaultZoom={8}
                >
                    {this.props.children}
                </GoogleMapReact>
            </div>
        )
    }
}

export default GoogleMap;

