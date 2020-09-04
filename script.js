(function () {
  const cursorText = '<span class="cursor"></span>';
  const dmp = new diff_match_patch();
  const diff = dmp.diff_main(input, transformed);
  const ta = document.querySelector("#codepled");
  const playButton = document.querySelector('.play');
  const slider = document.querySelector('.slider');
  const commands = createCommands(diff);

  let trueText;
  let currentCommandIndex = 0;
  let isPlaying = false;
  let cursor = 0;

  initPlayButton(playButton);
  initSlider(slider);
  init();

  function init() {
    cursor = 0;
    setText(ta, input, cursor);
  }

  async function play() {
    if (currentCommandIndex == 0) {
      init();
    }
    isPlaying = true;

    while (currentCommandIndex < commands.length && isPlaying) {
      processCommand(commands[currentCommandIndex]);
      setCurrentCommandIndex(currentCommandIndex + 1);
      if (currentCommandIndex >= commands.length) stop();
      await sleep(100);
    }
  }

  function forwardTo(targetIndex) {
    if (currentCommandIndex == 0) init();

    while (currentCommandIndex <= targetIndex) {
      processCommand(commands[currentCommandIndex]);
      setCurrentCommandIndex(currentCommandIndex + 1);
      if (currentCommandIndex >= commands.length) stop();
    }
  }

  function processCommand(currentCommand) {
    if (typeof currentCommand === 'string') {
      const newText = trueText.substr(0, cursor) + currentCommand + trueText.substr(cursor);
      cursor += currentCommand.length;
      setText(ta, newText, cursor);
    } else if (currentCommand <= 0) {
      const newText = trueText.substr(0, cursor) + trueText.substr(cursor + (currentCommand * (-1)));
      setText(ta, newText, cursor);
    } else {
      cursor += currentCommand;
      setText(ta, trueText, cursor);
    }
  }

  function stop() {
    isPlaying = false;
    setCurrentCommandIndex(0);
    playButton.textContent = '▶';
  }

  function setCurrentCommandIndex(newIndex) {
    currentCommandIndex = newIndex;
    slider.value = newIndex;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function setText(ctrl, text, cursor) {
    ctrl.innerHTML = htmlEncode(text.substr(0, cursor)) + cursorText + htmlEncode(text.substr(cursor));
    trueText = text;
    highlight();
  }

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

  function initSlider(slider) {
    slider.setAttribute('max', commands.length)
    slider.value = 0;
    slider.oninput = function (e) {
      // currentCommandIndex = this.value;
      if (this.value < currentCommandIndex) {
        currentCommandIndex = 0;
      }
      forwardTo(this.value);
      console.log(this.value)
    }
  }

  function initPlayButton(playButton) {
    playButton.onclick = () => {
      if (!isPlaying) {
        playButton.textContent = '⏸';
        play();
      } else {
        playButton.textContent = '▶';
        isPlaying = false;
      }
    }
  }

  function createCommands(diff) {
    const commands = [];
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
    });
    return commands;
  }
})();
