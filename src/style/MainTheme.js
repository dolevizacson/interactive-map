import React from 'react';
import { css, ThemeProvider } from 'styled-components';

const screenSizes = {
  wideDesktop: 1200,
  desktop: 992,
  tablet: 768,
  phone: 576,
};

const mainAppThemeColors = {
  grey1: '#838383',
  grey2: '#EEEEEE',
  grey3: '#eaeaea',
  red1: '#990000',
  white1: 'white',
};

const mainAppThemeFonts = {
  font1: 'roboto',
};

const createMediaqueries = sizes => {
  return Object.keys(sizes).reduce((sizesArray, size) => {
    sizesArray[size] = (...args) => css`
      @media (max-width: ${sizes[size] / 16}em) {
        ${css(...args)}
      }
    `;
    return sizesArray;
  }, {});
};

const createsCss = (name, options) => {
  return Object.keys(options).reduce((optionsArray, option) => {
    optionsArray[option] = css`
      ${name} : ${options[option]};
    `;
    return optionsArray;
  }, {});
};

const MainTheme = props => {
  return (
    <>
      <ThemeProvider
        theme={{
          media: createMediaqueries(screenSizes),
          color: createsCss('color', mainAppThemeColors),
          BackgroundColor: createsCss('background-color', mainAppThemeColors),
          borderColor: createsCss('border-color', mainAppThemeColors),
          font: createsCss('font-family', mainAppThemeFonts),
          div: css`
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-content: stretch;
            color: #838383;
          `,
          iconContainer: css`
            width: 30%;
            height: 30%;
          `,
          icon: css`
            width: 100%;
            height: 100%;
          `,
        }}
      >
        {props.children}
      </ThemeProvider>
    </>
  );
};

export default MainTheme;
