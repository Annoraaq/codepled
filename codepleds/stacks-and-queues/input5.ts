export const input = `const Queue = () => {
  const Node = data => ({ data, next: null, prev: null });
  let head = null;
  let tail = null;

  const enqueue = data => {
    if (head == null) {
      head = Node(data);
      tail = head;
      return head;
    }
    const newNode = Node(data);
    newNode.next = head;
    head.prev = newNode;
    head = newNode;
    return head;
  };

  return {
    enqueue,
    dequeue,
    peek,
  };
};`;
