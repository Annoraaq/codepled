export const input = `const adjacencyList = new Map();
adjacencyList.set(NODE_ID, new Set([...]));

const printPath = (previous, startNode, stopNode) => {
  let currentNode = stopNode;
  console.log(currentNode);
  while (currentNode !== startNode) {
    currentNode = previous.get(currentNode);
    console.log(currentNode);
  }
}

const shortestPathBfs = (startNode, stopNode) => {
  const previous = new Map();
  const visited = new Set();
  const queue = [];
  queue.push({ node: startNode, dist: 0 });
  visited.add(startNode);

  while (queue.length > 0) {
    const { node, dist } = queue.shift();
    if (node === stopNode) return { shortestDistande: dist, previous };

    for (let neighbour of adjacencyList.get(node)) {
      if (!visited.has(neighbour)) {
        previous.set(neighbour, node);
        queue.push({ node: neighbour, dist: dist + 1 });
        visited.add(neighbour);
      }
    }
  }
  return { shortestDistance: -1, previous };
};`;
