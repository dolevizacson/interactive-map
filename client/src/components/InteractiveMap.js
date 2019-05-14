import React, { Component } from 'react';
import styled from 'styled-components';

// services
import mapService from '../services/MapsService';

// components
import TimeCalculator from './TimeCalculator';

// style
const InteractiveMapStyle = styled.div`
  ${props => props.theme.div}

  width: 62vw;
  height: 28vw;
  flex-direction: column;
`;
const UpStyle = styled.div`
  ${props => props.theme.div}

  flex-direction: column;
`;
const DownStyle = styled.div`
  ${props => props.theme.div}

  justify-content: space-between;
`;
const MapHeaderContainerStyle = styled.div`
  ${props => props.theme.div}

  width: 24vw;
  height: 4vw;
  justify-content: center;
  align-items: flex-end;
`;
const MapHeaderStyle = styled.div`
  ${props => props.theme.div}

  height: 2vw;
  font-weight: bold;
  font-size: 0.8rem;
`;

const AutoComplete = styled.div`
  ${props => props.theme.div}
  justify-content: space-between;
  align-items: center;
  width: 40vw;
  height: 3vw;
`;
const AutoCompleteInputContainerStyle = styled.div`
  padding: 0.4rem 1.8rem;
  border: solid 1px;
  border-radius: 6px;
  ${props => props.theme.borderColor.grey3}
`;
const AutoCompleteInputStyle = styled.input.attrs({
  id: 'autoComplete',
})`
  width: 28vw;

  border: transparent;
  outline: 0 none;
`;
const AutoCompleteButtonContainerStyle = styled.div`
  cursor: pointer;
  padding: 0.4rem 1rem;
  border: solid 1px;
  border-radius: 25px;
  ${props => props.theme.borderColor.red1}
  &:hover {
    border: solid 2px;
    ${props => props.theme.borderColor.red1}
  }
`;
const AutoCompleteButtonStyle = styled.button`
  cursor: pointer;
  ${props => props.theme.BackgroundColor.white1}
  ${props => props.theme.color.red1}
  border: none;
  outline: 0 none;
  font-weight: bold;
`;
const MapStyle = styled.div.attrs({ id: 'map' })`
  width: 40vw;
  height: 20vw;
`;
const ErrorStyle = styled.span`
  padding: 0 1.2rem;
  font-size: 0.5rem;
  font-weight: bold;
  width: 40vw;
  height: 1vw;
  align-content: center;
  ${props => props.theme.color.red1}
  ${({ error }) => !error && `opacity:0.0`}
`;

class InteractiveMap extends Component {
  state = {
    searchLocationValue: '',
    origin: { lat: 0, lng: 0 },
    destination: { lat: 32.062867, lng: 34.785856 },
    chosenTravelMode: 'DRIVING',
    travelTimes: [],
    service: mapService,
    error: false,
  };

  async componentDidMount() {
    this.renderMap();
    this.initAutocomplete();
    await this.setCurrentPosition();
    this.getTravelTimes();
    this.setMapRoute();
  }

  // init functions
  renderMap = () => {
    this.state.service.setMap(document.getElementById('map'));
  };

  initAutocomplete = () => {
    this.state.service.setAutocomplete(document.getElementById('autoComplete'));
    this.state.service.setAutocompleteEvent(address => {
      this.renderAddress(address);
    });
  };

  setCurrentPosition = async () => {
    const position = await this.state.service.getCurrentLocation();
    const { latitude, longitude } = position;
    this.setState(state => {
      return { origin: { lat: latitude, lng: longitude } };
    });
  };

  getTravelTimes = async () => {
    const travelTimes = await this.state.service.getTimesForAllTravelModes(
      this.state.origin,
      this.state.destination
    );
    this.setState(state => {
      return { travelTimes };
    });
  };

  setMapRoute = async travelMode => {
    try {
      await this.state.service.calculateAndDisplayRoute(
        this.state.origin,
        this.state.destination,
        travelMode || this.state.chosenTravelMode
      );
    } catch (err) {
      console.log(err);
    }
  };

  getAddress = async () => {
    const origin = await this.state.service.getLocationAddress(
      this.state.searchLocationValue
    );
    this.setState(state => {
      return { origin };
    });
  };

  renderAddress = async address => {
    this.setState(
      state => {
        return {
          searchLocationValue: address,
        };
      },
      async () => {
        try {
          await this.getAddress();

          await this.setMapRoute();

          await this.getTravelTimes();

          this.setState(state => {
            return { error: false };
          });
        } catch (err) {
          console.log(err);

          this.setState(state => {
            return { error: true };
          });
        }
      }
    );
  };

  // handlers
  handleClick = () => {
    this.renderAddress(this.state.searchLocationValue);
  };

  handleChange = event => {
    this.setState({ searchLocationValue: event.target.value });
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      setTimeout(() => {
        this.renderAddress(this.state.searchLocationValue);
      }, 500);
    }
  };

  render() {
    return (
      <InteractiveMapStyle>
        <UpStyle>
          <MapHeaderContainerStyle>
            <MapHeaderStyle>Estimated time to our office</MapHeaderStyle>
          </MapHeaderContainerStyle>
          <AutoComplete>
            <AutoCompleteInputContainerStyle>
              <AutoCompleteInputStyle
                type="text"
                placeholder="Enter your address and view your distance to us"
                value={this.state.searchLocationValue}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
              />
            </AutoCompleteInputContainerStyle>
            <AutoCompleteButtonContainerStyle>
              <AutoCompleteButtonStyle onClick={this.handleClick}>
                Update
              </AutoCompleteButtonStyle>
            </AutoCompleteButtonContainerStyle>
          </AutoComplete>
          <ErrorStyle error={this.state.error}> - No route found</ErrorStyle>
        </UpStyle>
        <DownStyle>
          <MapStyle />
          <TimeCalculator
            times={this.state.travelTimes}
            onClickMethod={this.setMapRoute}
          />
        </DownStyle>
      </InteractiveMapStyle>
    );
  }
}

export default InteractiveMap;
