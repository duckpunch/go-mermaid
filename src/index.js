import godash from 'godash';

function process(raw) {
  raw = raw.trim()
  const type = raw.split('\n', 1)[0].trim();
  const rest = raw.replace(type, '').trim();
  switch (type) {
    case 'static':
      return processStatic(rest);
    case 'freeplay':
      return processFreeplay(rest);
    case 'replay':
      return processReplay(rest);
    case 'auto-response':
      return processAutoResponse(rest);
  }
}

function processStatic(raw) {
  console.log(raw);
}

function processFreeplay(raw) {
  console.log(raw);
}

function processReplay(raw) {
  console.log(raw);
}

function processAutoResponse(raw) {
  console.log(raw);
}

process(`
static

size: 19
init-black: A1, A2, A3
init-white: B1, B2, B3
`)

// {size: 19, init-black: [a1, a2, ...], init-white: [b1, ...]}

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

[
  (
    move: C1
    comment: Whoa
  )
  (
    move: C2
    comment: Whoa
  )
]
`)

process(`
auto-response

size: 19
init-black: A1, A2, A3
init-white: B1, B2, B3

(
  move: C1
  comment: Something interesting
  auto: C2
  response: [
    (
      move: C3
      comment: Something else
      auto: C4
      response: []
    )
  ]
)
`)

window.process = process;
