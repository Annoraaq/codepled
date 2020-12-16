export const input = `const stack = [];

// insert elements (push)
stack.push('one');
stack.push('two');
console.log(stack); // ['one', 'two']

// access first (peek)
console.log(stack[stack.length-1]); // "two"

// remove first (pop)
stack.pop();
console.log(stack); // ['one']`;
