import godash from 'godash';
import yaml from 'js-yaml'
import { array, lazy, mixed, number, object, string } from 'yup';

const AUTO_RESPONSE = 'auto-response';
const FREEPLAY = 'freeplay';
const REPLAY = 'replay';
const STATIC = 'static';

const coordinateList = array(mixed().transform(godash.fromA1Coordinate));
const replayMove = lazy(value => {
  switch (typeof value) {
    case 'string':
      return mixed()
        .transform(godash.fromA1Coordinate)
        .transform(coordinate => ({comment: '', move: coordinate}));
    default:
      return object({
        comment: string(),
        move: mixed().transform(godash.fromA1Coordinate),
      });
  }
});
//const autoResponseTree = 

const commonSchema = object({
  type: string()
    .required()
    .lowercase()
    .trim()
    .oneOf([AUTO_RESPONSE, FREEPLAY, REPLAY, STATIC]),
  size: number().default(19).integer(),
  'init-black': coordinateList,
  'init-white': coordinateList,
});
const schemas = {
  [AUTO_RESPONSE]: commonSchema,
  [FREEPLAY]: commonSchema,
  [REPLAY]: commonSchema.concat(object({
    sequence: array(replayMove),
  })),
  [STATIC]: commonSchema,
};

async function process(raw) {
  const loaded = yaml.load(raw);
  const common = await commonSchema.validate(loaded);
  console.log(await schemas[common.type].validate(loaded));
}

await process(`
type: static
size: 19
init-black: [A1, A2, A3]
init-white: [B1, B2, B3]
`)

await process(`
type: freeplay
size: 19
init-black: [A1, A2, A3]
init-white: [B1, B2, B3]
`)

await process(`
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

await process(`
type: auto-response
size: 19
init-black: [A1, A2, A3]
init-white: [B1, B2, B3]
responses:
  c1:
    comment: Something interesting
    auto: c2
    responses:
      c3:
        comment: Yep
`)

window.process = process;
//document.getElementById('sandbox').innerHTML = 'yo';

// initial config, tree config
