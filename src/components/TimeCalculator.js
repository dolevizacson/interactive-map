import React from 'react';
import styled from 'styled-components';
import {
  DirectionsCar,
  DirectionsSubway,
  DirectionsWalk,
  DirectionsBike,
} from 'styled-icons/material';

// style
const TimeCalculatorStyle = styled.div`
  ${props => props.theme.div}

  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  align-content: space-between;
  width: 20vw;
  height: 20vw;
`;
const TravelModeTimeDisplayStyle = styled.div`
  ${props => props.theme.div}

  cursor: pointer;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 45%;
  height: 45%;
  box-shadow: 0px 0px 30px 0px rgba(222, 211, 222, 1);
  &:hover {
    ${props => props.theme.BackgroundColor.grey2}
  }
`;
const TravelModeTimeTextStyle = styled.div`
  ${props => props.theme.div}
  font-size: 0.6rem;
  padding: 5px;
`;
const IconStyle = styled.div`
  ${props => props.theme.div}
  ${props => props.theme.iconContainer}
`;
const DirectionsCarStyle = styled(DirectionsCar)`
  ${props => props.theme.icon}
`;
const DirectionsSubwayStyle = styled(DirectionsSubway)`
  ${props => props.theme.icon}
`;
const DirectionsWalkStyle = styled(DirectionsWalk)`
  ${props => props.theme.icon}
`;
const DirectionsBikeStyle = styled(DirectionsBike)`
  ${props => props.theme.icon}
`;

const TimeCalculator = props => {
  const icons = [
    <DirectionsCarStyle />,
    <DirectionsSubwayStyle />,
    <DirectionsWalkStyle />,
    <DirectionsBikeStyle />,
  ];

  return (
    <TimeCalculatorStyle>
      {props.times.map((timeObject, index) => {
        return (
          <TravelModeTimeDisplayStyle
            key={index}
            onClick={() => {
              props.onClickMethod(timeObject.travelMode);
            }}
          >
            <IconStyle>{icons[index]}</IconStyle>
            <TravelModeTimeTextStyle>
              {`${timeObject.time}`}
            </TravelModeTimeTextStyle>
          </TravelModeTimeDisplayStyle>
        );
      })}
    </TimeCalculatorStyle>
  );
};

export default TimeCalculator;
