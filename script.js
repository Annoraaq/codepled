(function () {
  const cursorText = '<span class="cursor"></span>';
  const dmp = new diff_match_patch();
  const diff = dmp.diff_main(input, transformed);
  const ta = document.querySelector("#codepled");
  const playButton = document.querySelector('.play');
  const slider = document.querySelector('.slider');
  const speedButton = document.querySelector('.speed');
  const commands = createCommands(diff);
  const SPEED = { 3: 10, 2: 50, 1: 100 };
  let speed = 1;

  speedButton.onclick = () => {
    speed = (speed + 1) % 4;
    if (speed == 0) speed = 1;
    const speedMeter = document.querySelector('.speedmeter');
    speedMeter.textContent = speed;

  }


  let trueText;
  let currentCommandIndex = 0;
  let isPlaying = false;
  let wasPlayingOnSliderMove = false;
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
      await sleep(SPEED[speed]);
    }
  }

  function forwardTo(targetIndex) {
    if (currentCommandIndex == 0) init();

    console.log('forward to', targetIndex)

    while (currentCommandIndex <= targetIndex) {
      console.log('currentCommandINdex', currentCommandIndex)
      processCommand(commands[currentCommandIndex]);
      setCurrentCommandIndex(currentCommandIndex + 1);
      if (currentCommandIndex >= commands.length) {
        stop();
        break;
      };
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
    });
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
