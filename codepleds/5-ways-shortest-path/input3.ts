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

const shortestPathDfs = (startNode, stopNode) => {
  const previous = new Map();
  let shortestDistance = -1;
  const dfs = (currentNode, depth) => {
    if (currentNode === stopNode) {
      shortestDistance = depth;
    } else {
      for (let neighbour of adjacencyList.get(currentNode)) {
        previous.set(neighbour, currentNode);
        dfs(neighbour, depth + 1);
      }
    }
  };
  dfs(startNode, 0);
  return { shortestDistance, previous };
};`;
