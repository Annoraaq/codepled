export const template = `<div class="codepled">
  <div class="container">
    <header class="header">
      <div class="header__row">
        <div class="left"><a class="logo" href="index.html"><img src="../assets/codepled_logo.png" /></a>
          <div class="title">
            <h1><a href="index.html"></a></h1>
          </div>
        </div>
        <nav>
          <ul>
            <li><a href="https://www.patreon.com/bePatron?u=45036169" class="patreon-button"><i
                  class="fab fa-patreon"></i> Become a Patron!</a></li>
            <li><a href="datenschutz.html">Datenschutz</a></li>
            <li><a href="impressum.html">Impressum</a></li>
          </ul>
        </nav>
      </div>
      <div class="header__row responsive">
        <div class="title">
          <h1><a href="index.html"><%= htmlWebpackPlugin.options.title %></a></h1>
        </div>
      </div>
    </header>
    <div class="content">
      <div class="toc-container">
        <div class="toc__open"><i class="toc__open--small fas fa-list"></i> <i class="fas fa-angle-right"></i></div>
        <div class="table-of-contents">
          <header class="toc__title">Table of Contents</header>
          <div class="toc__content">
            <ul class="toc__bookmarks"></ul>
            <div class="toc__close"><i class="fas fa-angle-left"></i></div>
          </div>
        </div>
      </div>
      <div class="main-content-container">
        <div class="textbox-container">
          <div class="textbox__content"></div>
        </div>
        <div class="code-container">
          <div class="inner-container">
            <div class="lines"></div>
            <div class="codepled-editor" class="language-js"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="slider-container"><button class="play"><i class="fas fa-play"></i></button> <button
        class="play speed"><span class="speedmeter">1</span><i class="fas fa-tachometer-alt"></i></button>
      <div class="sliderbox"><input type="range" min="0" max="99" value="50" class="slider" /></div><button
        class="play fullscreen"><i class="fas fa-expand"></i></button>
    </div>
  </div><button class="next-button">Paused <span class="small">click here or press [SPACE] to continue</span></button>
</div>
`;
