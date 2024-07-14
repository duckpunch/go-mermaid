//import { Board, BLACK, WHITE, fromA1Coordinate, placeStones } from 'godash';
import godash from 'godash';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';

import { create, renderBoard } from './render';

const DEFAULT_SIZE = 19;

function listOfCoordinates(raw) {
  if (isArray(raw)) {
    return raw.map(godash.fromA1Coordinate);
  } else {
    throw new TypeError('expected list of coordinates');
  }
}

class Board {
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

  get element() {
    throw new Error('Not implemented');
  }
}

export class StaticBoard extends Board {
  get element() {
    if (!this._element) {
      this._created = create(this.board.dimensions);
      renderBoard(this._created.stones, this.board);
      this._element = this._created.root;
    }
    return this._element;
  }
}

function toLocalPoint(mouseEvent, svgParent) {
  const svgPoint = svgParent.createSVGPoint();
  svgPoint.x = mouseEvent.clientX;
  svgPoint.y = mouseEvent.clientY;

  return svgPoint.matrixTransform(svgParent.getScreenCTM().inverse());
}

function toCoordinate(mouseEvent, svgParent) {
  const svgPoint = toLocalPoint(mouseEvent, svgParent);
  svgPoint.x = Math.floor(svgPoint.x + 0.5) - 1;
  svgPoint.y = Math.floor(svgPoint.y + 0.5) - 1;
  return godash.Coordinate(svgPoint.x, svgPoint.y);
}

export class Freeplay extends Board {
  get element() {
    if (!this._element) {
      this._created = create(this.board.dimensions);
      renderBoard(this._created.stones, this.board);
      this._element = this._created.root;

      this._created.eventPlane.addEventListener('click', event => {
        console.log(toCoordinate(event, this._created.eventPlane).toString());
      });
    }
    return this._element;
  }
}

export const AUTO_RESPONSE = 'auto-response';
export const FREEPLAY = 'freeplay';
export const REPLAY = 'replay';
export const STATIC = 'static';

export function getDiagram(raw) {
  const diagram = {
    [STATIC]: StaticBoard,
    [FREEPLAY]: Freeplay,
  }[raw.type];

  if (diagram) {
    return new diagram(raw);
  }
  throw new TypeError('Unsupported/missing type');
}
