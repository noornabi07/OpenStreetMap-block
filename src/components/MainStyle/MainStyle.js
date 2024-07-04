import React from 'react';
import { getBorderCSS, getTypoCSS } from '../../../../Components/utils/getCSS'

const MainStyle = ({ attributes }) => {
  const { cId, border, columnWidth, columnHeight, wrapperBorder, wrapperStyle, typography, marker, tracker } = attributes;
  const { padding, titleColor } = wrapperStyle;
  const { color, typo, closeBtnColor, background, mWidth, mHeight } = marker;
  const { tBackground } = tracker;

  const mainWrapper = `#wrapper-${cId}`;
  const mapContent = `${mainWrapper} .mapContent`;
  const mainMap = `${mainWrapper} .mainMap`;
  const title = `${mapContent} .title`;


  const markerBackground = `${mainWrapper} .mainMap .leaflet-pane.leaflet-map-pane .leaflet-pane.leaflet-popup-pane .leaflet-popup.popupStyle.leaflet-zoom-animated .leaflet-popup-content-wrapper`;
  const markerCloseButton = `${mainWrapper} .mainMap .leaflet-pane.leaflet-map-pane .leaflet-pane.leaflet-popup-pane .leaflet-popup.popupStyle.leaflet-zoom-animated .leaflet-popup-close-button`
  const markerTitle = `${mainWrapper} .mainMap .leaflet-pane.leaflet-map-pane .leaflet-pane.leaflet-popup-pane .leaflet-popup.popupStyle.leaflet-zoom-animated .leaflet-popup-content-wrapper .leaflet-popup-content`;


  return (
    <style>
      {`
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
        ${mainWrapper}{
          ${getBorderCSS(wrapperBorder)};
          padding: ${padding}px;
        }
        ${title}{
          color: ${titleColor};
        }
        ${getTypoCSS(`${title}`, typography)?.styles}

        ${mainMap}{
          ${getBorderCSS(border)};
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