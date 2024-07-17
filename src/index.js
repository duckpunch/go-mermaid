import yaml from 'js-yaml';

import { getDiagram } from './types';

function process(dom) {
  const loaded = yaml.load(dom.innerHTML);
  const diagram = getDiagram(loaded);
  dom.innerHTML = '';
  dom.appendChild(diagram.element);
}

for (const dom of document.getElementsByClassName('go-mermaid')) {
  process(dom);
}
