export const input = `const adjacencyList = new Map();
adjacencyList.set(NODE_ID, new Set([...]));

const printPath = (previous, startNode, stopNode) => {
  let currentNode = stopNode;
  console.log(currentNode);
  while (currentNode !== startNode) {
    currentNode = previous.get(currentNode);
    console.log(currentNode);
  }
}`;
