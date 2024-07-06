import { produce } from 'immer';
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
import 'leaflet-fullscreen';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import MainStyle from '../MainStyle/MainStyle';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

const OsmBackend = ({ attributes, OSMMap, setAttributes }) => {
  const { cId, marker, showIcon, layer, tracker, locations, mapOptions } = attributes;
  const { fromLocation, toLocation } = locations;
  const { url } = marker;
  const mapInstance = useRef(null);
  const printControlRef = useRef(null);
  const routingControlRef = useRef(null);
  const { text } = marker;
  const { position, enable } = layer;
  const { tPosition, tTitle, tEnable } = tracker;
  const { isShowDownload, isPdf, routePlan, fullScreen, zoomUnit, isMouseZoom, mapLayerType } = mapOptions;

  console.log(mapOptions);
  console.log(mapLayerType);


  const [mapPosition, setMapPosition] = useState([attributes.settingsLat || 25.6260712, attributes.settingsLng || 88.6346228]);

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

  // Current location Function
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


  // Print function
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


  // Set current location for routing
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


  // Routing Destination Component
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

  // Export pdf Function
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

  // Map Full Screen Function
  const FullscreenControl = () => {
    const map = useMap();

    useEffect(() => {
      if (!map) return;
      const fullscreenControl = L.control.fullscreen({
        position: 'topleft',
        title: 'View Fullscreen',
        titleCancel: 'Exit Fullscreen',
      }).addTo(map);

      // Change the icon using CSS
      const fullscreenButton = document.querySelector('.leaflet-control-fullscreen-button');
      if (fullscreenButton) {
        fullscreenButton.style.backgroundImage = 'url("https://png.pngtree.com/element_our/png/20181205/fullscreen-vector-icon-png_256716.jpg")';
        fullscreenButton.style.backgroundSize = 'cover';
      }

      map.on('fullscreenchange', () => {
        if (map.isFullscreen()) {
          fullscreenButton.style.backgroundImage = 'url("https://png.pngtree.com/element_our/png/20181205/fullscreen-vector-icon-png_256716.jpg")';
        } else {
          fullscreenButton.style.backgroundImage = 'url("https://png.pngtree.com/element_our/png/20181205/fullscreen-vector-icon-png_256716.jpg")';
        }
      });

      return () => map.removeControl(fullscreenControl);
    }, [map]);

    return null;
  };

  // Map Layer Type
  const MapViewSwitch = () => {
    const map = useMap();

    useEffect(() => {
      const mapViewSwitchDiv = L.control({ position: position });

      mapViewSwitchDiv.onAdd = () => {
        const div = L.DomUtil.create("div", "leaflet-bar mapViewSwitch");
        div.innerHTML = `
    <div class="layer-image" id="layerImage">
      <div class="LayerHead">Layer</div>
      <div class="layer-selector" id="layerSelector">
        <select id="mapLayerSelector" title="Select Map Layer">
          <option value="default" ${mapLayerType === "default" ? "selected" : ""}>OpenStreetMap</option>
          <option value="satellite" ${mapLayerType === "satellite" ? "selected" : ""}>Satellite</option>
          <option value="CartoDB" ${mapLayerType === "CartoDB" ? "selected" : ""}>CartoDB Positron</option>
          <option value="CartoDark" ${mapLayerType === "CartoDark" ? "selected" : ""}>CartoDB Dark Matter</option>
        </select>
      </div>
    </div>
  `;

        L.DomEvent.on(div.querySelector("#mapLayerSelector"), "change", (e) => {
          const selectedLayerType = e.target.value;
          setAttributes({
            mapOptions: produce(mapOptions, (draft) => {
              draft.mapLayerType = selectedLayerType;
            }),
          });
        });

        return div;
      };
      mapViewSwitchDiv.addTo(map);


      return () => mapViewSwitchDiv.remove();
    }, [map, setAttributes, mapLayerType, mapOptions]);

    return null;
  };


  return (
    <Fragment>
      <MainStyle attributes={attributes}></MainStyle>

      <MapContainer className='mainMap' center={mapPosition} zoom={zoomUnit} scrollWheelZoom={isMouseZoom}>
        {mapLayerType === "default" && <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://bplugins.com/">bPlugins</a> contributors'
        />}
        {mapLayerType === "satellite" && <TileLayer
          url="https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=YEI95Jvk57zAEnNOTx8u"
          attribution='&copy; <a href="https://bplugins.com/">bPlugins</a> contributors'
        />}
        {mapLayerType === "CartoDB" && <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://bplugins.com/">bPlugins</a>'
        />}
        {mapLayerType === "CartoDark" && <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://bplugins.com/">bPlugins</a>'
        />}

        {enable && <MapViewSwitch mapLayerType={mapLayerType} />}

        {tEnable && <GeolocationControl />}
        <OSMMap position={mapPosition} />
        {fullScreen && <FullscreenControl />}
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
    </Fragment>
  );
};

export default OsmBackend;



