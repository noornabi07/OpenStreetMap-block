import { PanelBody, RangeControl, TextControl, ToggleControl, Button, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { MediaUpload } from "@wordpress/block-editor";
import { produce } from 'immer';

const ContentSetting = ({ attributes, setAttributes, setPosition }) => {
  const { marker, layer, tracker, mapOptions } = attributes;

  const { width, height, text, showIcon } = marker;
  const { position, enable } = layer;
  const { tEnable, tPosition, tTitle } = tracker;
  const { isShowDownload, isPdf, routePlan, fullScreen, zoomUnit, isMouseZoom } = mapOptions;

  const [searchQuerySetting, setSearchQuerySetting] = useState(attributes.settingsSearchQuery || '');
  const [latSetting, setLatSetting] = useState(attributes.settingsLat || '');
  const [lngSetting, setLngSetting] = useState(attributes.settingsLng || '');

  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = async (value) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
    const data = await response.json();
    return data.map(suggestion => ({
      name: suggestion.display_name,
      lat: suggestion.lat,
      lon: suggestion.lon,
    }));
  };

  const onSuggestionsFetchRequested = async ({ value }) => {
    const fetchedSuggestions = await getSuggestions(value);
    setSuggestions(fetchedSuggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => (
    <div className="autosuggest__suggestion">
      {suggestion.name}
    </div>
  );

  const onSuggestionSelected = (event, { suggestion }) => {
    setLatSetting(suggestion.lat);
    setLngSetting(suggestion.lon);
    setAttributes({ settingsLat: suggestion.lat, settingsLng: suggestion.lon });
    setPosition(suggestion.lat, suggestion.lon);
  };

  const inputProps = {
    placeholder: 'Type Location',
    value: searchQuerySetting,
    onChange: (event, { newValue }) => setSearchQuerySetting(newValue),
  };

  const theme = {
    container: 'autosuggest__container',
    input: 'autosuggest__input',
    inputFocused: 'autosuggest__input--focused',
    suggestionsContainer: 'autosuggest__suggestions-container',
    suggestion: 'autosuggest__suggestion',
    suggestionHighlighted: 'autosuggest__suggestion--highlighted',
  };

  const handleImageUrlChange = (newUrl) => {
    const newIcon = produce(marker, draft => {
      draft.url = newUrl;
    });
    setAttributes({ marker: newIcon });
  };


  return (
    <>
      <PanelBody title={__('Map Settings', 'osm-block')} initialOpen={false}>
        <div>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            onSuggestionSelected={onSuggestionSelected}
            inputProps={inputProps}
            theme={theme}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <TextControl
            label={__('Latitude', 'osm-block')}
            value={latSetting}
            onChange={(value) => {
              setLatSetting(value);
              setAttributes({ settingsLat: value });
              setPosition(value, lngSetting);
            }}
          />
          <TextControl
            style={{ marginTop: "-10px" }}
            label={__('Longitude', 'osm-block')}
            value={lngSetting}
            onChange={(value) => {
              setLngSetting(value);
              setAttributes({ settingsLng: value });
              setPosition(latSetting, value);
            }}
          />
        </div>

        <div style={{ display: "flex", justifyItems: "center", gap: "10px", marginTop: "20px", marginBottom: "10px" }}>
          <label>Route Planning:</label>
          <ToggleControl
            checked={routePlan}
            onChange={val => {
              const routePlan = produce(mapOptions, draft => {
                draft.routePlan = val;
              })
              setAttributes({ mapOptions: routePlan });
            }}
          />
        </div>


        <div style={{ display: "flex", justifyItems: "center", gap: "10px", marginTop: "20px", marginBottom: "10px" }}>
          <label>Download Image:</label>
          <ToggleControl
            checked={isShowDownload}
            onChange={val => {
              const showDownload = produce(mapOptions, draft => {
                draft.isShowDownload = val;
              })
              setAttributes({ mapOptions: showDownload });
            }}
          />
        </div>

        <div style={{ display: "flex", justifyItems: "center", gap: "10px", marginTop: "20px", marginBottom: "10px" }}>
          <label>Download PDF:</label>
          <ToggleControl
            checked={isPdf}
            onChange={val => {
              const showDownload = produce(mapOptions, draft => {
                draft.isPdf = val;
              })
              setAttributes({ mapOptions: showDownload });
            }}
          />
        </div>

        <div style={{ display: "flex", justifyItems: "center", gap: "10px", marginTop: "20px", marginBottom: "10px" }}>
          <label>Full Screen:</label>
          <ToggleControl
            checked={fullScreen}
            onChange={val => {
              const showFullScreen = produce(mapOptions, draft => {
                draft.fullScreen = val;
              })
              setAttributes({ mapOptions: showFullScreen });
            }}
          />
        </div>

        <div style={{ display: "flex", justifyItems: "center", gap: "10px", marginTop: "10px", marginBottom: "10px" }}>
          <label>Mouse Zoom:</label>
          <ToggleControl
            checked={isMouseZoom}
            onChange={(val) => {
              const newZoom = produce(mapOptions, draft => {
                draft.isMouseZoom = val;
              })
              setAttributes({ mapOptions: newZoom });
            }}
          />
        </div>

        <RangeControl
          label="Zoom Label"
          value={zoomUnit}
          onChange={(value) => {
            const newZoom = produce(mapOptions, draft => {
              draft.zoomUnit = value;
            })
            setAttributes({ mapOptions: newZoom });
          }}
          min={13}
          max={80}
        />
      </PanelBody>

      <PanelBody title={__("Marker Setting", "osm-block")} initialOpen={false}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "-18px",
          }}
        >
          {/* image url control */}
          <TextControl
            label={__("Marker Image URL", "n-slider")}
            value={marker.url}
            onChange={newIcon => handleImageUrlChange(newIcon)}
            placeholder={__("Insert Your Icon URL", "osm-block")}
          ></TextControl>
          {/* image upload button */}
          <MediaUpload
            onSelect={(newMedia) => handleImageUrlChange(newMedia.url)}
            render={({ open }) => (
              <Button
                onClick={open}
                style={{
                  background: "#4527a4",
                  color: "white",
                  height: "33px",
                  marginBottom: "8px",
                }}
                icon={"upload f317"}
              ></Button>
            )}
          ></MediaUpload>
        </div>

        <div style={{ display: "flex", justifyItems: "center", gap: "10px", marginTop: "10px", marginBottom: "10px" }}>
          <label style={{ color: "#050C9C", fontWeight: "bold" }}>Show Marker:</label>
          <ToggleControl
            checked={showIcon}
            onChange={val => {
              const icon = produce(marker, draft => {
                draft.showIcon = val;
              })
              setAttributes({ marker: icon })
            }}
          />
        </div>

        <div>
          <TextControl
            label={__('Type Your Marker Text', 'osm-block')}
            value={text}
            onChange={(value) => {
              const newText = produce(marker, draft => {
                draft.text = value;
              })
              setAttributes({ marker: newText })
            }}
          />

          <RangeControl
            label={__("Icon Size width", "osm-block")}
            value={width}
            onChange={val => {
              const newWidth = produce(marker, draft => {
                draft.width = val;
              })
              setAttributes({ marker: newWidth })
            }}
            min={25}
            max={60}
            shiftStep={1}
          />

          <RangeControl
            label={__("Icon Size height", "osm-block")}
            value={height}
            onChange={val => {
              const newHeight = produce(marker, draft => {
                draft.height = val;
              })
              setAttributes({ marker: newHeight })
            }}
            min={31}
            max={80}
            shiftStep={1}
          />
        </div>
      </PanelBody>

      <PanelBody title={__("Current Tracker Setting", "osm-block")} initialOpen={false}>

        <div style={{ display: "flex", justifyItems: "center", gap: "10px", marginTop: "10px", marginBottom: "10px" }}>
          <label style={{ color: "#050C9C", fontWeight: "bold" }}>Tracker Enabled:</label>
          <ToggleControl
            checked={tEnable}
            onChange={(val) => {
              const newTracker = produce(tracker, draft => {
                draft.tEnable = val;
              })
              setAttributes({ tracker: newTracker })
            }}
          />
        </div>

        <div>
          <TextControl
            label={__('Type Tracker Title', 'osm-block')}
            value={tTitle}
            onChange={(value) => {
              const newText = produce(tracker, draft => {
                draft.tTitle = value;
              })
              setAttributes({ tracker: newText })
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p>Tracker Position:</p>
          <SelectControl
            style={{ width: "145px" }}
            value={tPosition}
            options={[
              { label: "Top Left", value: "topleft" },
              { label: "Top Right", value: "topright" },
              { label: "Bottom Left", value: "bottomleft" },
              { label: "Bottom Right", value: "bottomright" },
            ]}
            onChange={(val) => {
              const newTrackerPosition = produce(tracker, draft => {
                draft.tPosition = val;
              })
              setAttributes({ tracker: newTrackerPosition })
            }}
          />
        </div>
      </PanelBody>

      <PanelBody title={__("Layer Control Setting", "osm-block")} initialOpen={false}>


        <div style={{ display: "flex", justifyItems: "center", gap: "10px", marginTop: "20px", marginBottom: "10px" }}>
          <label>Layer Type:</label>
          <ToggleControl
            checked={enable}
            onChange={val => {
              const isLayer = produce(layer, draft => {
                draft.enable = val;
              })
              setAttributes({ layer: isLayer });
            }}
          />
        </div>


        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p>Tracker Position:</p>
          <SelectControl
            style={{ width: "145px" }}
            value={position}
            options={[
              { label: "Top Left", value: "topleft" },
              { label: "Bottom Left", value: "bottomleft" },
            ]}
            onChange={(val) => {
              const newLayerPosition = produce(layer, draft => {
                draft.position = val;
              })
              setAttributes({ layer: newLayerPosition })
            }}
          />
        </div>
      </PanelBody>
    </>
  );
};

export default ContentSetting;