export const input = `const createNode = (data) => ({
  next: null,
  data,
});

const insertAfter = (node, data) => {
  const newNode = createNode(data);
  newNode.next = node.next;
  node.next = newNode;
  return node;
}

const insertBefore = (head, data) => {
  const newHead = createNode(data);
  newHead.next = head;
  return newHead;
}

// create new list
let head = createNode('one');

// insert element after head
insertAfter(head, 'two');

// insert to head of list
head = insertBefore(head, 'zero');`;
