import godash, {Board} from "godash";

console.log("sup");
console.log(godash);
console.log(godash.Board);


/*
 * board types:
 * autoresponse
 * static - black, white
 * freeplay - black, white, turn
 * replay - sequence (pure list)
 */

// size

// how to figure out corners

/*

type: auto-response
size: 9
initBlack: ['af', 'be']
initWhite: ['ad', 'ae', 'ca', 'cb', 'cc', 'cd']
tree:
  bd:
    response: ac
    bc:
      response: ab
      bb:
        response: aa
        ba:
          result: success
        zz:
          response: ba
          result: fail
      zz:
        response: bb
        result: fail
    zz:
      response: bc
      result: fail
  zz:
    response: bd
    result: fail

alt:

bd, bc, bb, ba

node (user move): response, list[node]


bd
|- ac



|XX[comment here]
|XX[another comment]|YY|ZZ

MV[WW];C[comment];X[XX];R[YY]
| MV[AA];


(
  move: XX
  comment: [Something interesting]
  auto: YY
  response: [
    (...)
    (...)
  ]
)

 */

/**
 * top level: type, init-black, init-white, size
 */

function processStaticBoard(
  type: string,
  size: number,
  initBlack: Array<string>,
  initWhite: Array<string>,
) {
  return new Board(size);
}

function renderBoard(element, board) {
  // blank the element, add board
}


const sb = document.getElementById("sandbox");
//window.sb = sb;
//
//
// how long do redraws take?  worth it to just replace moves themselves?
// any way to clear only moves?  perhaps stacked SVGs?
