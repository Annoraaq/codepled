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

const dijkstra = (startNode, stopNode) => {
  const distances = new Map();
  const previous = new Map();
  const remaining = createPriorityQueue(n => distances.get(n));
  for (let node of adjacencyList.keys()) {
    distances.set(node, Number.MAX_VALUE);
    remaining.insert(node);
  }
  distances.set(startNode, 0);

  while (!remaining.isEmpty()) {
    const n = remaining.extractMin();
    for (let neighbour of adjacencyList.get(n)) {
      const newPathLength = distances.get(n) + edgeWeights.get(n).get(neighbour);
      const oldPathLength = distances.get(neighbour);
      if (newPathLength < oldPathLength) {
        distances.set(neighbour, newPathLength);
        previous.set(neighbour, n);
      }
    }
  }

  return { distance: distances.get(stopNode), path: previous };
};`;
