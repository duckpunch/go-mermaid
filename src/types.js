import godash from 'godash';
import { isArray, isNumber } from 'lodash';

const DEFAULT_SIZE = 19;

function listOfCoordinates(raw) {
  if (isArray(raw)) {
    return raw.map(godash.fromA1Coordinate);
  } else {
    throw new TypeError('expected list of coordinates');
  }
}

class Base {
  constructor(raw) {
    // TODO possibly funky parseInt results
    const size = parseInt(raw.size);
    if (isNumber(size) && size >= 2 && size <= 19) {
      this.size = size;
    } else {
      throw new TypeError(
        'size must be set to a positive integer between 2 and 19'
      );
    }

    this.initBlack = raw['init-black'] ? listOfCoordinates(raw['init-black']) : [];
    this.initWhite = raw['init-white'] ? listOfCoordinates(raw['init-white']) : [];

    this.board = godash.placeStones(
      godash.placeStones(godash.Board(size), this.initBlack, godash.BLACK),
      this.initWhite,
      godash.WHITE,
    );
  }

  render() {
    throw new Error('Not implemented');
  }
}

class StaticBoard extends Base {
  render() {
  }
}
