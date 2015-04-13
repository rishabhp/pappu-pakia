(function() {

  /*
  We'll have some collectibles:

  - Ones that give 50, 100, 500, 1000 points.

  - One to clone pappu that'll kill all
    forks, branches, pakias.

  - One for pappu's invincibility
  */

  mit.Collectible = function() {

    // x/y pos
    this.x;
    this.y;

    // width/height
    this.w;
    this.h;

    // Collectible Type - read above
    this.type;

    // Sound
    this.sound = document.getElementById("ting");
    this.sound.volume = 0.35;

    // Some collectible types may have subtypes
    // like coins of 50, 100, 500, 1000 and so on ...
    this.sub_type;

    this.getBounds = function() {
      var b = {};

      b.start_x = this.x;
      b.start_y = this.y;
      b.end_x   = this.x + this.w;
      b.end_y   = this.y + this.h;

      return b;
    };


    this.draw = function(ctx) {
      switch (this.type) {

        case 'coin':
          this.drawCoin(ctx);
          break;

        case 'clone':
          this.drawClone(ctx);
          break;

        case 'invincible':
          this.drawInvincible(ctx);
          break;

      }

      return;
    };

    this.drawCoin = function(ctx) {
      // Get coin color based on sub type
      var pos = mit.CollectibleUtils.getCoinSpritePos(this.sub_type);

      ctx.drawImage(
        mit.CollectibleUtils.coin_img,
        pos.x, pos.y,
        30, 30,
        this.x, this.y,
        30, 30
      );
    };

    this.drawClone = function(ctx) {
      ctx.drawImage(
        mit.CollectibleUtils.clone_img,
        this.x,
        this.y
      );
    };

    this.drawInvincible = function(ctx) {
      ctx.drawImage(
        mit.CollectibleUtils.invincible_img,
        this.x,
        this.y
      );
    };
  };


  mit.CollectibleUtils = {

    collecs: [],

    count: 2,

    types: ['coin', 'clone', 'invincible'],
    //types: ['invincible'],

    sub_types: {
      coin: [50, 100, 500]
    },

    init: function() {
      // this.coin_img = new Image();
      // this.coin_img.src = 'img/coins.png';
      this.coin_img = mit.image.coins;

      // this.clone_img = new Image();
      // this.clone_img.src = 'img/berries.png';
      this.clone_img = mit.image.berries;

      // this.invincible_img = new Image();
      // this.invincible_img.src = 'img/star.png';
      this.invincible_img = mit.image.star;
    },

    getCoinSpritePos: function(sub_type) {

      switch (sub_type) {
        case 50:
          // Yellow (first)
          return {x: 0, y: 0};

        case 100:
          // Pink (second)
          return {x: 30, y: 0};

        case 500:
          // Red (third)
          // Pink (second)
          return {x: 60, y: 0};

        case 1000:
          // Blue (last)
          return {x: 90, y: 0};
      }

    },

    getRandomPos: function() {
      var pos = {};

      var last = this.collecs[this.collecs.length - 1];

      if (last) {
        pos.x = last.x + utils.randomNumber(1000, 1500);
      }
      else {
        pos.x = utils.randomNumber(2000, 3000);
        pos.x = utils.randomNumber(500, 1000);
      }

      pos.y = utils.randomNumber(100, mit.H-100);

      // Check Positioning with forks
      var forks = mit.ForkUtils.forks;

      if (forks.length) {
        forks.forEach(function(fork) {
          if (Math.abs(pos.x - fork.x) < 300)
            pos.x = fork.x + 300;
        });
      }

      // Check Positioning with branches
      var branches = mit.BranchUtils.branches;

      if (branches.length) {
        branches.forEach(function(branch) {
          if (Math.abs(pos.x - branch.x) < 300)
            pos.x = branch.x + 300;
        });
      }

      return pos;
    },

    create: function() {
      var count = this.count - this.collecs.length;
      var collec,
          sub_types,
          pos;

      for (var i = 0; i < count; i++) {
        collec = new mit.Collectible();

        pos = this.getRandomPos();

        collec.x = pos.x;
        collec.y = pos.y;

        // Type
        collec.type = this.types[utils.randomNumber(0, this.types.length-1)];
        switch (collec.type) {
            case "coin":
                collec.w = 30;
                collec.h = 30;
                break;
            case "clone":
                collec.w = mit.image.berries.width;
                collec.h = mit.image.berries.height;
                break;
            case "invincible":
                collec.w = mit.image.star.width;
                collec.h = mit.image.star.height;
                break;
        }

        // Choosing Sub types if any
        sub_types = this.sub_types[collec.type];
        if (sub_types)
          collec.sub_type = sub_types[utils.randomNumber(0, sub_types.length-1)];

        this.collecs.push(collec);
      }
    },

    draw: function(ctx) {

      var self = this;

      self.create();

      self.collecs.forEach(function(collec, i) {
        if (collec.x < 0) {
          // Moved off the left edge
          /*var pos = self.getRandomPos();

          collec.x = pos.x;
          collec.y = pos.y;*/
          self.collecs.splice(i,1);
        }

        collec.x -= mit.Backgrounds.ground_bg_move_speed;

        collec.draw(ctx);
      });

      return;
    },

    checkCollision: function() {
      // First collec
      var collec = this.collecs[0],
          // Get Pappu Bounds
          pappu_bounds = mit.Pappu.getBounds(),
          // Get Nearest Collectible Bounds
          collec_bounds = collec.getBounds();

      if (utils.intersect(pappu_bounds, collec_bounds)) {
        // Pappu haz collected!
        collec.sound.play();
        // Determine type and perform action accordingly
        switch (collec.type) {

          case 'coin':
            mit.score += collec.sub_type;
            break;

          case 'clone':
            mit.Pappu.createClones(3);
            break;

          case 'invincible':
            mit.Pappu.invincible = 1;

            // Kush says we shouldnt add up
            /*if (!mit.Pappu.invincibility_start) {
              mit.Pappu.invincibility_time = 5000;
            }
            else {
              var cur_time = new Date().getTime();
              var prev_remaining_time = cur_time - mit.Pappu.invincibility_start;

              mit.Pappu.invincibility_time = 5000 + prev_remaining_time;
            }*/

            mit.Pappu.invincibility_start = new Date().getTime();
            mit.Pappu.invincibility_time = 5000;

            // Show timer
            mit.ui.invincible_timer.show();

            break;
        }

        // Nuke the collectible
        this.collecs.shift();
      }

      return;
    }

  };

}());
