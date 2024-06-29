import godash from 'godash';

function process(raw) {
  const lines = raw.trim().split('\n').filter(line => line !== '');
  const type = lines.shift().trim();

  switch (type) {
    case 'static':
      return processStatic(lines);
    case 'freeplay':
      return processFreeplay(lines);
    case 'replay':
      return processReplay(lines);
    case 'auto-response':
      return processAutoResponse(lines);
    default:
      throw new TypeError('Unrecognized board type');
  }
}

function listOfCoordinates(raw) {
  return raw.trim()
    .split(',')
    .map(token => token.trim())
    .map(godash.fromA1Coordinate);
}

const keyMap = {
  'size': parseInt,
  'init-black': listOfCoordinates,
  'init-white': listOfCoordinates,
};

function processLine(line) {
  const parts = line.split(':');
  return [parts[0], keyMap[parts[0]](parts[1])];
}

function buildConfig(lines) {
  return Object.fromEntries(lines.map(processLine));
}

function processStatic(lines) {
  const defaultStatic = {
    'size': 19,
    'init-black': [],
    'init-white': [],
  };
  return Object.assign(defaultStatic, buildConfig(lines));
}

function processFreeplay(lines) {
  const defaultFreeplay = {
    'size': 19,
    'init-black': [],
    'init-white': [],
  };
  return Object.assign(defaultFreeplay, buildConfig(lines));
}

const startToken = '(';

function processReplay(lines) {
  while (lines.length > 0 && lines[0].trim()[0] != startToken) {
  }
}

function processAutoResponse(lines) {
  console.log(lines);
}

function processNested() {
  // want: [
  //   {
  //     contents: [str] // lines, not in parens
  //     children: [ {} ]
  //   }
  // ]
}

process(`
static

size: 19
init-black: A1, A2, A3
init-white: B1, B2, B3
`)

process(`
freeplay

size: 19
init-black: A1, A2, A3
init-white: B1, B2, B3
`)

process(`
replay

size: 19
init-black: A1, A2, A3
init-white: B1, B2, B3

(
  move: C1
  comment: Whoa
)
(
  move: C2
  comment: Whoa
)
(move: C3)
(C4)(C5)(C6)
`)

process(`
auto-response

size: 19
init-black: A1, A2, A3
init-white: B1, B2, B3

(
  move: C1
  comment: Something interesting
  response: C2
  ---
  (
    move: C3
    comment: Something else
    response: C4
    ---
    (...)
  )
)
`)

window.process = process;

// initial config, tree config
