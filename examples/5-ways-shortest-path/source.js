const input1 = "const adjacencyList = new Map(); \nadjacencyList.set(NODE_ID, new Set([...])); \n";
const input2 = "const adjacencyList = new Map(); \nadjacencyList.set(NODE_ID, new Set([...])); \n \nconst printPath = (previous, startNode, stopNode) => { \n  let currentNode = stopNode; \n  console.log(currentNode); \n  while (currentNode !== startNode) { \n    currentNode = previous.get(currentNode); \n    console.log(currentNode); \n  } \n} \n";
const input3 = "const adjacencyList = new Map(); \nadjacencyList.set(NODE_ID, new Set([...])); \n \nconst printPath = (previous, startNode, stopNode) => { \n  let currentNode = stopNode; \n  console.log(currentNode); \n  while (currentNode !== startNode) { \n    currentNode = previous.get(currentNode); \n    console.log(currentNode); \n  } \n} \n \nconst shortestPathDfs = (startNode, stopNode) => { \n  const previous = new Map(); \n  let shortestDistance = -1; \n  const dfs = (currentNode, depth) => { \n    if (currentNode === stopNode) { \n      shortestDistance = depth; \n    } else { \n      for (let neighbour of adjacencyList.get(currentNode)) { \n        previous.set(neighbour, currentNode); \n        dfs(neighbour, depth + 1); \n      } \n    } \n  }; \n  dfs(startNode, 0); \n  return { shortestDistance, previous }; \n}; \n";
const input4 = "const adjacencyList = new Map(); \nadjacencyList.set(NODE_ID, new Set([...])); \n \nconst printPath = (previous, startNode, stopNode) => { \n  let currentNode = stopNode; \n  console.log(currentNode); \n  while (currentNode !== startNode) { \n    currentNode = previous.get(currentNode); \n    console.log(currentNode); \n  } \n} \n \nconst shortestPathBfs = (startNode, stopNode) => { \n  const previous = new Map(); \n  const visited = new Set(); \n  const queue = []; \n  queue.push({ node: startNode, dist: 0 }); \n  visited.add(startNode); \n \n  while (queue.length > 0) { \n    const { node, dist } = queue.shift(); \n    if (node === stopNode) return { shortestDistande: dist, previous }; \n \n    for (let neighbour of adjacencyList.get(node)) { \n      if (!visited.has(neighbour)) { \n        previous.set(neighbour, node); \n        queue.push({ node: neighbour, dist: dist + 1 }); \n        visited.add(neighbour); \n      } \n    } \n  } \n  return { shortestDistance: -1, previous }; \n}; \n";
const input5 = "const adjacencyList = new Map(); \nadjacencyList.set(NODE_ID, new Set([...])); \n \nconst printPath = (previous, startNode, stopNode) => { \n  let currentNode = stopNode; \n  console.log(currentNode); \n  while (currentNode !== startNode) { \n    currentNode = previous.get(currentNode); \n    console.log(currentNode); \n  } \n} \n \nconst addIfUnset = (map, key, value) => { \n  if (!map.has(key)) { \n    map.set(key, value); \n  } \n} \n \nconst shortestPathBfs = (adjList, queue, visitedOwn, visitedOther, previous, isBackwards) => { \n  if (queue.length > 0) { \n    const { node, dist } = queue.shift(); \n    if (visitedOther.has(node)) { \n      return { \n        shortestDistance: dist + visitedOther.get(node), \n        previous, \n      }; \n    } \n \n    for (let neighbour of adjList.get(node)) { \n      if (!visitedOwn.has(neighbour)) { \n        if (isBackwards) { \n          addIfUnset(previous, node, neighbour); \n        } else { \n          addIfUnset(previous, neighbour, node); \n        } \n        queue.push({ node: neighbour, dist: dist + 1 }); \n        visitedOwn.set(neighbour, dist + 1); \n      } \n    } \n  } \n}; \n \nconst bidirectionalSearch = (adjList, startNode, stopNode) => { \n  const previous = new Map(); \n  const visited1 = new Map(); \n  const visited2 = new Map(); \n  const queue1 = []; \n  const queue2 = []; \n  queue1.push({ node: startNode, dist: 0 }); \n  queue2.push({ node: stopNode, dist: 0 }); \n  visited1.set(startNode, 0); \n  visited2.set(stopNode, 0); \n \n  while (queue1.length > 0 || queue2.length > 0) { \n    shortestPathBfs(adjList, queue1, visited1, visited2, previous, false); \n    shortestPathBfs(adjList, queue2, visited2, visited1, previous, true); \n  } \n  return { shortestDistance: -1, previous }; \n}; \n";
const input6 = "const adjacencyList = new Map(); \nadjacencyList.set(NODE_ID, new Set([...])); \n \nconst printPath = (previous, startNode, stopNode) => { \n  let currentNode = stopNode; \n  console.log(currentNode); \n  while (currentNode !== startNode) { \n    currentNode = previous.get(currentNode); \n    console.log(currentNode); \n  } \n} \n \nconst dijkstra = (startNode, stopNode) => { \n  const distances = new Map(); \n  const previous = new Map(); \n  const remaining = createPriorityQueue(n => distances.get(n)); \n  for (let node of adjacencyList.keys()) { \n    distances.set(node, Number.MAX_VALUE); \n    remaining.insert(node); \n  } \n  distances.set(startNode, 0); \n \n  while (!remaining.isEmpty()) { \n    const n = remaining.extractMin(); \n    for (let neighbour of adjacencyList.get(n)) { \n      const newPathLength = distances.get(n) + edgeWeights.get(n).get(neighbour); \n      const oldPathLength = distances.get(neighbour); \n      if (newPathLength < oldPathLength) { \n        distances.set(neighbour, newPathLength); \n        previous.set(neighbour, n); \n      } \n    } \n  } \n \n  return { distance: distances.get(stopNode), path: previous }; \n}; \n";
const input7 = "const adjacencyList = new Map(); \nadjacencyList.set(NODE_ID, new Set([...])); \n \nconst printPath = (previous, startNode, stopNode) => { \n  let currentNode = stopNode; \n  console.log(currentNode); \n  while (currentNode !== startNode) { \n    currentNode = previous.get(currentNode); \n    console.log(currentNode); \n  } \n} \n \nconst bellmanFord = (startNode, stopNode) => { \n  const distances = new Map(); \n  const previous = new Map(); \n  for (let node of adjacencyList.keys()) { \n    distances.set(node, Number.MAX_VALUE); \n  } \n  distances.set(startNode, 0); \n \n  for (let i = 0; i < adjacencyList.size - 1; i++) { \n    for (let n of adjacencyList.keys()) { \n      for (let neighbour of adjacencyList.get(n)) { \n        const newPathLength = distances.get(n) + edgeWeights.get(n).get(neighbour); \n        const oldPathLength = distances.get(neighbour); \n        if (newPathLength < oldPathLength) { \n          distances.set(neighbour, newPathLength); \n          previous.set(neighbour, n); \n        } \n      } \n    } \n  } \n  for (let n of adjacencyList.keys()) { \n    for (let neighbour of adjacencyList.get(n)) { \n      if (distances.get(n) + edgeWeights.get(n).get(neighbour) < distances.get(neighbour)) { \n        // there is a cycle with negative weight \n        return null; \n      } \n    } \n  } \n \n  return { distance: distances.get(stopNode), path: previous }; \n}; \n";

var commands = [
  [
    'SHOW_TEXT',
    {
      title: "Introduction",
      message:
        "<h1>5 Ways to Find the Shortest Path in a Graph</h1>" +
        "<p>When it comes to finding the shortest path in a graph, most people think of Dijkstra's algorithm (also called Dijkstra's Shortest Path First algorithm). While Dijkstra's algorithm is indeed very useful, there are simpler approaches that can be used based on the properties of the graph. These can be very handy in competitive programming contests or coding interviews, where you might be forced to code up a shortest-path algorithm by hand. You need the simplest approach possible to reduce the possibility of bugs in your code.</p>" +
        "<p>For the following algorithms, we will assume that the graphs are stored in an adjacency list of the following form.</p>",
      pause: false,
    },
  ],
  ['CREATE_DIFF', {
    source: "",
    target:
      "const adjacencyList = new Map();"
      + "adjacencyList.set(NODE_ID, new Set([...]));"
  }],
  ['SET_CURSOR', 0],
  ['PAUSE', undefined],
  [
    'SHOW_TEXT',
    {
      toc: false,
      message:
        "<p>It is a HashMap of HashSets and stores the adjacent nodes for each node.</p>" +
        "<p>Furthermore, every algorithm will return the shortest distance between two nodes as well as a map that we call previous. That map holds the predecessor of every node contained in the shortest path. With this mapping, we can print the nodes on the shortest path as follows.</p>",
      pause: false,
    },
  ],
  ['CREATE_DIFF', {
    source: input1,
    target: input2
  }],
  ['SET_CURSOR', 0],
  ['PAUSE', undefined],
  [
    'SHOW_TEXT',
    {
      title: "1. Depth-First Search (DFS)",
      message:
        "<h2>1. Depth-First Search (DFS)</h2>" +
        "<p>This is probably the simplest algorithm to get the shortest path. However, there are drawbacks too. Your graph needs to be a tree or polytree. If this condition is met, you can use a slightly modified DFS to find your shortest path.</p>",
      pause: false,
    },
  ],
  ['CREATE_DIFF', {
    source: input2,
    target: input3,
  }],
  ['SET_CURSOR', 0],
  ['PAUSE', undefined],
  [
    'SHOW_TEXT',
    {
      toc: false,
      message:
        "<p>If there does not exist a path between startNode and stopNode, the shortest path will have a length of -1. We initialize the shortest path with this value and start a recursive DFS. That recursive DFS is slightly modified in the sense that it will track the depth of the search and stop as soon as it reaches stopNode. The current depth when it reaches stopNode is our shortest path length.</p>" +
        "<p>The reason why we can't use it for cyclic graphs is that whenever we find a path, we can't be sure that it is the shortest path. A DFS gives no such guarantee.</p>",
      pause: true,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "Performance",
      level: 2,
      message:
        "<h3>Performance</h3>" +
        "<p>Let <i>n</i> be the number of nodes and <i>e</i> be the number of edges in our graph. This algorithm then has a time complexity of <i>O(n)</i>. Because of its recursive nature, it utilizes the call stack and therefore has an asymptotic memory consumption of <i>O(n)</i>.</p>" +
        "<p>Why not <i>O(n + e)</i>? Well, this is because we assumed that our graph was acyclic. This means that <i>e ≤ n-1</i> and therefore <i>O(n+e) = O(n)</i>.</p>",
      pause: true,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "2. Breadth-First Search (BFS)",
      message:
        "<h2>2. Breadth-First Search (BFS)</h2>" +
        "<p>A slightly modified BFS is a very useful algorithm to find the shortest path. It is simple and applicable to all graphs without edge weights.</p>" +
        "<p>Why not <i>O(n + e)</i>? Well, this is because we assumed that our graph was acyclic. This means that <i>e ≤ n-1</i> and therefore <i>O(n+e) = O(n)</i>.</p>",
      pause: true,
    },
  ],
  ['REPLACE_ALL', input2],
  ['CREATE_DIFF', { source: input2, target: input4 }],
  ['SET_CURSOR', 0],
  ['PAUSE', undefined],
  [
    'SHOW_TEXT',
    {
      toc: false,
      message:
        "<p>This is a straightforward implementation of a BFS that only differs in a few details. With every node that gets stored in the queue, we additionally save the distance to <strong>startNode</strong>. When we reach <strong>stopNode</strong>, we simply return the distance that was stored along with it.</p>" +
        "<p>This works because of the nature of a BFS: A neighbor's neighbor is not visited before all direct neighbors have been visited. As a consequence, all nodes with distance <i>x</i> from <strong>startNode</strong> are visited after all nodes with distance <i>&lt; x</i> have been visited. The BFS will first visit nodes with distance <i>0</i> then all nodes with distance <i>1</i> and so on. This property is the reason why we can use a BFS to find the shortest path even in cyclic graphs.</p>",
      pause: true,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "Performance",
      level: 2,
      message:
        "<h3>Performance</h3>" +
        "<p>Let <i>g</i> describe the largest number of adjacent nodes for any node in our graph. Moreover, let <i>d</i> be the length of the shortest path between <strong>startNode</strong> and <strong>stopNode</strong>. Then this algorithm has a time complexity of <i>O(g<sup>d</sup>)</i>.</p>" +
        "<p>Why is that? A BFS searches a graph in so-called levels. Every node in a level has the same distance to the start node. It takes <i>O(g)</i> steps to reach level <i>1</i>, <i>O(g<sup>2</sup>)</i> steps to reach level <i>2</i>, and so on. Therefore, it takes <i>O(g<sup>d</sup>)</i> steps to reach level <i>d</i>. Using the variables <i>n</i> and <i>e</i> again, the runtime is still <i>O(n + e)</i>. However, <i>O(g<sup>d</sup>)</i> is a more precise statement if looking for the shortest path.</p>" +
        "<p>In some graphs, the queue can contain all of its nodes. Therefore, it also has a space complexity of <i>O(n)</i>.</p>" +
        "<p>A small remark: The actual runtime of the above implementation is worse than <i>O(n + e)</i>. The reason is that a JavaScript array is used as a queue. The shift operation takes <i>O(s)</i> time, where <i>s</i> is the size of the queue. However, it is possible to implement a queue in JavaScript that allows the operations enqueue and dequeue in <i>O(1)</i>.</p>",
      pause: true,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "3. Bidirectional Search",
      message:
        "<h3>3. Bidirectional Search</h3>" +
        "<p>Our third method to get the shortest path is a bidirectional search. Like a BFS, it is applicable to undirected graphs without edge weights. To perform a bidirectional search, we basically start one BFS from <strong>node1</strong> and one from <strong>node2</strong> at the same time. When both BFS meet, we've found the shortest path.</p>",
      pause: false,
    },
  ],
  ['CREATE_DIFF', { source: input4, target: input5 }],
  ['SET_CURSOR', 0],
  ['PAUSE', undefined],
  [
    'SHOW_TEXT',
    {
      toc: false,
      message:
        "<p>It is not the shortest algorithm, but it is still simple and easy to code from scratch if you know BFS. But what is the advantage over a plain BFS, which is much shorter? The answer is performance. If a BFS allows us to find a path of length <i>l</i> in a reasonable amount of time, a bidirectional search will allow us to find a path of length <i>2l</i>.</p>" +
        "<p>Performance in more detail: The bidirectional search ends after <i>d/2</i> levels because this is the center of the path. Both simultaneous BFS visit <i>g<sup>(d/2)</sup></i> nodes each, which is <i>2g<sup>(d/2)</sup></i> in total. This leads to <i>O(g<sup>(d/2)</sup>)</i> and therefore makes the bidirectional search faster than a BFS by a factor of <i>g<sup>(d/2)</sup></i>!</p>",
      pause: true,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "4. Dijkstra's Algorithm",
      message:
        "<h2>4. Dijkstra's Algorithm</h2>" +
        "<p>This algorithm might be the most famous one for finding the shortest path. Its advantage over a DFS, BFS, and bidirectional search is that you can use it in all graphs with positive edge weights. Don't try it on graphs that contain negative edge weights because termination is not guaranteed in this case.</p>",
      pause: true,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "Crash Course: Priority Queues",
      level: 2,
      message:
        "<h3>Crash Course: Priority Queues</h3>" +
        "<p>To understand Dijkstra's algorithm, it is essential to understand priority queues. A priority queue is an abstract data structure that allows the following operations:</p>" +
        "<ul>" +
        "<li><strong>isEmpty</strong>: checks if the priority queue contains any elements</li>" +
        "<li><strong>insert</strong>: inserts an element along with a priority value</li>" +
        "<li><strong>extractHighestPriority</strong>: returns the element with the highest priority and removes it from the priority queue</li>" +
        "</ul>" +
        "<p>What does priority mean? Mathematically, the priority must allow a partial order to be defined on the elements of the priority queue. In most cases, it is a simple integer <i>p</i> and the element with the highest priority is the element with the smallest (or largest) value for <i>p</i>. In our case, we need the priority queue to store all nodes in the graph along with their distance to our start node. So our <strong>extractHighestPriority</strong> operation will be called <strong>extractMin</strong>, which is a more descriptive name for retrieving a node with the minimum distance to the start node.</p>",
      pause: true,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "How does Dijkstra's algorithm work?",
      level: 2,
      message:
        "<h3>How does Dijkstra's algorithm work?</h3>" +
        "<p>Before we look at the code, let me shortly describe the algorithm so that you get an idea of how it works.</p>" +
        "<p>We start by initializing the shortest path from our start node to every other node in our graph. Initially, this will be infinity for every node other than the start node itself. The start node will be initialized with <i>0</i> because that is the distance to itself. We insert all nodes to our priority queue along with their previously initialized distance to our start node as a priority.</p>" +
        "<p>Now begins the actual work. Until the priority queue is not empty, we extract the node with the current shortest known distance to our start node. Let's call it <strong>currentNode</strong>. Then we loop over all neighbors of <strong>currentNode</strong>, and for each one, we check if reaching it through <strong>currentNode</strong> is shorter than the currently known shortest path to that neighbor. If so, we update the shortest distance to the neighbor and proceed. But see for yourself.</p>",
      pause: false,
    },
  ],
  ['REPLACE_ALL', input2],
  ['CREATE_DIFF', { source: input2, target: input6 }],
  ['SET_CURSOR', 0],
  ['PAUSE', undefined],
  [
    'SHOW_TEXT',
    {
      toc: false,
      message:
        "<p>We gave a callback function to the priority queue that has access to our <i>distances</i> map. This is used in the priority queue implementation to get the minimum distance. However, the implementation of the priority queue should not be discussed in this piece.</p>",
      pause: true,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "Performance",
      level: 2,
      message:
        "<h3>Performance</h3>" +
        "<p>The time complexity of this algorithm highly depends on the implementation of the priority queue. Let <i>n</i> be the number of nodes and <i>e</i> be the number of edges in the graph. If it is implemented by a simple array, Dijkstra's algorithm will run in <i>O(n<sup>2</sup>)</i>. However, the more common implementation uses a Fibonacci heap as the priority queue. In this case, the runtime is within <i>O(e + n log(n))</i>.</p>",
      pause: true,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "5. Bellman-Ford Algorithm",
      message:
        "<h2>5. Bellman-Ford Algorithm</h2>" +
        "<p>The last algorithm I am introducing in this story is the Bellman-Ford algorithm. In contrast to Dijkstra's algorithm, it can deal with negative edge weights. There is only one limitation: The graph is not supposed to contain negative cycles. A negative cycle is a cycle whose edges sum to a negative value. However, the algorithm is able to detect negative cycles and will therefore terminate — albeit without a shortest path.</p>" +
        "<p>The algorithm is very similar to Dijkstra's algorithm, but it does not use a priority queue. Instead, it repeatedly loops over all edges, updating the distances to the start node in a similar fashion to Dijkstra's algorithm. Let <i>n</i> again be the number of nodes in our graph. The Bellman-Ford algorithm loops exactly <i>n-1</i> times over all edges because a cycle-free path in a graph can never contain more edges than <i>n-1</i>.</p>" +
        "<p>After repeatedly looping over all edges, the algorithm loops over all edges once again. If one of the distances is still not optimal, it means that there must be a negative cycle in the graph.</p>",
      pause: false,
    },
  ],
  ['REPLACE_ALL', input2],
  ['CREATE_DIFF', { source: input2, target: input7 }],
  ['SET_CURSOR', 0],
  ['PAUSE', undefined],
  [
    'SHOW_TEXT',
    {
      title: "Performance",
      level: 2,
      message:
        "<h3>Performance</h3>" +
        "<p>The ability to deal with negative edge weights comes at a price. The runtime complexity of the Bellman-Ford algorithm is <i>O(n * e)</i>. Therefore, you should only use it if you really have negative edge weights.</p>",
      pause: true,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "Conclusion",
      message:
        "<h2>Conclusion</h2>" +
        "<p>We inspected some of the most important algorithms to get the shortest path in a graph, along with their advantages and disadvantages. Let's look at an overview to help you decide which algorithm to use in which situation:</p>" +
        '<p><img src="../assets/graph-algorithms-comparison.png" alt="table comparing shortest path algorithms"/></p>' +
        "<p>As you can see, which algorithm to use depends on a couple of properties of the graph as well as the runtime of the algorithm. However, another important factor is implementation time. If you are in a coding contest or coding interview, then implementation speed matters. In this case, you might want to make a trade-off between implementation speed and runtime complexity. All these observations lead to the following questions:</p>" +
        "<ul>" +
        "<li>Does the graph contain negative edge weights?</li>" +
        "<li>Does the graph contain positive edge weights <i>&gt; 1</i>?</li>" +
        "<li>Does the graph contain undirected cycles?</li>" +
        "<li>Is implementation speed more important than runtime?</li>" +
        "</ul>" +
        "<p>Based on these questions, you can determine the right algorithm to use. Here's a helpful decision tree:</p>" +
        '<p><img src="../assets/graph-algos-decision-tree.png" alt="decision tree for choosing the right shortest path algorithm"/></p>' +
        "<p>Please note that this piece does not cover all the existing algorithms to find the shortest path in a graph. It gives an overview of the most important ones as well as a recommendation of the best of these algorithms for your situation.</p>" +
        "<p>I hope I could give you a deeper understanding of this landscape so you can pick an algorithm wisely the next time you need it.</p>" +
        "<p>After repeatedly looping over all edges, the algorithm loops over all edges once again. If one of the distances is still not optimal, it means that there must be a negative cycle in the graph.</p>",
      pause: true,
    },
  ],
  [
    'SHOW_TEXT',
    {
      title: "References",
      message:
        "<h2>References</h2>" +
        "<ul>" +
        '<li><a href="https://medium.com/better-programming/basic-interview-data-structures-in-javascript-graphs-3f9118aeb078">Data Structures in JavaScript: Graphs</a></li>' +
        '<li><a href="https://en.wikipedia.org/wiki/Tree_(graph_theory)">Tree (graph theory)</a></li>' +
        '<li><a href="https://en.wikipedia.org/wiki/Polytree">Polytree</a></li>' +
        "</ul>",
      pause: false,
    },
  ],
];
