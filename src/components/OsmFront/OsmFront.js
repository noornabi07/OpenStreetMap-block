import React, { useEffect, useState, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import MainStyle from '../MainStyle/MainStyle';


// Custom marker icon for Leaflet
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const OsmFront = ({ attributes }) => {
  const { cId, zoomUnit, isMouseZoom, content, headingTag, settingsLat, settingsLng } = attributes;
  const [mapPosition, setMapPosition] = useState([settingsLat || 51.505, settingsLng || -0.09]);

  useEffect(() => {
    setMapPosition([settingsLat || 51.505, settingsLng || -0.09]);
  }, [settingsLat, settingsLng]);

  return (
    <Fragment>
      <MainStyle attributes={attributes} />
      <div id={`wrapper-${cId}`}>
        <div className='mapContent'>
          {React.createElement(headingTag, { className: 'title' }, content)}
        </div>
        <MapContainer className='mainMap' center={mapPosition} zoom={zoomUnit} scrollWheelZoom={isMouseZoom}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.bPlugins.com">OpenStreetMap</a> contributors'
          />
          <Marker position={mapPosition}>
            <Popup>Current Location</Popup>
          </Marker>
        </MapContainer>
      </div>
    </Fragment>
  );
};

export default OsmFront;
