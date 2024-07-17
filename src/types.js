import godash from 'godash';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

import {
  clearChildren,
  create,
  emptyOnBoard,
  renderBoard,
  stoneSvg,
  wrapBoard,
} from './render';

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
  constructor(raw) {
    super(raw);
    this.nextPlayer = godash.BLACK;
    this.lastPlay = null;
    this._initBoard = this.board;
  }

  get element() {
    if (!this._element) {
      this._created = create(this.board.dimensions);
      renderBoard(this._created.stones, this.board);
      this._wrapper = wrapBoard(this._created.root);
      this._element = this._wrapper.root;

      const resetButton = document.createElement('span');
      resetButton.textContent = 'reset';
      this._wrapper.controls.appendChild(resetButton);

      resetButton.addEventListener('click', event => {
        this.board = this._initBoard;
        renderBoard(this._created.stones, this.board);
      });

      this._created.eventPlane.addEventListener('click', event => {
        const coordinate = toCoordinate(event, this._created.eventPlane);
        try {
          const move = godash.Move(coordinate, this.nextPlayer);
          const illegalPrevious = godash.followupKo(this.board, move);
          if (illegalPrevious && illegalPrevious.equals(this.lastPlay)) {
            throw new Error('Illegal move (ko)');
          }
          this.board = godash.addMove(this.board, move);
          renderBoard(this._created.stones, this.board);
          this.nextPlayer = godash.oppositeColor(this.nextPlayer);
          this.lastPlay = coordinate;
        } catch (e) {
          // Illegal move - log for funsies
          console.log(e);
        }
      });
      this._created.eventPlane.addEventListener('mousemove', event => {
        const coordinate = toCoordinate(event, this._created.eventPlane);
        clearChildren(this._created.hoverPlane);
        if (emptyOnBoard(coordinate, this.board)) {
          this._created.hoverPlane.appendChild(stoneSvg(
            coordinate,
            this.nextPlayer,
            {
              'fill-opacity': 0.5,
              'stroke-opacity': 0.2,
            },
          ));
        }
      });
    }
    return this._element;
  }
}

function toReplayNode(node) {
  if (isString(node)) {
    return {
      move: godash.fromA1Coordinate(node),
      comment: '',
    };
  } else {
    return {
      move: godash.fromA1Coordinate(node.move),
      comment: node.comment,
    };
  }
}

export class Replay extends Board {
  constructor(raw) {
    super(raw);
    if (isArray(raw.sequence) && raw.sequence.length > 0) {
      this.sequence = raw.sequence.map(toReplayNode);
    } else {
      throw new TypeError('sequence must be provided and a non-empty array');
    }
    this.sequenceIndex = -1;
    this.currentNode = null;
    this.startColor = raw['start-color'] || godash.BLACK;
  }

  get element() {
    if (!this._element) {
      this._created = create(this.board.dimensions);
      renderBoard(this._created.stones, this.board);
      this._wrapper = wrapBoard(this._created.root);
      this._element = this._wrapper.root;

      let board = this.board;
      let color = this.startColor;
      this._boards = this.sequence.map(node => {
        board = godash.addMove(board, godash.Move(node.move, color));
        color = godash.oppositeColor(color);
        return board;
      });

      const prevButton = document.createElement('span');
      prevButton.textContent = 'prev';
      const nextButton = document.createElement('span');
      nextButton.textContent = 'next';
      this._wrapper.controls.appendChild(prevButton);
      this._wrapper.controls.appendChild(nextButton);

      this.currentBoard = board;

      prevButton.addEventListener('click', event => {
        this.sequenceIndex = this.sequenceIndex === -1 ? -1 : this.sequenceIndex - 1;

        if (this.sequenceIndex >= 0) {
          this.currentNode = this.sequence[this.sequenceIndex];
          this.currentBoard = this._boards[this.sequenceIndex];
        } else {
          this.currentNode = null;
          this.currentBoard = this.board;
        }

        renderBoard(this._created.stones, this.currentBoard);
        this._comments.textContent = this.currentNode ? this.currentNode.comment : '';
      });

      nextButton.addEventListener('click', event => {
        this.sequenceIndex = this.sequenceIndex >= this.sequence.length - 1 ? this.sequenceIndex : this.sequenceIndex + 1;

        this.currentNode = this.sequence[this.sequenceIndex];
        this.currentBoard = this._boards[this.sequenceIndex];

        renderBoard(this._created.stones, this.currentBoard);
        this._comments.textContent = this.currentNode.comment;
      });

      this._comments = document.createElement('span');
      this._wrapper.comments.appendChild(this._comments);
    }
    return this._element;
  }
}

export class AutoResponse extends Board {
  get element() {
    if (!this._element) {
      this._created = create(this.board.dimensions);
      renderBoard(this._created.stones, this.board);
      this._element = this._created.root;
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
    [REPLAY]: Replay,
    [AUTO_RESPONSE]: AutoResponse,
  }[raw.type];

  if (diagram) {
    return new diagram(raw);
  }
  throw new TypeError('Unsupported/missing type');
}
