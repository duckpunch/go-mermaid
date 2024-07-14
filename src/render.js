export function create(size) {
  const root = svg('svg', {
    viewBox: `0 0 ${size + 1} ${size + 1}`,
  });

  const board = svg('svg');
  root.appendChild(board);
  for (let i = 1; i <= size; i++) {
    board.appendChild(svg('line', {
      x1: 1,
      x2: size,
      y1: i,
      y2: i,
      stroke: 'black',
      'stroke-width': '0.3%',
    }));
    board.appendChild(svg('line', {
      x1: i,
      x2: i,
      y1: 1,
      y2: size,
      stroke: 'black',
      'stroke-width': '0.3%',
    }));
  }

  const stones = svg('svg');
  root.appendChild(stones);

  const annotations = svg('svg');
  root.appendChild(annotations);

  const eventPlane = svg('svg');
  eventPlane.appendChild(svg('rect', {
    fill: 'rgb(0,0,0,0.001)',
    x: 0,
    y: 0,
    width: size + 1,
    height: size + 1,
  }));
  root.appendChild(eventPlane);

  return { root, board, stones, annotations, eventPlane };
}

export function svg(name, attributes) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
}

export function renderBoard(stoneContainer, board) {
  board.moves.forEach((color, coordinate) => {
    stoneContainer.appendChild(svg('circle', {
      cx: coordinate.x + 1,
      cy: coordinate.y + 1,
      r: '0.45',
      fill: color,
      stroke: 'black',
      'stroke-width':  '0.3%',
    }));
  });
}
