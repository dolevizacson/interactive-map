import React from 'react';
import styled from 'styled-components';

// components
import GlobalStyle from '../style/GlobalStyle';
import MainTheme from '../style/MainTheme';
import InteractiveMap from './InteractiveMap';
import Main from './Main';

//style
const AppStyle = styled.div`
  ${props => props.theme.div}

  width: 100vw;
  height: 100vh;
`;

function App() {
  return (
    <>
      <MainTheme>
        <>
          <GlobalStyle />
          <AppStyle>
            <Main>
              <InteractiveMap />
            </Main>
          </AppStyle>
        </>
      </MainTheme>
    </>
  );
}

export default App;
