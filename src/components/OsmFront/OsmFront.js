import L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-easyprint';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet/dist/leaflet.css';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { LayersControl, MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import MainStyle from '../MainStyle/MainStyle';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { produce } from 'immer';

const { BaseLayer } = LayersControl;

const OsmFront = ({ attributes, setAttributes }) => {
  const [mapPosition, setMapPosition] = useState([attributes.settingsLat || 25.6260712, attributes.settingsLng || 88.6346228]);

  const { cId, zoomUnit, isMouseZoom, marker, showIcon, layer, tracker, locations, mapOptions } = attributes;
  const { fromLocation, toLocation } = locations;
  const { url } = marker;
  const mapInstance = useRef(null);
  const printControlRef = useRef(null);
  const routingControlRef = useRef(null);
  const { text } = marker;
  const { position } = layer;
  const { tPosition, tTitle, tEnable } = tracker;
  const { isShowDownload, isPdf, routePlan } = mapOptions;

  const createIcon = L.icon({
    iconUrl: url,
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [parseFloat(marker?.width), parseFloat(marker?.height)],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });


  useEffect(() => {
    setMapPosition([attributes.settingsLat || 25.6260712, attributes.settingsLng || 88.6346228]);

    if (mapInstance.current) {
      if (isMouseZoom) {
        mapInstance.current.scrollWheelZoom.enable();
      } else {
        mapInstance.current.scrollWheelZoom.disable();
      }
    }
  }, [attributes.settingsLat, attributes.settingsLng, url, isMouseZoom, showIcon]);


  const GeolocationControl = () => {
    const map = useMap();
    mapInstance.current = map;

    useEffect(() => {
      if (!map) return;
      const lc = L.control.locate({
        position: tPosition,
        drawCircle: true,
        keepCurrentZoomLevel: true,
        strings: {
          title: tTitle,
          metersUnit: 'meters'
        },
        locateOptions: {
          maxZoom: 16,
          enableHighAccuracy: true
        },
      });
      lc.addTo(map);

      return () => map.removeControl(lc);
    }, [map, locations]);
    return null;
  };

  const PrintControl = () => {
    const map = useMap();

    useEffect(() => {
      if (!printControlRef.current) {
        printControlRef.current = L.easyPrint({
          title: 'Export Map',
          position: 'topright',
          sizeModes: ['Current', 'A4Portrait', 'A4Landscape'],
          filename: 'map_export',
          exportOnly: true,
          hideControlContainer: true
        }).addTo(map);
      }

      return () => {
        if (printControlRef.current) {
          printControlRef.current.remove();
          printControlRef.current = null;
        }
      };
    }, [map]);

    return null;
  };

  useEffect(() => {
    if (!fromLocation.lat || !fromLocation.lon) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
          .then(response => response.json())
          .then(data => {
            if (data && data.display_name) {
              setAttributes({
                locations: produce(locations, draft => {
                  draft.fromLocation.lat = position.coords.latitude;
                  draft.fromLocation.lon = position.coords.longitude;
                  draft.fromLocation.locationName = data.display_name;
                })
              });
            }
          });
      }, (error) => {
        console.error('Error fetching current location:', error);
      });
    }
  }, [fromLocation.lat, fromLocation.lon, fromLocation.locationName, setAttributes]);

  const RoutingControl = () => {
    const map = useMap();

    useEffect(() => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }

      if (fromLocation && toLocation) {
        const fromLatLng = L.latLng(fromLocation.lat, fromLocation.lon);
        const toLatLng = L.latLng(toLocation.lat, toLocation.lon);

        routingControlRef.current = L.Routing.control({
          waypoints: [fromLatLng, toLatLng],
          routeWhileDragging: true,
          geocoder: L.Control.Geocoder.nominatim(),
          createMarker: (i, waypoint, n) => {
            let markerOptions = {};
            if (i === 0) {
              // Custom icon for the start point
              markerOptions.icon = L.icon({
                iconUrl: 'https://www.openstreetmap.org/assets/marker-green-2de0354ac458a358b9925a8b7f5746324122ff884605073e1ee602fe8006e060.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              });
            } else if (i === n - 1) {
              // Custom icon for the end point
              markerOptions.icon = L.icon({
                iconUrl: 'https://www.openstreetmap.org/assets/marker-red-ea1f472cd753fdbe59b263a7dc4886006415079498be4d13a18c12ed33ac5b26.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              });
            } else {
              // Custom icon for the intermediate points
              markerOptions.icon = L.icon({
                iconUrl: 'path/to/intermediate-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              });
            }
            return L.marker(waypoint.latLng, markerOptions);
          }
        }).addTo(map);
      }

      return () => {
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }
      };
    }, [map, fromLocation, toLocation]);

    return null;
  };

  const exportAsPdf = () => {
    const mapElement = document.getElementById(`wrapper-${cId}`);

    domtoimage.toPng(mapElement)
      .then((dataUrl) => {
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [mapElement.offsetWidth, mapElement.offsetHeight]
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, mapElement.offsetWidth, mapElement.offsetHeight);
        pdf.save('map.pdf');
      })
      .catch((error) => {
        console.error('Failed to export map as PDF:', error);
      });
  };

  const OSMMap = ({ position }) => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.setView(position, zoomUnit);
      }
    }, [position, zoomUnit]);

    return null;
  };

  return (
    <Fragment>
      <MainStyle attributes={attributes} />
      <div id={`wrapper-${cId}`}>

        <MapContainer className='mainMap' center={mapPosition} zoom={zoomUnit} scrollWheelZoom={isMouseZoom}>
          <LayersControl position={position}>
            <BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </BaseLayer>
            <BaseLayer name="Satellite">
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
              />
            </BaseLayer>
          </LayersControl>
          {tEnable && <GeolocationControl />}
          <OSMMap position={mapPosition} />
          {isShowDownload && <PrintControl />}
          {routePlan && <RoutingControl />}
          {marker?.showIcon && <Marker icon={createIcon} position={mapPosition} draggable={true}>
            <Popup className='popupStyle'>
              {text}
            </Popup>
            <Tooltip>Your Find Location</Tooltip>
          </Marker>}
        </MapContainer>
        {isPdf && <button onClick={exportAsPdf}>
          Export as PDF
        </button>}
      </div>
    </Fragment>
  );
};

export default OsmFront;
