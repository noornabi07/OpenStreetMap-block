import { PanelBody, PanelRow, __experimentalUnitControl as UnitControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import { Device } from '../../Panel/Device/Device'
import { Label, BorderControl, Background, Typography, BColor } from '../../../../../Components';
import { updateData } from '../../../utils/functions';
import { produce } from 'immer';

const Style = ({ attributes, setAttributes }) => {
  const [device, setDevice] = useState('desktop');
  const { columnWidth, columnHeight, border, wrapperBorder, wrapperStyle, typography } = attributes;
  const { padding, background, titleColor } = wrapperStyle;

  return (
    <div>
      <PanelBody title={__("General Style", "osm-block")}>
        <div style={{ marginTop: '10px', marginBottom: '20px' }}>
          <PanelRow>
            <Label className='mb5'>{__('Open Street Width:', 'osm-block')}</Label>
            <Device onChange={val => setDevice(val)} />
          </PanelRow>
          <UnitControl value={columnWidth.width[device]} onChange={val => setAttributes({ columnWidth: updateData(columnWidth, val, "width", device) })} beforeIcon='grid-view' ></UnitControl>
        </div>


        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <PanelRow>
            <Label className='mb5'>{__('Open Street Height:', 'osm-block')}</Label>
            <Device onChange={val => setDevice(val)} />
          </PanelRow>
          <UnitControl value={columnHeight.height[device]} onChange={newHeight => setAttributes({ columnHeight: updateData(columnHeight, newHeight, "height", device) })} beforeIcon='grid-view' ></UnitControl>
        </div>

        <BorderControl label={__('Map Border:', 'osm-block')} value={border} onChange={val => setAttributes({ border: val })} defaults={{ radius: '0px' }} />
      </PanelBody>

      <PanelBody title={__("Heading Style", "osm-block")} initialOpen={false}>

        <BColor label={__('Heading Color', 'osm-block')} value={titleColor} onChange={val => {
          const newTitleColor = produce(wrapperStyle, draft => {
            draft.titleColor = val;
          })
          setAttributes({ wrapperStyle: newTitleColor});
        }} defaultColor='#fff' />

        <Typography label={__('Heading FontControl', 'osm-block')} value={typography} onChange={val => setAttributes({ typography: val })} defaults={{ fontSize: 25 }} />
      </PanelBody>

      <PanelBody title={__("Wrapper Styles", "osm-block")} initialOpen={false}>

        <div style={{ marginBottom: "10px" }}>
          <BorderControl label={__('Border Map Wrapper:', 'osm-block')} value={wrapperBorder} onChange={val => setAttributes({ wrapperBorder: val })} defaults={{ radius: '5px' }} />
        </div>

        <RangeControl
          label="Padding Map Wrapper"
          value={padding}
          onChange={(value) => {
            const newPadding = produce(wrapperStyle, draft => {
              draft.padding = value;
            })
            setAttributes({ wrapperStyle: newPadding });
          }}
          min={10}
          max={80}
        />

        <Background label={__('Background', 'osm-block')} value={background} onChange={val => {
          const newBackground = produce(wrapperStyle, draft => {
            draft.background = val;
          })
          setAttributes({ wrapperStyle: newBackground });
        }} defaults={{ color: '#2FB0A7' }} />
      </PanelBody>
    </div>
  );
};

export default Style;