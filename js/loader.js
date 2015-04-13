(function () {

  var Obj = {};
  Obj.size = function(obj) {
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
  };

  // Preloading audio stuff
  var loadMusic = document.getElementById("start"),
      loadAngry = document.getElementById("angry_jump"), 
      loadSad = document.getElementById("sad_jump"),
      loadHappy = document.getElementById("happy_jump"),
      loadFlap = document.getElementById("flap"),
      loadTing = document.getElementById("ting");

  // Preloading image stuff

  mit.audio = [
    loadMusic, 
    loadAngry, 
    loadSad, 
    loadHappy,
    loadFlap, 
    loadTing,
  ];

  var images = {
    angry_pakia : "img/angry_pakia.png",
    backtrees : "img/back_trees.png",
    berries : "img/berries.png",
    bg_combined: "img/bg_combined.png",
    branch : "img/branch.png",
    clouds : "img/clouds.png",
    coins : "img/coins.png",
    controls : "img/controls.png",
    //dig : "img/dig.png",
    fork_handle : "img/fork_handle.png",
    fork_head : "img/fork_head.png",
    fronttrees : "img/front_trees.png",
    grass : "img/grass.png",
    ground : "img/ground.png",
    happy_pakia : "img/happy_pakia.png",
    log : "img/log.png",
    pappu : "img/pappu.png",
    plank_bot : "img/plank_bot.png",
    plank_mid : "img/plank_mid.png",
    plank_top : "img/plank_top.png",
    sad_pakia : "img/sad_pakia.png",
    stand : "img/stand.png",
    star : "img/star.png"
  };

  mit.image = {};

  // Get the size of an Obj
  var size = Obj.size(images);
  size += mit.audio.length;

  var counter = 0,
      percent = 0;

  var loading = document.getElementById("bar");
  var loader = document.getElementById("loading");
  var loadText = document.getElementById("loadText");

  if(!($.browser.webkit && !$.browser.chrome)) {
    for(var i = 0; i < mit.audio.length; i++) {
      var file = mit.audio[i];

      if (isNaN(file.duration)) { 
        file.addEventListener("loadeddata", function() {
          counter++;
          percent = Math.floor((counter/size*100));
          loading.style.width = percent + "%";
          loadText.innerHTML = "Loading... " + percent + "%";

          if(percent >= 100) {
            $("#loading").fadeOut();
            mit.main();
          }
        });
      }

      else {
        counter++;
        percent = Math.floor((counter/size*100));
        loading.style.width = percent + "%";
        loadText.innerHTML = "Loading... " + percent + "%";

        if(percent >= 100) {
          $("#loading").fadeOut();
          mit.main();
        }

      }
    }
  }

  else {counter += mit.audio.length}

  for(var src in images) {
    mit.image[src] = new Image();
    mit.image[src].onload = function() {
      counter++;

      percent = Math.floor(((counter)/size*100));
      loading.style.width = percent + "%";
      loadText.innerHTML = "Loading... " + percent + "%";
      
      if(percent >= 100) {
        $("#loading").fadeOut();
        mit.main();
      }

    };

    mit.image[src].src = images[src];
  }

}());