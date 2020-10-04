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

const getElementAt = (head, index) => {
  let currentIndex = 0;
  let currentNode = head;
  while (currentIndex < index && currentNode !== null) {
      currentIndex++;
      currentNode = currentNode.next;
  }
  return currentNode;
}

const getElement = (head, data) => {
  let currentNode = head;
  while (currentNode.data !== data && currentNode !== null) {
      currentNode = currentNode.next;
  }
  return currentNode;
}

const remove = (head, data) => {
  if (head.data === data) return head.next;
  let currentNode = head;
  while (currentNode.next !== null ) {
      if (currentNode.next.data === data) {
          currentNode.next = currentNode.next.next;
          return head;
      }
      currentNode = currentNode.next;
  }
  return head;
}

// create new list
let head = createNode('one');

// insert element after head
insertAfter(head, 'two');

// insert to head of list
head = insertBefore(head, 'zero');`;
