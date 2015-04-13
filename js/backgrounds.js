(function() {

  mit.Backgrounds = {

    // Speeds and Velocities of Backgrounds
    common_bg_speed: 1,

    cloud_bg_move_speed: 0,
    cloud_bg_vx: 0,

    backtree_bg_move_speed: 0,
    backtree_bg_vx: 0,

    fronttree_bg_move_speed: 0,
    fronttree_bg_vx: 0,

    ground_bg_move_speed: 0,
    ground_bg_vx: 0,

    combined_bg_move_speed: 0,
    combined_bg_vx: 0,

    log_x: 40,
    log_y: 0,

    sky_gradient: {},

    first_speed_inc: 0,
    second_speed_inc: 0,
    third_speed_inc: 0,

    init: function(ctx) {
      // Sky Gradient
      this.sky_gradient = ctx.createLinearGradient(0, 0, 0, mit.H);
      this.sky_gradient.addColorStop(0, '#06c4f4');
      this.sky_gradient.addColorStop(1, '#7bd4f6');


      // Clouds
      // this.cloud_img = new Image();
      // this.cloud_img.src = 'img/clouds.png';
      this.cloud_img = mit.image.clouds;

      this.cloud_img.width = mit.W;
      this.cloud_img.height = mit.H;


      // Back Trees
      // this.backtree_img = new Image();
      // this.backtree_img.src = 'img/back_trees.png';
      this.backtree_img = mit.image.backtrees;

      this.backtree_img.width = mit.W;
      this.backtree_img.height = mit.H;


      // Front Trees
      // this.fronttree_img = new Image();
      // this.fronttree_img.src = 'img/front_trees.png';
      this.fronttree_img = mit.image.fronttrees;

      this.fronttree_img.width = mit.W;
      this.fronttree_img.height = mit.H;


      // Ground
      // this.ground_img = new Image();
      // this.ground_img.src = 'img/ground.png';
      this.ground_img = mit.image.ground;

      this.ground_img.width = mit.W;
      this.ground_img.height = mit.H;


      // Grass
      // this.grass_img = new Image();
      // this.grass_img.src = 'img/grass.png';
      this.grass_img = mit.image.grass;

      this.grass_img.width = mit.W;
      this.grass_img.height = mit.H;


      // Log on which pappu sits
      // this.log_img = new Image();
      // this.log_img.src = 'img/log.png';
      this.log_img = mit.image.log;


      // Combined BG Image
      // this.combined_bg_img = new Image();
      // this.combined_bg_img.src = 'img/bg_combined.png';
      this.combined_bg_img = mit.image.bg_combined;

      // Reset all speed
      this.resetAllSpeed();
    },

    resetAllSpeed: function() {
        this.cloud_bg_move_speed = 2;
        this.backtree_bg_move_speed = 3;
        this.fronttree_bg_move_speed = 5;
        this.ground_bg_move_speed = 7;

        this.combined_bg_move_speed = 3;
    },

    drawClouds: function(ctx) {
      var cloud_bg_vx_abs = Math.abs(this.cloud_bg_vx);

      // fixing weird indexSizeError bugs for the most nonsensical browsers - opera and IE
      try {
        ctx.drawImage(
          this.cloud_img,

          cloud_bg_vx_abs,
          0,
          mit.W + this.cloud_bg_vx,
          mit.H,

          0, 0,
          mit.W + this.cloud_bg_vx,
          mit.H
        );

        ctx.drawImage(
          this.cloud_img,

          0, 0,
          cloud_bg_vx_abs,
          mit.H,

          mit.W + this.cloud_bg_vx,
          0,
          cloud_bg_vx_abs,
          mit.H
        );
      }
      catch(e) {}
      this.cloud_bg_vx -= this.cloud_bg_move_speed;

      if (-this.cloud_bg_vx >= mit.W) {
        this.cloud_bg_vx = 0;
      }

      return;
    },

    drawBackTrees: function(ctx) {
      var backtree_bg_vx_abs = Math.abs(this.backtree_bg_vx);

      // fixing weird indexSizeError bugs for the most nonsensical browsers - opera and IE
      try {
        ctx.drawImage(
          this.backtree_img,

          backtree_bg_vx_abs,
          0,
          mit.W + this.backtree_bg_vx,
          mit.H,

          0, 0,
          mit.W + this.backtree_bg_vx,
          mit.H
        );

        ctx.drawImage(
          this.backtree_img,

          0, 0,
          backtree_bg_vx_abs,
          mit.H,

          mit.W + this.backtree_bg_vx,
          0,
          backtree_bg_vx_abs,
          mit.H
        );
      }
      catch(e) {}

      if (mit.game_started)
        this.backtree_bg_vx -= this.backtree_bg_move_speed * this.common_bg_speed;

      if (-this.backtree_bg_vx >= mit.W) {
        this.backtree_bg_vx = 0;
      }

      return;
    },

    drawFrontTrees: function(ctx) {
      var fronttree_bg_vx_abs = Math.abs(this.fronttree_bg_vx);

      // fixing weird indexSizeError bugs for the most nonsensical browsers - opera and IE
      try {
        ctx.drawImage(
          this.fronttree_img,

          fronttree_bg_vx_abs,
          0,
          mit.W + this.fronttree_bg_vx,
          mit.H,

          0, 0,
          mit.W + this.fronttree_bg_vx,
          mit.H
        );

        ctx.drawImage(
          this.fronttree_img,

          0, 0,
          fronttree_bg_vx_abs,
          mit.H,

          mit.W + this.fronttree_bg_vx,
          0,
          fronttree_bg_vx_abs,
          mit.H
        );
      }
      catch(e) {}
      if (mit.game_started)
        this.fronttree_bg_vx -= this.fronttree_bg_move_speed * this.common_bg_speed;

      if (-this.fronttree_bg_vx >= mit.W) {
        this.fronttree_bg_vx = 0;
      }

      return;
    },

    drawGround: function(ctx) {
      var ground_bg_vx_abs = Math.abs(this.ground_bg_vx);
      // fixing weird indexSizeError bugs for the most nonsensical browsers - opera and IE
      try {
        ctx.drawImage(
          this.ground_img,

          ground_bg_vx_abs,
          0,
          mit.W + this.ground_bg_vx,
          mit.H,

          0, 0,
          mit.W + this.ground_bg_vx,
          mit.H
        );

        ctx.drawImage(
          this.ground_img,

          0, 0,
          ground_bg_vx_abs,
          mit.H,

          mit.W + this.ground_bg_vx,
          0,
          ground_bg_vx_abs,
          mit.H
        );
      }
      catch(e) {}

      if (mit.game_started)
        this.ground_bg_vx -= this.ground_bg_move_speed * this.common_bg_speed;

      if (-this.ground_bg_vx >= mit.W) {
        this.ground_bg_vx = 0;
      }

      return;
    },

    drawGrass: function(ctx) {
      var grass_bg_vx_abs = Math.abs(this.grass_bg_vx);
      // fixing weird indexSizeError bugs for the most nonsensical browsers - opera and IE
      try {
        ctx.drawImage(
          this.grass_img,

          grass_bg_vx_abs,
          0,
          mit.W + this.grass_bg_vx,
          mit.H,

          0, 0,
          mit.W + this.grass_bg_vx,
          mit.H
        );

        ctx.drawImage(
          this.grass_img,

          0, 0,
          grass_bg_vx_abs,
          mit.H,

          mit.W + this.grass_bg_vx,
          0,
          grass_bg_vx_abs,
          mit.H
        );
      }
      catch(e) {}

      if (mit.game_started)
        this.grass_bg_vx -= this.grass_bg_move_speed * this.common_bg_speed;

      if (-this.grass_bg_vx >= mit.W) {
        this.grass_bg_vx = 0;
      }

      return;
    },

    drawInitLog: function(ctx) {

      this.log_y = mit.H-(this.log_img.height+45);

      ctx.drawImage(this.log_img, this.log_x, this.log_y);

      if (mit.game_started) {
        this.log_x -= this.ground_bg_move_speed * this.common_bg_speed;
      }
    },

    drawCombinedBG: function(ctx) {
      var combined_bg_vx_abs = Math.abs(this.combined_bg_vx);
      // fixing weird indexSizeError bugs for the most nonsensical browsers - opera and IE
      try {
        ctx.drawImage(
          this.combined_bg_img,

          combined_bg_vx_abs,
          0,
          mit.W + this.combined_bg_vx,
          mit.H,

          0, 0,
          mit.W + this.combined_bg_vx,
          mit.H
        );

        ctx.drawImage(
          this.combined_bg_img,

          0, 0,
          combined_bg_vx_abs,
          mit.H,

          mit.W + this.combined_bg_vx,
          0,
          combined_bg_vx_abs,
          mit.H
        );
      }
      catch(e) {}

      if (mit.game_started)
        this.combined_bg_vx -= this.combined_bg_move_speed * this.common_bg_speed;

      if (-this.combined_bg_vx >= mit.W) {
        this.combined_bg_vx = 0;
      }
    },

    // Draw Awesome Backgrounds
    // Backgrounds have been made for 1000x500 dimensions
    draw: function(ctx) {

      if (mit.start_btn_clicked) {
        if (!this.fps || this.fps === 5000)
          this.fps = mit.fps;
      }
      else {
        this.fps = 5000;
      }


      if (this.fps > 56) {

        // Draw Linear Gradient for real/pure BG (sky/water)
        ctx.save();
        ctx.fillStyle = this.sky_gradient;
        ctx.fillRect(0, 0, mit.W, mit.H);
        ctx.restore();

        // Clouds
        this.drawClouds(ctx);

        // Back Small Trees
        this.drawBackTrees(ctx);

        // Front Big Trees
        this.drawFrontTrees(ctx);
      }
      else {
        this.drawCombinedBG(ctx);
      }

      // Drawing the initial wood log on which
      // Pappu gonna sit and bask in the cool and cozy
      // environment.
      if (this.log_x+100 > 0) {
        this.drawInitLog(ctx);
      }
      else if (!mit.game_started) {
        this.log_x = 40;
      }

      // Draw Ground now!
      this.drawGround(ctx);


      // Increasing speed based on points
      if (mit.score > 200 && !this.first_speed_inc) {
        this.cloud_bg_move_speed++;
        this.backtree_bg_move_speed++;
        this.fronttree_bg_move_speed++;
        this.ground_bg_move_speed++;
        this.combined_bg_move_speed++;

        this.first_speed_inc = 1;
      }

      if (mit.score > 1000 && !this.second_speed_inc) {
        this.cloud_bg_move_speed++;
        this.backtree_bg_move_speed++;
        this.fronttree_bg_move_speed++;
        this.ground_bg_move_speed++;
        this.combined_bg_move_speed++;

        this.second_speed_inc = 1;
      }

      if (mit.score > 3000 && !this.third_speed_inc) {
        this.cloud_bg_move_speed++;
        this.backtree_bg_move_speed++;
        this.fronttree_bg_move_speed++;
        this.ground_bg_move_speed++;
        this.combined_bg_move_speed++;

        this.third_speed_inc = 1;
      }

    }

  };

}());
