import BadAddressError from '../errors/BadAddressError';
import NoRouteError from '../errors/NoRouteError';

class MapService {
  constructor() {
    this.distanceMatrix = new window.google.maps.DistanceMatrixService();
    this.directionsService = new window.google.maps.DirectionsService();
    this.directionsRenderer = new window.google.maps.DirectionsRenderer();
    this.geocoder = new window.google.maps.Geocoder();
  }

  setMap(map) {
    this.map = new window.google.maps.Map(map, { mapTypeControl: false });
    this.directionsRenderer.setMap(this.map);
    this.directionsRenderer.setOptions({ suppressBicyclingLayer: true });
    this.directionsRenderer.addListener('directions_changed', () => {
      const zoom = 0.8;
      setTimeout(() => {
        this.map.setZoom(this.map.getZoom() + zoom);
        setTimeout(() => {
          this.map.setZoom(this.map.getZoom() - zoom);
        }, 500);
      }, 500);
    });
  }

  setAutocomplete(input) {
    this.autocomplete = new window.google.maps.places.Autocomplete(input);
    this.autocomplete.setComponentRestrictions({
      country: ['il'],
    });
  }

  setAutocompleteEvent(callback) {
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      let address = '';
      if (place.formatted_address) {
        address = place.formatted_address;
        return callback(address);
      }
    });
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getLocationAddress(address) {
    const searchedLocation = {
      address,
    };
    return new Promise((resolve, reject) => {
      this.geocoder.geocode(searchedLocation, (response, status) => {
        if (status === 'OK') {
          return resolve(response[0].geometry.location);
        } else {
          return reject(new BadAddressError(`Location not found: ${status}`));
        }
      });
    });
  }

  getTimeBetweenLocations(origin, destination, travelMode) {
    const distanceMatrixRequest = {
      origins: [origin],
      destinations: [destination],
      travelMode: travelMode,
      transitOptions: {
        modes: ['TRAIN', 'RAIL'],
      },
    };
    return new Promise((resolve, reject) => {
      this.distanceMatrix.getDistanceMatrix(
        distanceMatrixRequest,
        (response, status) => {
          if (status === 'OK') {
            return resolve(response);
          } else {
            return reject(new Error(`response status: ${status}`));
          }
        }
      );
    });
  }

  getTimesForAllTravelModes(origin, destination) {
    const travelModes = ['DRIVING', 'TRANSIT', 'WALKING', 'BICYCLING'];
    return Promise.all(
      travelModes.map(travelMode => {
        return this.getTimeBetweenLocations(origin, destination, travelMode);
      })
    )
      .then(responses => {
        return responses.map((response, index) => {
          let time = '';
          if (response.rows[0].elements[0].duration) {
            time = response.rows[0].elements[0].duration.text;
          }
          return {
            time,
            travelMode: travelModes[index],
          };
        });
      })
      .catch(err => {
        return Promise.reject('no travel times possible');
      });
  }

  calculateAndDisplayRoute(origin, destination, travelMode) {
    const distanceMatrixRequest = {
      origin,
      destination,
      travelMode,
      transitOptions: {
        modes: ['RAIL'],
      },
    };
    return new Promise((resolve, reject) => {
      this.directionsService.route(
        distanceMatrixRequest,
        (response, status) => {
          if (status === 'OK') {
            this.directionsRenderer.setDirections(response);
            return resolve();
          } else {
            return reject(new NoRouteError(`No route possible ${status}`));
          }
        }
      );
    });
  }
}

export default new MapService();
