const input1 = "const createNode = (data) => ({ \n  next: null, \n  data, \n});";
const input2 = "const createNode = (data) => ({ \n  next: null, \n  data, \n}); \n \nconst insertAfter = (node, data) => { \n  const newNode = createNode(data); \n  newNode.next = node.next; \n  node.next = newNode; \n  return node; \n} \n \nconst insertBefore = (head, data) => { \n  const newHead = createNode(data); \n  newHead.next = head; \n  return newHead; \n} \n \n// create new list \nlet head = createNode('one'); \n \n// insert element after head \ninsertAfter(head, 'two'); \n \n// insert to head of list \nhead = insertBefore(head, 'zero'); \n";
const input3 = "const createNode = (data) => ({ \n  next: null, \n  data, \n}); \n \nconst insertAfter = (node, data) => { \n  const newNode = createNode(data); \n  newNode.next = node.next; \n  node.next = newNode; \n  return node; \n} \n \nconst insertBefore = (head, data) => { \n  const newHead = createNode(data); \n  newHead.next = head; \n  return newHead; \n} \n \nconst getElementAt = (head, index) => { \n  let currentIndex = 0; \n  let currentNode = head; \n  while (currentIndex < index && currentNode !== null) { \n      currentIndex++; \n      currentNode = currentNode.next; \n  } \n  return currentNode; \n} \n \n// create new list \nlet head = createNode('one'); \n \n// insert element after head \ninsertAfter(head, 'two'); \n \n// insert to head of list \nhead = insertBefore(head, 'zero'); \n";
const input4 = "const createNode = (data) => ({ \n  next: null, \n  data, \n}); \n \nconst insertAfter = (node, data) => { \n  const newNode = createNode(data); \n  newNode.next = node.next; \n  node.next = newNode; \n  return node; \n} \n \nconst insertBefore = (head, data) => { \n  const newHead = createNode(data); \n  newHead.next = head; \n  return newHead; \n} \n \nconst getElementAt = (head, index) => { \n  let currentIndex = 0; \n  let currentNode = head; \n  while (currentIndex < index && currentNode !== null) { \n      currentIndex++; \n      currentNode = currentNode.next; \n  } \n  return currentNode; \n} \n \nconst getElement = (head, data) => { \n  let currentNode = head; \n  while (currentNode.data !== data && currentNode !== null) { \n      currentNode = currentNode.next; \n  } \n  return currentNode; \n} \n \n// create new list \nlet head = createNode('one'); \n \n// insert element after head \ninsertAfter(head, 'two'); \n \n// insert to head of list \nhead = insertBefore(head, 'zero'); \n";
const input5 = "const createNode = (data) => ({ \n  next: null, \n  data, \n}); \n \nconst insertAfter = (node, data) => { \n  const newNode = createNode(data); \n  newNode.next = node.next; \n  node.next = newNode; \n  return node; \n} \n \nconst insertBefore = (head, data) => { \n  const newHead = createNode(data); \n  newHead.next = head; \n  return newHead; \n} \n \nconst getElementAt = (head, index) => { \n  let currentIndex = 0; \n  let currentNode = head; \n  while (currentIndex < index && currentNode !== null) { \n      currentIndex++; \n      currentNode = currentNode.next; \n  } \n  return currentNode; \n} \n \nconst getElement = (head, data) => { \n  let currentNode = head; \n  while (currentNode.data !== data && currentNode !== null) { \n      currentNode = currentNode.next; \n  } \n  return currentNode; \n} \n \nconst remove = (head, data) => { \n  if (head.data === data) return head.next; \n  let currentNode = head; \n  while (currentNode.next !== null ) { \n      if (currentNode.next.data === data) { \n          currentNode.next = currentNode.next.next; \n          return head; \n      } \n      currentNode = currentNode.next; \n  } \n  return head; \n} \n \n// create new list \nlet head = createNode('one'); \n \n// insert element after head \ninsertAfter(head, 'two'); \n \n// insert to head of list \nhead = insertBefore(head, 'zero'); \n";
const input6 = "const createNode = (data) => ({ \n  next: null, \n  previous: null, \n  data, \n}); \n";
const input7 = "const createNode = (data) => ({ \n  next: null, \n  previous: null, \n  data, \n}); \n \nconst insertAfter = (node, data) => { \n  const newNode = createNode(data); \n  newNode.next = node.next; \n  newNode.previous = node; \n  node.next && (node.next.previous = newNode); \n  node.next = newNode; \n  return node; \n}; \n \nconst insertBefore = (node, data) => { \n  const newNode = createNode(data); \n  newNode.next = node; \n  newNode.previous = node.previous; \n  node.previous && (node.previous.next = newNode); \n  node.previous = newNode; \n  return newNode; \n}; \n";
const input8 = "const createNode = (data) => ({ \n  next: null, \n  previous: null, \n  data, \n}); \n \nconst insertAfter = (node, data) => { \n  const newNode = createNode(data); \n  newNode.next = node.next; \n  newNode.previous = node; \n  node.next && (node.next.previous = newNode); \n  node.next = newNode; \n  return node; \n}; \n \nconst insertBefore = (node, data) => { \n  const newNode = createNode(data); \n  newNode.next = node; \n  newNode.previous = node.previous; \n  node.previous && (node.previous.next = newNode); \n  node.previous = newNode; \n  return newNode; \n}; \n \nconst removeNode = (node) => { \n  if (!node) return null; \n \n  node.previous && (node.previous.next = node.next); \n  node.next && (node.next.previous = node.previous); \n  return node; \n} \n \nconst remove = (head, data) => removeNode(getElement(head, data)); \n";

var commands = [
  [
    'SHOW_TEXT',
    {
      title: "Introduction",
      message:
        "<h1>Basic Interview Data Structures in JavaScript: Linked Lists</h1>" +
        "<p>A linked list is a simple data structure that can be very handy when you need to efficiently insert/remove nodes at any position of the list. To do that efficiently you simply need a pointer to the previous node.</p>" +
        "<p>I will give you the runtime complexity for the data structure:</p>" +
        "<ul>" +
        "<li><strong>Insertion</strong> (insert an element): O(1)</li>" +
        "<li><strong>Random access</strong> (access any element): O(n)<sup>*</sup></li>" +
        "<li><strong>Find</strong> (find a specific element): O(n)</li>" +
        "<li><strong>Random removal</strong> (remove any element): O(n)</li>" +
        "</ul>" +
        "<blockquote><sup>*</sup>Fetching the first and last element of a list can actually be done in O(1)</blockquote>" +
        "<p>Unlike in Java, there is no default linked list implementation in JavaScript. In practise you would probably use a third party implementation if you needed a linked list. However, in an interview situation this might not be possible. If the implementation of the linked list is not the core of the interview question, you can discuss with your interviewer if you can just pretend there is an implementation and simply use it in your algorithm. In all other cases you need to be able to code up a simple linked list from scratch.</p>" +
        "<h3>Singly or Doubly Linked List?</h3>" +
        "<p>During an interview where you need to code up your linked list yourself you should not use a doubly linked list if not really necessary for the task, because it adds too much complexity to your code. A doubly linked list enables you to delete a node in <i>O(1)</i> instead of <i>O(n)</i> if you have a pointer to that node. Furthermore a doubly linked list allows to efficiently insert a node before some other node while a singly linked list only allows efficient adding after it.</p>",
      pause: true,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "A Simple Singly Linked List",
      message:
        "<h2>A Simple Singly Linked List</h2>" +
        "<p>During an interview where you need to code up your linked list yourself you should not use a doubly linked list if not really necessary for the task, because it adds too much complexity to your code. A doubly linked list enables you to delete a node in <i>O(1)</i> instead of <i>O(n)</i> if you have a pointer to that node. Furthermore a doubly linked list allows to efficiently insert a node before some other node while a singly linked list only allows efficient adding after it.</p>",
      pause: true,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "Introduction",
      message: `A simple approach for a singly linked list is the following data structure.</p><p>It is a simple list node object that contains data as well as a pointer to the next element in the list. But as simple as this data structure might be the complexity comes with the operations. <br />`,
      pause: false,
      level: 2,
    },
  ],
  ['CREATE_DIFF', { source: "", target: input1 }],
  ['SET_CURSOR', 0],
  ['PAUSE', undefined],
  [
    'SHOW_TEXT',
    {
      title: "Insertion",
      message:
        "<h3>Insertion</h3>The complexity in both runtime and code depends on where you want to insert an element into the list. It is fairly easy to append an element to the beginning of the list in O(1). If you want to add an element after any node than you can do this in O(1) if you have a pointer to that node. Otherwise you first need to traverse the list to find the node which is only possible in O(n).",
      pause: false,
      level: 2,
    },
  ],
  ['CREATE_DIFF', { source: input1, target: input2 }],
  ['PAUSE', undefined],
  ['SET_CURSOR', 0],
  [
    'SHOW_TEXT',
    {
      title: "Random Access",
      message: `<h3>Random access</h3>To access an element at any given index in the list you have to start at the head and follow the list until you reached the specified index. This operation has O(n) time complexity.
    `,
      pause: false,
      level: 2,
    },
  ],
  ['CREATE_DIFF', { source: input2, target: input3 }],
  ['PAUSE', undefined],
  ['SET_CURSOR', 0],
  [
    'SHOW_TEXT',
    {
      title: "Find",
      message: `<h3>Find</h3>Finding a specific element is similar to accessing a random element. The only difference is that you need to compare the data of the current element with the one you are looking for. The runtime complexity of this operation is O(n).
    `,
      pause: false,
      level: 2,
    },
  ],
  ['CREATE_DIFF', { source: input3, target: input4 }],
  ['PAUSE', undefined],
  ['SET_CURSOR', 0],
  [
    'SHOW_TEXT',
    {
      title: "Random Removal",
      message: `<h3>Random removal</h3>Removing any element from the list is a combination of finding the element and its predecessor and updating the next pointers. This operations also has a runtime complexity of O(n) caused by the find operation.
    `,
      pause: false,
      level: 2,
    },
  ],
  ['CREATE_DIFF', { source: input4, target: input5 }],
  ['PAUSE', undefined],
  [
    'SHOW_TEXT',
    {
      title: "More Sophisticated Implementations",
      message:
        "<h3>More Sophisticated Implementations</h3>" +
        "<p>The presented implementation is a very simple one that has the advantage of being simple and fast to code up during an interview. However, there are some drawbacks, too. For instance getting the size of the list is only possible in O(n) with this implementation. Of course you could just keep a variable to track the size of the list but this is very error prone. Additionally it can be dangerous if the same list is used in two places within the program and the head of the list changes. While one part of the program might change the head, the other part might not get informed and still points to the old head. So using a wrapper object for the whole list is recommended.</p>",
      pause: false,
      level: 2,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "Doubly Linked List",
      message:
        "<h2>Doubly Linked List</h2>" +
        "<p>If you really need a doubly linked list you need to modify the operations and the data structure a bit.</p>",
      pause: false,
    },
  ],
  ['REPLACE_ALL', ""],
  ['CREATE_DIFF', { source: "", target: input6 }],
  ['PAUSE', undefined],
  [
    'SHOW_TEXT',
    {
      title: "Insertion",
      message:
        "<h3>Insertion</h3>" +
        "<p>Not only do we have to update the next pointers of the nodes but now also the previous pointers. It is easy to mess this up and forget to update a pointer during an interview.</p>",
      pause: false,
      level: 2,
    },
  ],
  ['CREATE_DIFF', { source: input6, target: input7 }],
  ['PAUSE', undefined],
  [
    'SHOW_TEXT',
    {
      title: "Random Removal",
      message:
        "<h3>Random Removal</h3>" +
        "<p>Random removal simply works by finding the element and then updating the pointers of the previous and next element. If we do not need to find the element to remove then this operation is possible in O(1). This was not possible with a singly linked list because finding the previous element takes O(n) there.</p>",
      pause: false,
      level: 2,
    },
  ],
  ['CREATE_DIFF', { source: input7, target: input8 }],
  ['PAUSE', undefined],
  [
    ,
    {
      title: "Conclusion",
      message:
        "<h3>Conclusion</h3>" +
        "<p>Linked lists are essential for coding interviews. However, clarify with your interviewer if you really need to implement it from scratch. There are coding tasks where it is essential that you recognise to use a linked list but there is no need to implement it. Make sure to know the different operations and their time complexity.</p>" +
        "<p>I wish you good luck for your interviews!</p>",
      pause: false,
    },
  ],
];
