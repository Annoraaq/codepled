(async () => {

  let input = `Hello I am a sentence.`;

  let transformed = `I am no sentence at all.`;

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

  const ta = document.querySelector("textarea");

  setCaretPosition(ta, cursor);

  for (let i = 0; i < commands.length; i++) {
    await sleep(100);
    const currentCommand = commands[i];
    setCaretPosition(ta, cursor);

    if (typeof currentCommand === 'string') {

      ta.value = ta.value.substr(0, cursor) + currentCommand + ta.value.substr(cursor);
      cursor += currentCommand.length;
      setCaretPosition(ta, cursor);
    } else if (currentCommand <= 0) {
      const oldVal = ta.value;
      ta.value = oldVal.substr(0, cursor) + oldVal.substr(cursor + (currentCommand * (-1)));
      setCaretPosition(ta, cursor);
    } else {
      cursor += currentCommand;
      setCaretPosition(ta, cursor);
    }
  }


})();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function doGetCaretPosition(ctrl) {
  var CaretPos = 0;   // IE Support
  if (document.selection) {
    ctrl.focus();
    var Sel = document.selection.createRange();
    Sel.moveStart('character', -ctrl.value.length);
    CaretPos = Sel.text.length;
  }
  // Firefox support
  else if (ctrl.selectionStart || ctrl.selectionStart == '0')
    CaretPos = ctrl.selectionStart;
  return (CaretPos);
}
function setCaretPosition(ctrl, pos) {
  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  }
  else if (ctrl.createTextRange) {
    var range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}
