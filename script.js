(function () {
  const cursorText = '<span class="cursor"></span>';
  const dmp = new diff_match_patch();
  const diff = dmp.diff_main(input, transformed);
  const ta = document.querySelector("#codepled");
  const playButton = document.querySelector('.play');
  const slider = document.querySelector('.slider');
  const speedButton = document.querySelector('.speed');
  const commands = [...createCommands(diff), [2, 'Some Text']];
  const SPEED = { 3: 10, 2: 50, 1: 100 };
  let speed = 1;
  let trueText;
  let currentCommandIndex = 0;
  let isPlaying = false;
  let wasPlayingOnSliderMove = false;
  let cursor = 0;
  let isBlocked = false;

  initPlayButton(playButton);
  initSpeedButton(speedButton);
  initSlider(slider);
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
      console.log('enter the loop')
      processCommand(commands[currentCommandIndex]);
      setCurrentCommandIndex(currentCommandIndex + 1);
      if (currentCommandIndex >= commands.length) {
        stop();
        break;
      };
    }
  }

  function processCommand([commandNo, payload]) {
    if (commandNo === 1) {
      const newText = trueText.substr(0, cursor) + payload + trueText.substr(cursor);
      cursor += payload.length;
      setText(ta, newText, cursor);
    } else if (commandNo === -1) {
      const newText = trueText.substr(0, cursor) + trueText.substr(cursor + payload);
      setText(ta, newText, cursor);
    } else if (commandNo === 0) {
      cursor += payload;
      setText(ta, trueText, cursor);
    } else if (commandNo === 2) {
      isPlaying = false;
      const isLastCommand = currentCommandIndex == commands.length - 1;
      isBlocked = true;
      slider.disabled = true;
      showMessage(payload).then(() => {
        isBlocked = false;
        slider.disabled = false;
        if (!isLastCommand) {
          play();
        }
      })
    }
  }

  async function showMessage(message) {
    console.log('message')
    return new Promise((resolve, reject) => {
      setTimeout(() => { console.log('resolved'); resolve() }, 5000);
    });
  }

  function stop() {
    isPlaying = false;
    // setCurrentCommandIndex(0);
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
          commands.push([-1, 1]);
        }
      } else if (d[0] === 0) {
        commands.push([0, d[1].length]);
      } else {
        for (let i = 0; i < d[1].length; i++) {
          commands.push([1, d[1][i]]);
        }
      }
    });
    return commands;
  }
})();
