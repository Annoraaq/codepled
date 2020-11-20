export const input = `const queue = [];

// insert elements (enqueue)
queue.push('one');
queue.push('two');
console.log(queue); // ['one', 'two']

// access last
console.log(queue[0]); // "one"

// remove last (dequeue)
queue.shift();
console.log(queue); // ['two']`;
