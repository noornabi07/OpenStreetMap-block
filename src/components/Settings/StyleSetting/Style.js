import { PanelBody, PanelRow, __experimentalUnitControl as UnitControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import { Device } from '../../Panel/Device/Device'
import { Label, BorderControl, Typography, BColor } from '../../../../../Components';
import { updateData } from '../../../utils/functions';
import { produce } from 'immer';

const Style = ({ attributes, setAttributes }) => {
  const [device, setDevice] = useState('desktop');
  const { columnWidth, columnHeight, border, wrapperBorder, wrapperStyle, marker} = attributes;
  const { padding } = wrapperStyle;
  const { color, typo, closeBtnColor, background, mWidth, mHeight } = marker;

  return (
    <div>
      <PanelBody title={__("General Style", "osm-block")} initialOpen={false}>
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
      </PanelBody>

      <PanelBody title={__("Marker Styles", "osm-block")} initialOpen={false}>
        <BColor label={__('Marker Text Color', 'osm-block')} value={color} onChange={val => {
          const newTitleColor = produce(marker, draft => {
            draft.color = val;
          })
          setAttributes({ marker: newTitleColor });
        }} defaultColor='#fff' />

        <BColor label={__('Marker Close Button Color', 'osm-block')} value={closeBtnColor} onChange={val => {
          const newTitleColor = produce(marker, draft => {
            draft.closeBtnColor = val;
          })
          setAttributes({ marker: newTitleColor });
        }} defaultColor='#fff' />

        <BColor label={__('Marker Background Color', 'osm-block')} value={background} onChange={val => {
          const newTitleColor = produce(marker, draft => {
            draft.background = val;
          })
          setAttributes({ marker: newTitleColor });
        }} defaultColor='#000' />

        <Typography label={__('Marker Typo', 'osm-block')} value={typo} onChange={val => {
          const newTypography = produce(marker, draft => {
            draft.typo = val;
          })
          setAttributes({ marker: newTypography });
        }} defaults={{ fontSize: 15 }} />

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
          <p>Marker Title Width:</p>
          <UnitControl
            style={{ width: "150px" }}
            value={mWidth}
            onChange={(val) => {
              const newWidth = produce(marker, draft => {
                draft.mWidth = val
              })
              setAttributes({ marker: newWidth })
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p>Marker Title height:</p>
          <UnitControl
            style={{ width: "150px" }}
            value={mHeight}
            onChange={(val) => {
              const newWidth = produce(marker, draft => {
                draft.mHeight = val
              })
              setAttributes({ marker: newWidth })
            }}
          />
        </div>
      </PanelBody>
    </div>
  );
};

export default Style;