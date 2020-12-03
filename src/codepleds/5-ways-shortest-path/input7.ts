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

const bellmanFord = (startNode, stopNode) => {
  const distances = new Map();
  const previous = new Map();
  for (let node of adjacencyList.keys()) {
    distances.set(node, Number.MAX_VALUE);
  }
  distances.set(startNode, 0);

  for (let i = 0; i < adjacencyList.size - 1; i++) {
    for (let n of adjacencyList.keys()) {
      for (let neighbour of adjacencyList.get(n)) {
        const newPathLength = distances.get(n) + edgeWeights.get(n).get(neighbour);
        const oldPathLength = distances.get(neighbour);
        if (newPathLength < oldPathLength) {
          distances.set(neighbour, newPathLength);
          previous.set(neighbour, n);
        }
      }
    }
  }
  for (let n of adjacencyList.keys()) {
    for (let neighbour of adjacencyList.get(n)) {
      if (distances.get(n) + edgeWeights.get(n).get(neighbour) < distances.get(neighbour)) {
        // there is a cycle with negative weight
        return null;
      }
    }
  }

  return { distance: distances.get(stopNode), path: previous };
};`;
