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

const addIfUnset = (map, key, value) => {
  if (!map.has(key)) {
    map.set(key, value);
  }
}

const shortestPathBfs = (adjList, queue, visitedOwn, visitedOther, previous, isBackwards) => {
  if (queue.length > 0) {
    const { node, dist } = queue.shift();
    if (visitedOther.has(node)) {
      return {
        shortestDistance: dist + visitedOther.get(node),
        previous,
      };
    }

    for (let neighbour of adjList.get(node)) {
      if (!visitedOwn.has(neighbour)) {
        if (isBackwards) {
          addIfUnset(previous, node, neighbour);
        } else {
          addIfUnset(previous, neighbour, node);
        }
        queue.push({ node: neighbour, dist: dist + 1 });
        visitedOwn.set(neighbour, dist + 1);
      }
    }
  }
};

const bidirectionalSearch = (adjList, startNode, stopNode) => {
  const previous = new Map();
  const visited1 = new Map();
  const visited2 = new Map();
  const queue1 = [];
  const queue2 = [];
  queue1.push({ node: startNode, dist: 0 });
  queue2.push({ node: stopNode, dist: 0 });
  visited1.set(startNode, 0);
  visited2.set(stopNode, 0);

  while (queue1.length > 0 || queue2.length > 0) {
    shortestPathBfs(adjList, queue1, visited1, visited2, previous, false);
    shortestPathBfs(adjList, queue2, visited2, visited1, previous, true);
  }
  return { shortestDistance: -1, previous };
};`;
