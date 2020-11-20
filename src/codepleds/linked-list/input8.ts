export const input = `const createNode = (data) => ({
  next: null,
  previous: null,
  data,
});

const insertAfter = (node, data) => {
  const newNode = createNode(data);
  newNode.next = node.next;
  newNode.previous = node;
  node.next && (node.next.previous = newNode);
  node.next = newNode;
  return node;
};

const insertBefore = (node, data) => {
  const newNode = createNode(data);
  newNode.next = node;
  newNode.previous = node.previous;
  node.previous && (node.previous.next = newNode);
  node.previous = newNode;
  return newNode;
};

const removeNode = (node) => {
  if (!node) return null;

  node.previous && (node.previous.next = node.next);
  node.next && (node.next.previous = node.previous);
  return node;
}

const remove = (head, data) => removeNode(getElement(head, data));`;
