const cursorText = '<span class="cursor"></span>';

(async () => {

  let input = `const cursorText = '<span class="cursor"></span>';`;

  let transformed = `const cursorTextNew = '<span class="cursor"></span>';
console.log('hello');`;

  var dmp = new diff_match_patch();

  const diff = dmp.diff_main(input, transformed);
  let commands = [];
  console.log(diff);
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

  console.log(commands);

  let cursor = 0;
  let trueText = input;

  const ta = document.querySelector("#codepled");

  ta.innerHTML = htmlEncode(input);

  setText(ta, trueText, cursor);

  for (let i = 0; i < commands.length; i++) {
    await sleep(100);
    const currentCommand = commands[i];
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
  }

  function setText(ctrl, text, cursor) {
    ctrl.innerHTML = htmlEncode(text.substr(0, cursor)) + cursorText + htmlEncode(text.substr(cursor));
    trueText = text;
    highlight();
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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


})();

