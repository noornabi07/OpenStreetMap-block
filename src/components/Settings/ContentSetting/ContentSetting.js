import { PanelBody, __experimentalNumberControl as NumberControl, RangeControl, TextControl, Button, ToggleControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';

const ContentSetting = ({ attributes, setAttributes, setPosition }) => {
  const { zoomUnit, isMouseZoom, content, headingTag } = attributes;


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


  return (
    <>
      <PanelBody title={__('Map Settings', 'osm-block')}>
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

        <div style={{marginTop: "20px"}}>
          <TextControl
            label={__('Type your heading', 'osm-block')}
            value={content}
            onChange={val => setAttributes({ content: val })}
            placeholder={__("Type Your Heading..", "osm-block")}
          />
        </div>

        <div>
          <p style={{ color: "#050C9C", marginTop: "10px", fontWeight: "bold"}}>Select Your Heading Tag: </p>
          <SelectControl
            value={headingTag}
            onChange={(newTag) => {
              setAttributes({ headingTag: newTag });
            }}
            options={[
              { label: 'Paragraph', value: 'p' },
              { label: 'Heading 1', value: 'h1' },
              { label: 'Heading 2', value: 'h2' },
              { label: 'Heading 3', value: 'h3' },
              { label: 'Heading 4', value: 'h4' },
              { label: 'Heading 5', value: 'h5' },
              { label: 'Heading 6', value: 'h6' },
            ]}
          />
        </div>


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
          label={__('Longitude', 'osm-block')}
          value={lngSetting}
          onChange={(value) => {
            setLngSetting(value);
            setAttributes({ settingsLng: value });
            setPosition(latSetting, value);
          }}
        />

        <div style={{ marginBottom: "20px" }}>
          <ToggleControl
            label="Mouse Inter Zoom"
            checked={isMouseZoom}
            onChange={val => setAttributes({ isMouseZoom: val })}
          >
          </ToggleControl>
        </div>

        <RangeControl
          label="Zoom Label"
          value={zoomUnit}
          onChange={(value) => setAttributes({ zoomUnit: value })}
          min={13}
          max={80}
        />
      </PanelBody>
    </>
  );
};

export default ContentSetting;