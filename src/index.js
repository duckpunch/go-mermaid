import godash from 'godash';
import yaml from 'js-yaml'

function process(raw) {
  console.log(yaml.load(raw));
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
type: static
size: 19
init-black: [A1, A2, A3]
init-white: [B1, B2, B3]
`)

process(`
type: freeplay
size: 19
init-black: [A1, A2, A3]
init-white: [B1, B2, B3]
`)

process(`
type: replay
size: 19
init-black: [A1, A2, A3]
init-white: [B1, B2, B3]
sequence:
  - move: c1
    comment: whoa
  - c2
  - c3
`)

process(`
type: auto-response
size: 19
init-black: [A1, A2, A3]
init-white: [B1, B2, B3]
response:
  - move: c1
    comment: Something interesting
    auto: c2
    response:
      - move: c3
        comment: Yep
`)

window.process = process;

// initial config, tree config
