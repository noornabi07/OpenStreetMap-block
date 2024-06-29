import React from 'react';
import { getBorderCSS, getBackgroundCSS, getTypoCSS } from '../../../../Components/utils/getCSS'

const MainStyle = ({ attributes }) => {
  const { cId, border, columnWidth, columnHeight, wrapperBorder, wrapperStyle, typography } = attributes;
  const { padding, background, titleColor } = wrapperStyle;

  const mainWrapper = `#wrapper-${cId}`;
  const mapContent = `${mainWrapper} .mapContent`;
  const mainMap = `${mainWrapper} .mainMap`;
  const title = `${mapContent} .title`

  return (
    <style>
      {`
        ${mainWrapper}{
          ${getBorderCSS(wrapperBorder)};
          padding: ${padding}px;
          ${getBackgroundCSS(background)}
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