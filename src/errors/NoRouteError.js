export default class NoRouteError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoRouteError';
  }
}
