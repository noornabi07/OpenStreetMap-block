import React from 'react';
import { ToggleControl } from '@wordpress/components'
import { useEffect, useState, Fragment, useRef } from 'react';
import { RichText } from '@wordpress/block-editor';
import { MapContainer, TileLayer, useMap, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import 'leaflet-routing-machine';

import MainStyle from '../MainStyle/MainStyle';
import { __ } from '@wordpress/i18n';

const { BaseLayer } = LayersControl;

// Custom marker icon for Leaflet
let DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const RoutePlanning = ({ map, start, destination, mode }) => {
  const [routingControl, setRoutingControl] = useState(null);

  const handlePlanRoute = async () => {
    if (routingControl) {
      map.removeControl(routingControl);
      setRoutingControl(null);
    }

    if (map && start && destination) {
      const travelModeMap = {
        driving: 'driving-car',
        walking: 'foot-walking',
        cycling: 'cycling-regular'
      };
      const travelMode = travelModeMap[mode] || 'driving-car';

      try {
        const response = await fetch(`https://api.openrouteservice.org/v2/directions/${travelMode}`, {
          method: 'POST',
          headers: {
            'Authorization': '5b3ce3597851110001cf624843eb3a65891c41958b5bbe01f8714058',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            coordinates: [
              [start.lng, start.lat],
              [destination.lng, destination.lat]
            ]
          })
        });

        if (!response.ok) {
          console.error('API response error:', response.statusText);
          return;
        }

        const data = await response.json();
        console.log('API response data:', data); // Log the response to inspect its structure

        if (!data.routes || data.routes.length === 0 || !data.routes[0].geometry || !data.routes[0].geometry.coordinates) {
          console.error('Invalid route data:', data);
          return;
        }

        const routeCoordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);

        const newRoutingControl = L.Routing.control({
          waypoints: routeCoordinates.map(coord => L.latLng(coord)),
          routeWhileDragging: true,
          createMarker: function (i, wp) {
            return L.marker(wp.latLng, {
              draggable: true
            }).bindPopup(i === 0 ? 'Start' : 'End');
          }
        }).addTo(map);

        setRoutingControl(newRoutingControl);
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    }
  };

  useEffect(() => {
    handlePlanRoute();
  }, [start, destination, mode]);

  return null;
};

const OsmBackend = ({ attributes, OSMMap, setAttributes }) => {
  const { cId, zoomUnit, isMouseZoom, content, headingTag } = attributes;
  const [showRoutePlanning, setShowRoutePlanning] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [destinationPoint, setDestinationPoint] = useState(null);
  const [travelMode, setTravelMode] = useState('driving');
  const mapInstance = useRef(null);


  const [mapPosition, setMapPosition] = useState([attributes.settingsLat || 51.505, attributes.settingsLng || -0.09]);


  useEffect(() => {
    setMapPosition([attributes.settingsLat || 51.505, attributes.settingsLng || -0.09]);
  }, [attributes.settingsLat, attributes.settingsLng, isMouseZoom]);


  const GeolocationControl = () => {
    const map = useMap();
    mapInstance.current = map;

    useEffect(() => {
      if (!map) return; // Ensure map is loaded before adding controls
      // Initialize locate control with options
      const lc = L.control.locate({
        position: 'topleft',
        drawCircle: true,
        keepCurrentZoomLevel: true,
        strings: {
          title: 'Show me where I am',
          metersUnit: 'meters'
        },
        locateOptions: {
          maxZoom: 16,
          enableHighAccuracy: true
        }
      });
      lc.addTo(map);

      return () => map.removeControl(lc);
    }, [map]);

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const start = e.target.startPoint.value.split(',').map(Number);
    const destination = e.target.destinationPoint.value.split(',').map(Number);
    const mode = e.target.travelMode.value;

    console.log(start, destination, mode);

    setStartPoint({ lat: start[0], lng: start[1] });
    setDestinationPoint({ lat: destination[0], lng: destination[1] });
    setTravelMode(mode);
  };


  return (
    <Fragment>

      <MainStyle attributes={attributes}></MainStyle>

      <div id={`wrapper-${cId}`}>
        <div className='mapContent'>
          <RichText
            className='title'
            tagName={headingTag}
            value={content}
            onChange={(val) => setAttributes({ content: val })}
            placeholder={__('Type Your Heading...')}
          />
          <div style={{ display: "flex", justifyItems: "center", gap: "5px", marginBottom: "10px" }}>
            <label style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "-5px" }}>Show Route Planning:</label>
            <ToggleControl
              checked={showRoutePlanning}
              onChange={() => setShowRoutePlanning(!showRoutePlanning)}
            />
          </div>
          {showRoutePlanning && (
            <form onSubmit={handleSubmit} className="route-planning-form">
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <label style={{ color: "#fff" }}>Start Point (lat, lng):</label>
                <input type="text" name="startPoint" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "10px" }}>
                <label style={{ color: "#fff" }}>To Point (lat, lng):</label>
                <input type="text" name="destinationPoint" />
              </div>

              <div style={{ marginTop: "10px", gap: "5px", display: "flex", marginBottom: "20px" }}>
                <label style={{ color: "#fff" }}>Travel Mode:</label>
                <select name="travelMode">
                  <option value="driving">Driving</option>
                  <option value="walking">Walking</option>
                  <option value="cycling">Cycling</option>
                </select>
                <button type="submit">Submit</button>
              </div>
            </form>
          )}
        </div>
        <MapContainer className='mainMap' center={mapPosition} zoom={zoomUnit} scrollWheelZoom={isMouseZoom}>
          <LayersControl position="topright">
            <p>Switch Layers:</p>
            <BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </BaseLayer>
            <BaseLayer name="Satellite">
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
              />
            </BaseLayer>
            {showRoutePlanning && startPoint && destinationPoint && (
              <RoutePlanning
                map={mapInstance.current}
                start={startPoint}
                destination={destinationPoint}
                mode={travelMode}
              />
            )}
          </LayersControl>
          <GeolocationControl />
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
