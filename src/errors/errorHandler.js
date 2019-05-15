import BadAddressError from './BadAddressError';
import NoRouteError from './NoRouteError';

export default err => {
  switch (true) {
    case err instanceof NoRouteError:
      return ' - No route found';
    case err instanceof BadAddressError:
      return '- Bad Address';
    default:
      return '';
  }
};
