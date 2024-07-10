import { isNumber } from 'lodash';

const DEFAULT_SIZE = 19;

// use lodash instead of yup
// need integer check, string check

class Base {
  constructor(raw) {
    const size = parseInt(raw.size);
    if (!isNumber(size) || size < 2 || size > 19) {
      throw new TypeError(
        'size must be set to a positive integer between 2 and 19'
      );
    }
    // check init*
  }

  render() {throw new Error('Not implemented')}
}
