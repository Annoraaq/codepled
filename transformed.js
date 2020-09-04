var transformed = `if (typeof currentCommand === 'string') {
  const oldText = getText(ta);
  const newText = oldText.substr(0, cursor) + currentCommand + oldText.substr(cursor);
  cursor += currentCommand.length;
  setText(ta, newText, cursor);
} else if (currentCommand <= 0) {
  const oldText = getText(ta);
  const newText = oldText.substr(0, cursor) + oldText.substr(cursor + (currentCommand * (-1)));
  setText(ta, newText, cursor);
} else {
  cursor += currentCommand;
  setText(ta, getText(ta), cursor);
}`;
