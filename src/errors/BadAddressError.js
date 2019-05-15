export default class BadAddressError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadAddressError';
  }
}
