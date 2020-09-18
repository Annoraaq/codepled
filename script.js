(function () {
  const SPEED = { 3: 10, 2: 50, 1: 100 };
  const CMD_DELETE = -1;
  const CMD_INSERT = 1;
  const CMD_SKIP = 0;
  const CMD_SHOW_TEXT = 2;
  const CMD_HIGHLIGHT_LINES = 3;
  const cursorText = '<span class="cursor"></span>';
  const dmp = new diff_match_patch();
  const diff = dmp.diff_main(input, transformed);
  const ta = document.querySelector("#codepled");
  const playButton = document.querySelector('.play');
  const slider = document.querySelector('.slider');
  const speedButton = document.querySelector('.speed');
  const textbox = document.querySelector('.textbox-container');
  let highlightedLines = { start: -1, end: -2 };
  const commands = [...createCommands(diff), [CMD_HIGHLIGHT_LINES, { start: 3, end: 4 }], [2, `Some Text that is very very long. Lorem Ipsum dolor sit amet. Bla bla blaa asdih asdf
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  Some Text that is very very long. Lorem Ipsum dol
  bnsdf ahd asdh sdgh asd ahjg sajdfasd gkasdkf dsfgkjbnasd dfk zsjks sdf;vjkjawekjasdljnasdvkjabsdlfkj`]];

  let speed = 1;
  let trueText;
  let currentCommandIndex = 0;
  let isPlaying = false;
  let wasPlayingOnSliderMove = false;
  let cursor = 0;
  let isBlocked = false;
  let textContinue;

  initPlayButton(playButton);
  initSpeedButton(speedButton);
  initSlider(slider);
  initTextbox(textbox);
  init();

  function init() {
    cursor = 0;
    setText(ta, input, cursor);
  }

  async function play() {
    if (currentCommandIndex >= commands.length) {
      currentCommandIndex = 0;
    }
    if (currentCommandIndex == 0) {
      init();
    }
    isPlaying = true;

    while (currentCommandIndex < commands.length && isPlaying) {
      processCommand(commands[currentCommandIndex]);
      setCurrentCommandIndex(currentCommandIndex + 1);
      if (currentCommandIndex >= commands.length) stop();
      await sleep(SPEED[speed]);
    }
  }

  function forwardTo(targetIndex) {
    if (currentCommandIndex == 0) init();

    while (currentCommandIndex < targetIndex) {
      processCommand(commands[currentCommandIndex]);
      setCurrentCommandIndex(currentCommandIndex + 1);
      if (currentCommandIndex >= commands.length) {
        stop();
        break;
      };
    }
  }

  function processCommand([commandNo, payload]) {
    if (commandNo === CMD_INSERT) {
      const newText = trueText.substr(0, cursor) + payload + trueText.substr(cursor);
      cursor += payload.length;
      setText(ta, newText, cursor);
    } else if (commandNo === CMD_DELETE) {
      const newText = trueText.substr(0, cursor) + trueText.substr(cursor + payload);
      setText(ta, newText, cursor);
    } else if (commandNo === CMD_SKIP) {
      cursor += payload;
      setText(ta, trueText, cursor);
    } else if (commandNo === CMD_SHOW_TEXT) {
      isPlaying = false;
      const isLastCommand = currentCommandIndex == commands.length - 1;
      disableControls();
      showMessage(payload).then(() => {
        enableControls();
        if (!isLastCommand) {
          play();
        }
      })
    } else if (commandNo === CMD_HIGHLIGHT_LINES) {
      highlightedLines = payload;
      setText(ta, trueText, cursor);
    }
  }

  async function showMessage(message) {
    document.querySelector('.textbox-container').style.display = 'flex';
    document.querySelector('.textbox__content').innerHTML = message;
    return new Promise((resolve) => {
      textContinue = resolve;
    });
  }

  function stop() {
    isPlaying = false;
    playButton.innerHTML = '<i class="fas fa-play"></i>';
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
      const linesCount = (block.innerHTML.match(/\n/g) || []).length;
      setLines(linesCount);
      highlightLines(block);
    });
  }

  function highlightLines(block) {
    block.innerHTML = block.innerHTML.replace(
      /([ \S]*\n|[ \S]*$)/gm,
      match => `<div class="line">${match}</div>`
    );

    const options = [{ ...highlightedLines, color: '#004212' }];

    const lines = block.querySelectorAll('.line');
    for (let option of options) {
      for (let i = option.start; i <= option.end; i++) {
        lines[i - 1].style.backgroundColor = option.color;
      }
    }
  }

  function setLines(lineCount) {
    let innerStr = '';
    for (let i = 1; i <= lineCount; i++) {
      innerStr += i + '<br />';
    }
    const linesContainer = document.querySelector('.lines');
    if (linesContainer) {
      linesContainer.innerHTML = innerStr;
    }
  }

  function htmlEncode(value) {
    var div = document.createElement('div');
    var text = document.createTextNode(value);
    div.appendChild(text);
    return div.innerHTML;
  }

  function initSlider(slider) {
    slider.setAttribute('max', commands.length - 1)
    slider.value = 0;
    slider.onchange = function (e) {
      if (this.value < currentCommandIndex) {
        currentCommandIndex = 0;
      }

      forwardTo(this.value);
      if (wasPlayingOnSliderMove) {
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        play();
      }
      console.log(this.value, commands.length)
    }
    slider.oninput = function (e) {
      if (isPlaying || wasPlayingOnSliderMove) {
        wasPlayingOnSliderMove = true;
      } else {
        wasPlayingOnSliderMove = false;
      }
      playButton.innerHTML = '<i class="fas fa-play"></i>';
      isPlaying = false;
    }
  }

  function initPlayButton(playButton) {
    playButton.onclick = () => {
      if (isBlocked) return;
      if (!isPlaying) {
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        play();
      } else {
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
        wasPlayingOnSliderMove = false;
      }
    }
  }

  function initSpeedButton(speedButton) {
    if (isBlocked) return;
    speedButton.onclick = () => {
      speed = (speed + 1) % 4;
      if (speed == 0) speed = 1;
      const speedMeter = document.querySelector('.speedmeter');
      speedMeter.textContent = speed;
    }
  }

  function createCommands(diff) {
    const commands = [];
    diff.forEach(d => {
      if (d[0] === -1) {
        for (let i = 0; i < d[1].length; i++) {
          commands.push([CMD_DELETE, 1]);
        }
      } else if (d[0] === 0) {
        commands.push([CMD_SKIP, d[1].length]);
      } else {
        for (let i = 0; i < d[1].length; i++) {
          commands.push([CMD_INSERT, d[1][i]]);
        }
      }
    });
    return commands;
  }

  function initTextbox(textbox) {
    textbox.style.display = 'none';

    textbox.querySelector('i').onclick = () => {
      if (textContinue) {
        textbox.style.display = 'none';
        textContinue();
      }
    };
  }

  function disableControls() {
    isBlocked = true;
    slider.disabled = true;

    document.querySelector('.slider-container').classList.add('disabled');
  }

  function enableControls() {
    isBlocked = false;
    slider.disabled = false;
    document.querySelector('.slider-container').classList.remove('disabled');
  }
})();
