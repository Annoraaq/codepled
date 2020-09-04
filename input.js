var input = `if (typeof currentCommand === 'string') {
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
}`;
