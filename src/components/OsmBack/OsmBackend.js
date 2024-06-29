import React from 'react';
import { useEffect, useState, Fragment } from 'react';
import { RichText } from '@wordpress/block-editor';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import MainStyle from '../MainStyle/MainStyle';
import { __ } from '@wordpress/i18n';
import { produce } from 'immer';



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

const OsmBackend = ({ attributes, OSMMap, setAttributes }) => {
  const { cId, zoomUnit, isMouseZoom, content, headingTag } = attributes;
  console.log(content);
  console.log(headingTag)
  const [mapPosition, setMapPosition] = useState([attributes.settingsLat || 51.505, attributes.settingsLng || -0.09]);

  useEffect(() => {
    setMapPosition([attributes.settingsLat || 51.505, attributes.settingsLng || -0.09]);
  }, [attributes.settingsLat, attributes.settingsLng, isMouseZoom]);

  return (
    <Fragment>

      <MainStyle attributes={attributes}></MainStyle>

      <div id={`wrapper-${cId}`}>
        <div className='mapContent'>
          <RichText
            className='title'
            tagName={headingTag} 
            value={content} 
            onChange={(val) => setAttributes({content: val})} 
            placeholder={__('Type Your Heading...')} 
          />
        </div>
        <MapContainer className='mainMap' center={mapPosition} zoom={zoomUnit} scrollWheelZoom={isMouseZoom}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.bPlugins.com">OpenStreetMap</a> contributors'
          />
          <OSMMap position={mapPosition} />
          <Marker position={mapPosition}>
            <Popup>
              Current Location
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </Fragment>
  );
};

export default OsmBackend;
