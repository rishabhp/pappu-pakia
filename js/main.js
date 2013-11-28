
mit.main = function() {

  // rAF
  window.requestAnimationFrame = function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function(f) {
        window.setTimeout(f,1e3/60);
      }
  }();

  // cAF
  window.cancelAnimationFrame = function() {
    return window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      function(f) {
        window.setTimeout(f,1e3/60);
      }
  }();

  var config = mit.config = {

  };

  var ui = mit.ui = {
    body: $('body'),
    score_board: $('#score_board'),
    last_score: $('#last_score'),
    high_score: $('#high_score'),
    start_screen: $('#start_screen'),
    start_game: $('#start_game'),
    tweet: $('#tweet'),
    fb: $('#fb'),
    fps_count: $('#fps_count'),
    invincible_timer: $('#invincible_timer'),
    invincible_loader: $('#invincible_loader')
  };

  /*
  Basic Canvas Inits
  */

  // Main Canvas

  var canvas = document.querySelector('#game_main');
  var ctx = canvas.getContext('2d');

  var W = canvas.width = ui.body.width();
  var H = canvas.height = ui.body.height();

  // Width x Height capped to 1000 x 500
  if (canvas.width > 1000) {
    W = canvas.width = 1000;
  }
  if (canvas.height > 500) {
    H = canvas.height = 500;
  }

  // Resizing Width/Height
  if (canvas.height < 500) {
    canvas.width = canvas.height * 1000/500;
  }
  if (canvas.width < 1000) {
    canvas.height = canvas.width * 500/1000;
  }

  // BG Canvas
  var bg_canvas = document.querySelector('#game_bg');
  var bg_ctx = bg_canvas.getContext('2d');

  bg_canvas.width = canvas.width;
  bg_canvas.height = canvas.height;

  var music = document.getElementById("start");
  music.volume = 0.2;
  
  var isMute = false;

  // sound volume can not be set in iOS, hence this work-around
  var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );

  // Mute the game if button is clicked
  $("#mute").click(function() {
    if(isMute == false) {
      $(this).css("backgroundPosition", "0px -40px");
      music.volume = 0;
      if(iOS) {
        music.pause();
      }
      isMute = true;
    }

    else {
      $(this).css("backgroundPosition", "0px 0px");
      music.volume = 0.2;
      if(iOS) {
        music.play();
      }
      isMute = false;
    }

    return false;
  });

  /*
    Game Start Screen and Lolz
  */
  mit.game_started = 0;
  mit.game_over = 0;
  mit.start_btn_clicked = 0;

  ui.start_screen.css('width', canvas.width + 'px');
  ui.start_screen.css('height', canvas.height + 'px');

  // Start Button
  var startGame = function() {
    // Play the awesome music! Really awesome
    music.play();
    flap.pause();

    // Hide the Start Screen
    ui.start_screen.fadeOut();

    // Start btn has been clicked
    // Game hasnt started. Game will
    // start on flight.
    mit.start_btn_clicked = 1;
    mit.game_started = 0;

    mit.Backgrounds.common_bg_speed = 1;
    mit.Backgrounds.resetAllSpeed();

    // Reset all accelerations and make
    // pappu stationary
    mit.Pappu.drawStatic(ctx);
    mit.ax = 0; mit.ay = 0;
    mit.vx = 0; mit.vy = 0;

    // if game over due to hitting someone
    // he'll rotate a lot. so need ta reset
    // on restart
    mit.Pappu.rotate_angle = 0;

    // reset score
    mit.score = 0;

    // Nuke all forks
    mit.ForkUtils.forks = [];
    // Nuke all branches
    mit.BranchUtils.branches = [];
    // Nuke all collectibles
    mit.CollectibleUtils.collecs = [];
    // Nuke all pakias and cur_pakia
    mit.PakiaUtils.pakias = [];
    mit.PakiaUtils.cur_pakia = false;
  };

  ui.start_game.on('mousedown', function() {
    startGame();

    return false;
  });



  // startGame();

  // Share links
  var tweet = document.getElementById("tweet");
  tweet.href='http://twitter.com/share?url=http://khele.in/pappu-pakia/&text=I am playing Pappu Pakia, a cute HTML5 game on khele.in!&count=horiztonal&via=_rishabhp&related=solitarydesigns';

  var facebook = document.getElementById("fb");
  facebook.href='http://facebook.com/sharer.php?s=100&p[url]=http://khele.in/pappu-pakia/&p[title]=I am playing Pappu Pakia, a cute HTML5 game on khele.in!';


  // Score Board
  mit.score = 0;
  try {

    mit.highScore = JSON.parse(localStorage.getItem("highScore"));
    if (mit.highScore)
      ui.high_score.text("High Score: "+ mit.highScore);

  } catch (e) {}

  ui.score_board.css('width', canvas.width + 'px');
  ui.score_board.css('height', canvas.height + 'px');


  // Set Canvas Width/Height in Config
  mit.config.canvas_width = mit.W = W;
  mit.config.canvas_height = mit.H = H;

  // Gravity
  mit.gravity = 0.7;

  // Velocity x,y
  mit.vx = 0;
  mit.vy = 0;

  // Velocity cap on either sides of the
  // number system.
  // 
  // You can console.log velocities in drawing methods
  // and from there decide what to set as the cap.
  mit.v_cap = 6.5;

  // Accelaration x,y
  mit.ax = 0;
  mit.ay = 0;

  // Flying up ?
  mit.flying_up = 0;

  mit.ascend = function() {
    if (!mit.start_btn_clicked)
      return;

    if (!mit.game_started) {
      mit.game_started = 1;
      mit.game_over = 0;
    }

    mit.ay = -1.5;
    mit.flying_up = 1;
  };

  mit.descend = function() {
    if (!mit.start_btn_clicked)
      return;

    mit.ay = 0;
    mit.flying_up = 0;
  };

  // Game play on mouse clicks too!
  window.addEventListener('mousedown', function(e) {
    mit.ascend();
  }, false);

  window.addEventListener('mouseup', function(e) {
    mit.descend();
  }, false);


  // Game play on touch too!
  window.addEventListener('touchstart', function(e) {
    mit.ascend();
  }, false);

  window.addEventListener('touchend', function(e) {
    mit.descend();
  }, false);


  // ... and keyzz...
  window.addEventListener('keydown', function(e) {

    // Up
    if (e.keyCode === 38) {
      mit.ascend();

      e.preventDefault();
    }
    // Down
    if (e.keyCode === 40) {
      e.preventDefault();
    }

    // Space || Enter
    if (e.keyCode === 32 || e.keyCode === 13) {
      startGame();
      
      e.preventDefault();
    }

  }, false);

  window.addEventListener('keyup', function(e) {

    if (e.keyCode === 38) {
      mit.descend();

      e.preventDefault();
    }
  }, false);


  /*
    Performing some game over tasks
  */
  mit.gameOver = function() {
    ui.start_screen.fadeIn();

    // High Score
    if (mit.score > mit.highScore) {
      mit.highScore = parseInt(mit.score);
      localStorage.setItem("highScore", JSON.stringify(parseInt(mit.score)));

      ui.high_score.text("High Score: "+ mit.highScore);
    }

    // Show last_score
    ui.last_score.text("Last Score: " + parseInt(mit.score));


    ui.start_game.html('re-start');
    ui.tweet.html('tweet score');
    ui.fb.html('post on fb');

    mit.descend();

    // Stop background
    mit.Backgrounds.common_bg_speed = 0;
    mit.Backgrounds.ground_bg_move_speed = 0;
    mit.Backgrounds.fps = 0;

    mit.game_over = 1;
    mit.start_btn_clicked = 0;

    // Pappu if invincible will be no morez
    mit.Pappu.undoInvincible();

    // Nuke all clones
    mit.Pappu.clones.length = 0;

    // Share
    var tweet = document.getElementById("tweet");
    tweet.href='http://twitter.com/share?url=http://khele.in/pappu-pakia/&text=I just scored ' +Math.floor(mit.score)+ ' points in Pappu Pakia!&count=horiztonal&via=_rishabhp&related=solitarydesigns';
  
    var facebook = document.getElementById("fb");
    facebook.href='http://facebook.com/sharer.php?s=100&p[url]=http://khele.in/pappu-pakia/&p[title]=I just scored ' +Math.floor(mit.score)+ ' points in the Pappu Pakia!';

  };

  mit.last_time = new Date();
  setInterval(function() {
    mit.ui.fps_count.html(mit.fps.toFixed(0) + ' FPS');
  }, 1000);


  // Initializations
  mit.Backgrounds.init(ctx);
  mit.ForkUtils.init();
  mit.BranchUtils.init();
  mit.CollectibleUtils.init();
  mit.Pappu.init();
  mit.PakiaUtils.init();


  (function renderGame() {
    window.requestAnimationFrame(renderGame);

    // Draw Backgrounds on BG Canvas
    mit.Backgrounds.draw(bg_ctx);

    ctx.clearRect(0, 0, W, H);

    // Draw Digs (holds forks)
    // I am fine without Digs, but Kushagra
    // just WANTS me to do this extra work :/
    // mit.ForkUtils.drawDigs(ctx);

    // Draw Grass on Main Canvas
    // mit.Backgrounds.drawGrass(ctx);

    if (mit.flying_up || !mit.game_started)
      mit.Pappu.updateFlyFrameCount();
    else
      mit.Pappu.updateFlyFrameCount(0);


    // Game over on reaching any boundary
    if (mit.Pappu.hasReachedBoundary(W, H)) {
      if (mit.game_over)
        return;

      // Performing some game over tasks
      mit.gameOver();
      return;
    }

    //mit.ForkUtils.draw(ctx);
    //mit.BranchUtils.draw(ctx);

    //mit.ForkUtils.checkCollision();

    // Send over Pakias (Enemies)
    // mit.PakiaUtils.render(ctx);

    // Collectibles
    // mit.CollectibleUtils.draw(ctx);

    // mit.Pappu.createClones(3);

    if (mit.game_started) {

      // Drawin stuff
      mit.ForkUtils.draw(ctx);
      mit.BranchUtils.draw(ctx);
      mit.CollectibleUtils.draw(ctx);
      mit.Pappu.drawClones(ctx);

      // Check Collisions with pappu
      if (!mit.Pappu.invincible) {
        mit.ForkUtils.checkCollision();
        mit.BranchUtils.checkCollision();
        mit.PakiaUtils.checkCollision();
      }
      mit.CollectibleUtils.checkCollision();
      mit.Pappu.checkCloneCollision();

      // Send over Pakias (Enemies)
      if (mit.score > 199)
        mit.PakiaUtils.render(ctx);

      // Update score
      if (!mit.game_over) {
        mit.score = mit.score += 0.1;
        ui.score_board.text(parseInt(mit.score));
      }

      // Acceleration + Gravity
      // mit.ay = mit.ay + mit.gravity;
      
      // Velocity
      if (!mit.game_over) {
        if (
          (mit.vy < mit.v_cap && mit.ay+mit.gravity > 0) ||
          (mit.vy > -mit.v_cap && mit.ay+mit.gravity < 0)
          ) {

          // console.log(mit.ay);
          mit.vy += mit.ay;
          mit.vy += mit.gravity;
        }

        // console.log(vy, ay)

        mit.Pappu.x += mit.vx;
        mit.Pappu.y += mit.vy;

        if (mit.vy > mit.v_cap) {
          mit.vy = mit.v_cap;
        }
      }
      else {
        // on game over, he's gravity is unstoppable
        mit.vy += mit.gravity;
        mit.Pappu.y += mit.vy;
      }
    
      mit.Pappu.draw(ctx);
    }
    else {
      mit.Pappu.drawStatic(ctx);
    }

    // Calculate FPS
    mit.cur_time = new Date;
    mit.fps = 1e3 / (mit.cur_time - mit.last_time);
    mit.last_time = mit.cur_time;

    return;
  }());

};