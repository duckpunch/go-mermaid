import yaml from 'js-yaml';

import { getDiagram } from './types';

function process(dom) {
  const loaded = yaml.load(dom.innerHTML);
  const diagram = getDiagram(loaded);
  dom.innerHTML = '';
  dom.appendChild(diagram.element);
}

window.sample = {}
window.sample.staticBoard = `
type: static
size: 19
init-black: [A1, A2, A3]
init-white: [B1, B2, B3]
`;
window.sample.freeplay = `
type: freeplay
size: 19
init-black: [A1, A2, A3]
init-white: [B1, B2, B3]
`;
window.sample.replay = `
type: replay
size: 19
init-black: [A1, A2, A3]
init-white: [B1, B2, B3]
sequence:
  - move: c1
    comment: whoa
  - c2
  - c3
`;
window.sample.autoResponse = `
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
`;
window.process = process;
window.sb = document.getElementById('sandbox');
window.yaml = yaml;

for (const dom of document.getElementsByClassName('go-mermaid')) {
  process(dom);
}
