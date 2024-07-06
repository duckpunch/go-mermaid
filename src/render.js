export function render(size) {
  const root = svg('svg', {
    viewBox: `0 0 ${size + 1} ${size + 1}`,
  });
  const board = svg('svg');
  root.appendChild(board);
  for (let i = 1; i < size; i++) {
    board.appendChild(svg('line', {
      x1: 1,
      x2: size - 1,
      y1: i,
      y2: i,
      stroke: 'black',
      'stroke-width': '0.3%',
    }));
    board.appendChild(svg('line', {
      x1: i,
      x2: i,
      y1: 1,
      y2: size - 1,
      stroke: 'black',
      'stroke-width': '0.3%',
    }));
  }
  return {
    root,
    board,
    //moves
    //annotations
  };
}

export function svg(name, attributes) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
}
