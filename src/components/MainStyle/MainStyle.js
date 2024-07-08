import React from 'react';
import { getBorderCSS, getTypoCSS } from '../../../../Components/utils/getCSS'

const MainStyle = ({ attributes }) => {
  const { cId, columnWidth, columnHeight, wrapperStyles, marker, mapStyles } = attributes;
  const { color, typo, closeBtnColor, background, mWidth, mHeight } = marker;
  const { padding, wrapperBorder } = wrapperStyles;
  const { mapBorder } = mapStyles;

  const mainWrapper = `#wrapper-${cId}`;
  const mainMap = `${mainWrapper} .mainMap`;


  const markerBackground = `${mainWrapper} .mainMap .leaflet-pane.leaflet-map-pane .leaflet-pane.leaflet-popup-pane .leaflet-popup.popupStyle.leaflet-zoom-animated .leaflet-popup-content-wrapper`;
  const markerCloseButton = `${mainWrapper} .mainMap .leaflet-pane.leaflet-map-pane .leaflet-pane.leaflet-popup-pane .leaflet-popup.popupStyle.leaflet-zoom-animated .leaflet-popup-close-button`
  const markerTitle = `${mainWrapper} .mainMap .leaflet-pane.leaflet-map-pane .leaflet-pane.leaflet-popup-pane .leaflet-popup.popupStyle.leaflet-zoom-animated .leaflet-popup-content-wrapper .leaflet-popup-content`;


  return (
    <style>
      {`
      ${mainWrapper}{
          padding: ${padding}px;
          ${getBorderCSS(wrapperBorder)};
        }
      ${markerCloseButton}{
        color: ${closeBtnColor};
      }
       ${markerBackground}{
        background: ${background};
        width: ${mWidth};
        height: ${mHeight};
        display: flex;
        align-items: center;
        justify-content: center;
       }
        ${markerTitle}{
          color: ${color};
        }
        ${getTypoCSS(`${markerTitle}`, typo)?.styles}
        ${mainMap}{
          ${getBorderCSS(mapBorder)};
          width: ${columnWidth.width.desktop};
          height: ${columnHeight.height.desktop};
          box-sizing: border-box;
        }
        @media only screen and (min-width:641px) and (max-width: 1024px){
          ${mainMap}{
            width: ${columnWidth.width.tablet};
            height: ${columnHeight.height.tablet};
          }
        }

        @media only screen and (max-width:640px){
          ${mainMap}{
            width: ${columnWidth.width.mobile};
            height: ${columnHeight.height.mobile};
          }
        }
      `}
    </style>
  );
};

export default MainStyle;