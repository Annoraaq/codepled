const cursorText = '<span class="cursor"></span>';

let input = `const cursorText = '<span class="cursor"></span>';`;

let transformed = `const cursorTextNew = '<span class="cursor"></span>';
console.log('hello');`;


let trueText;
let dmp = new diff_match_patch();
let diff;
let currentCommandIndex = 0;
let isPlaying = false;
let cursor = 0;

document.querySelector('.play').onclick = () => {
  if (!isPlaying) {
    document.querySelector('.play').textContent = '⏸';
    play();
  } else {
    document.querySelector('.play').textContent = '▶';
    isPlaying = false;
  }
}

const ta = document.querySelector("#codepled");

init(input, transformed);


function init() {
  trueText = input;
  diff = dmp.diff_main(input, transformed);
  ta.innerHTML = htmlEncode(input);
  cursor = 0;

  highlight();
}

const play = async () => {
  if (currentCommandIndex == 0) {
    init();
  }
  isPlaying = true;

  let commands = [];

  diff.forEach(d => {
    if (d[0] === -1) {
      for (let i = 0; i < d[1].length; i++) {
        commands.push(-1);
      }
    } else if (d[0] === 0) {
      commands.push(d[1].length);
    } else {
      for (let i = 0; i < d[1].length; i++) {
        commands.push(d[1][i]);
      }
    }
  })

  setText(ta, trueText, cursor);

  while (currentCommandIndex < commands.length && isPlaying) {

    await sleep(100);
    const currentCommand = commands[currentCommandIndex];
    setText(ta, trueText, cursor);

    if (typeof currentCommand === 'string') {
      const oldText = trueText
      const newText = oldText.substr(0, cursor) + currentCommand + oldText.substr(cursor);
      cursor += currentCommand.length;
      setText(ta, newText, cursor);
    } else if (currentCommand <= 0) {
      const oldText = trueText;
      const newText = oldText.substr(0, cursor) + oldText.substr(cursor + (currentCommand * (-1)));
      setText(ta, newText, cursor);
    } else {
      cursor += currentCommand;
      setText(ta, trueText, cursor);
    }
    currentCommandIndex++;
  }

  if (currentCommandIndex >= commands.length) {
    currentCommandIndex = 0;
    document.querySelector('.play').textContent = '▶';
    isPlaying = false;
  }

  function setText(ctrl, text, cursor) {
    ctrl.innerHTML = htmlEncode(text.substr(0, cursor)) + cursorText + htmlEncode(text.substr(cursor));
    trueText = text;
    highlight();
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

function setCursor(ctrl, cursorPos) {
  ctrl.innerHTML = htmlEncode(trueText.substr(0, cursor)) + cursorText + htmlEncode(trueText.substr(cursor));
}

function highlight() {
  hljs.configure({ useBR: false });

  document.querySelectorAll('#codepled').forEach((block) => {
    hljs.highlightBlock(block);
  });
}

function htmlEncode(value) {
  var div = document.createElement('div');
  var text = document.createTextNode(value);
  div.appendChild(text);
  return div.innerHTML;
}
