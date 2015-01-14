
require.config({
  baseUrl: '',
  paths: {
    hex2dec: 'hex2dec',
    jquery: '../bower_components/jquery/dist/jquery.min.js',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min.js'
  }
});

function App($){
  var frames = {
    f1: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f2: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f3: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f4: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f5: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f6: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f7: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f8: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f9: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f10: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f11: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f12: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f13: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f14: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f15: {l1: '000', l2: '000', l3: '000', btns_on: []},
    f16: {l1: '000', l2: '000', l3: '000', btns_on: []}
  };

  var playing_animation = false;

  function setFrameLayers(callback) {
    var frame = currentFrame(),
        layers = {},
        $active_btns = $('#layers .btn-success'),
        btns_to_parse = $active_btns.length;

    frame.btns_on = [];

    if (btns_to_parse === 0 && callback) {
      callback();
    }

    $active_btns.each(function(){
      var $this = $(this),
          layer = $this.attr('id').split('-')[0],
          hVal = $this.attr('id').split('-')[1];

      if (!layers.hasOwnProperty('l'+layer)) {
        layers['l'+layer] = [];
      }

      layers['l'+layer].push(hVal);

      frame.btns_on.push($this);

      btns_to_parse--;
      if (btns_to_parse === 0) {
        for (var key in layers) {
          frame[key] = sumHex(layers[key]);
        }

        for (key in frame) {
          if (typeof frame[key] == 'string') {
            var layer_val = frame[key];
            while (layer_val.length < 3) {
              layer_val = '0' + layer_val;
            }
            frame[key] = layer_val;
          }
        }

        if (callback) {
          callback();
        }
      }
    });
  }

  function loadFrame() {
    var frame = currentFrame();
    swapClass($('#layers .btn-success'), 'btn-success', 'btn-default');
    for (var i=0; i < frame.btns_on.length; i++) {
      swapClass(frame.btns_on[i], 'btn-default', 'btn-success');
    }
    lightCube();
  }

  function lightCube() {
    var frame = currentFrame();
    $('.cube .success').removeClass('success');
    for (var i=0; i < frame.btns_on.length; i++) {
      var $btn = frame.btns_on[i];
          layer = $btn.attr('id').split('-')[0],
          pixel = $btn.text();
      $('.cube .' + layer + '-' + pixel).toggleClass('success');
    }
  }

  function currentFrame() {
    return frames['f' + $('.frame-btn.btn-info').text()];
  }

  function generateCode() {
    var _args = arguments;
    setFrameLayers(function(){
      var lines = [];
      for (var key in frames) {
        var frame = frames[key],
            layers = [];
        for (var lKey in frame) {
          if (typeof frame[lKey] == 'string') {
            layers.push('0x' + frame[lKey]);
          }
        }
        lines.push(layers.join(', '));
      }
      var code = ('{' + lines.join(', 0x02ff},\n{') + ', 0x02ff},');

      if (_args.length > 0 && typeof _args[0] == 'function') {
        _args[0](code);
      }
    });
  }

  function reset($target) {
    for (var key in frames) {
      var frame = frames[key];
      frame.btns_on = [];
      for (var lKey in frame) {
        if (typeof frame[lKey] == 'string') {
          frame[lKey] = '000';
        }
      }
    }
    var $frame_btns = $('#frame-buttons button');
    swapClass($frame_btns, 'btn-info', 'btn-default');
    swapClass($frame_btns.first(), 'btn-default', 'btn-info');
    generateCode(function(code){
      if ($target) {
        $target.text(code);
      }
      lightCube();
    });
  }

  function toggleButtons($buttons, c1, c2) {
    $buttons
        .toggleClass(c1 || 'btn-success')
        .toggleClass(c2 || 'btn-default');
  }

  function swapClass($el, c1, c2) {
    if ($el) {
      $el
        .removeClass(c1)
        .addClass(c2)
    }
  }

  function isPlaying() {
    return playing_animation;
  }

  function play() {
    if (!isPlaying()) {
      playing_animation = true;

      disableFrameButtons();
      disableLayerButtons();

      var next_frame = 1,
          frame_buttons = [];

      var mylist = $('#frame-buttons');
      var listitems = mylist.find('.frame-btn').get();
      listitems.sort(function(a, b) {
        return parseInt($(a).text()) - parseInt($(b).text());
      });

      frame_buttons = listitems;

      function playFrame() {
        if (isPlaying()) {
          if (next_frame > frame_buttons.length) {
            next_frame = 1;
          }

          $(frame_buttons[next_frame-1]).trigger('click');
          next_frame++;
          setTimeout(playFrame, 200);
        } else {
          $(frame_buttons[0]).trigger('click');
          enableFrameButtons();
          enableLayerButtons();
        }
      }

      playFrame();
    }
  }

  function stop() {
    if (isPlaying()) {
      playing_animation = false;
    }
  }

  function disableLayerButtons(){
    $('#layers button').attr('disabled', true);
  }

  function enableLayerButtons(){
    $('#layers button').attr('disabled', false);
  }

  function disableFrameButtons(){
    $('#frame-buttons button').attr('disabled', true);
  }

  function enableFrameButtons(){
    $('#frame-buttons button').attr('disabled', false);
  }

  return {
    toggleButtons: toggleButtons,
    generateCode: generateCode,
    setFrameLayers: setFrameLayers,
    currentFrame: currentFrame,
    loadFrame: loadFrame,
    reset: reset,
    lightCube: lightCube,
    swapClass: swapClass,
    isPlaying: isPlaying,
    play: play,
    stop: stop
  };
}

var app;

require(['hex2dec']);
require(['../bower_components/jquery/dist/jquery.min'], function($){
  require(['../bower_components/bootstrap/dist/js/bootstrap.min']);

  app = new App($);

  $(document).on('ready', function(){
    $('#clear').on('click', function(){
      app.swapClass($('#layers .btn-success'), 'btn-success', 'btn-default');
      app.reset($('#output'));
    });

    $('#layers').on('click', 'button', function(){
      app.toggleButtons($(this));
      app.generateCode(function(code){
        $('#output').text(code);
        app.lightCube();
      });
    });

    $('.frame-btn').on('click', function(){
      app.swapClass($('.frame-btn'), 'btn-info', 'btn-default');
      app.swapClass($(this), 'btn-default', 'btn-info');
      app.loadFrame();
    });

    $('#play-preview-btn').on('click', app.play);
    $('#stop-preview-btn').on('click', app.stop);

    app.reset($('#output'));
  });

});