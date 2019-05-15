import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
  font-family: 'roboto';
  src: url('/fonts/Roboto-Regular.ttf');
  }

  body {
    margin: 0;
    padding: 0;
    ${props => props.theme.font.font1}
    font-size: 1rem;
  }

  h1,h2,h3,h4,h5,h6 {
    margin:0;
  }
  
`;

export default GlobalStyle;
