export const input = `const Queue = () => {
  const Node = data => ({ data, next: null, prev: null });
  let head = null;
  let tail = null;

  return {
    enqueue,
    dequeue,
    peek,
  };
};`;
