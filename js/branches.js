(function() {

  // We're having lots of forks to
  // make gameplay a little harder
  // and incorporate ggo's required concepts.

  // But we'll also try to incorporate
  // 'branching' by adding some branches
  // at random spots. So let the forks
  // come, but sometimes there wont be forks,
  // but a single branch (from top to bottom).
  //
  // The branches are gonna have a little hole
  // in between or some other random position
  // through which pappu will need to pass.
  //
  // If it collides at some part other than
  // the hole, he'll decease.

  mit.Branch = function() {
    this.x = 0;
    this.y = 0;

    // Width
    this.w;
    // Height
    this.h;

    this.escape_x;
    this.escape_y;
    this.escape_w;
    this.escape_h;

    this.getBounds = function() {
      var b = {};

      b.start_x = this.x;
      b.start_y = this.y;
      b.end_x   = this.x + this.w;
      b.end_y   = this.y + this.h;

      return b;
    };

    this.getEscapeBounds = function() {
      var b = {};

      b.start_x = this.escape_x;
      b.start_y = this.escape_y;
      b.end_x   = this.escape_x + this.escape_w;
      b.end_y   = this.escape_y + this.escape_h;

      return b;
    };
  };


  mit.BranchUtils = {

    branch_img: {},

    branches: [],
    count: 4,

    init: function() {
      // Load Images
      // this.branch_img = new Image();
      // this.branch_img.src = 'img/branch.png';

      this.branch_img = mit.image.branch;
    },

    /*
      This method will generate a random x/y
      position for the forks to start at.

      Based on the `fork.edge` we can draw
      the fork easily on the canvas edges.
    */
    getRandomBranchPos: function() {
      // We have access to `branches` here
      var pos = {};

      if (this.branches[this.branches.length-1]) {
        pos.x = this.branches[this.branches.length-1].x;
        pos.x += utils.randomNumber(500, 2000);
      }
      else {
        // First
        pos.x = utils.randomNumber(2000, 2500);
      }

      var forks = mit.ForkUtils.forks;
      /*var last_fork = forks[forks.length-1];

      if (last_fork) {

        if (Math.abs(pos.x - last_fork.x) < 300) {
          pos.x = last_fork.x + 300;
        }
      }*/

      if (forks.length) {
        forks.forEach(function(fork) {
          if (Math.abs(pos.x - fork.x) < 500)
            pos.x = fork.x + 500;
        });
      }

      return pos;
    },

    create: function() {
      var branches = this.branches,
          count = this.count;

      if (branches.length < count) {

        for (var i = 0; i < count - branches.length; i++) {
          var branch = new mit.Branch();

          var pos = this.getRandomBranchPos();
          branch.x = pos.x;
          branch.y = 0;

          branch.w = this.branch_img.width;
          branch.h = this.branch_img.height;

          // Escape Positions
          branch.escape_x = branch.x;
          branch.escape_y = branch.y + utils.randomNumber(0, branch.h-150);

          // Escape Area's Width/Height
          branch.escape_w = this.branch_img.width;
          branch.escape_h = 150;

          branches.push(branch);
        }
    }
    },

    draw: function(ctx) {
      var branches = this.branches,
          branch_img = this.branch_img,
          dead_branch = 0;

      this.create();

      // Loop over branches and draw each of them
      branches.forEach(function(branch, index) {

        branch.x -= mit.Backgrounds.ground_bg_move_speed;

        if (branch.x + branch.w < 0) {
          dead_branch++;
          return;
        }

        // Out of view port, no need to draw
        if (branch.x > mit.W)
          return;

        // Escape Positions
        branch.escape_x = branch.x;

        ctx.drawImage(branch_img, branch.x, branch.y);

        // Draw Escapes
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'white';
        ctx.fillRect(
          branch.escape_x,
          branch.escape_y,
          branch.escape_w,
          branch.escape_h
        );
        ctx.restore();
      });

      if (dead_branch) {
        branches.splice(0, dead_branch);
      }

      return;
    },

    // Check collisions with branches
    checkCollision: function() {
      var first_branch = this.branches[0];

      // Useless optimization
      if (first_branch.x > mit.W/2)
        return;

      // Get Pappu Bounds
      var pappu_bounds = mit.Pappu.getBounds(),
          // Get Nearest Branch's Top Part's Bounds
          branch_bounds = first_branch.getBounds();

      if (utils.intersect(pappu_bounds, branch_bounds)) {

        // If the Escape Area intersects then pappu
        // can escape, else game over matey!
        var escape_bounds = first_branch.getEscapeBounds();

        if (!utils.intersect(pappu_bounds, escape_bounds)) {
          mit.gameOver();
        }

      }

      return;
    }

  };

}());
