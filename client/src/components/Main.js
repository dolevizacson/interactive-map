import React from 'react';
import styled from 'styled-components';

const MainStyle = styled.div`
  ${props => props.theme.div}

  width: 100%;
  height: 100%;
  justify-content: center;
`;

const Main = props => {
  return <MainStyle>{props.children} </MainStyle>;
};

export default Main;
