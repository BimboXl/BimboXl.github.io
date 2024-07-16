// Mouse Controls
var documentWidth = document.documentElement.clientWidth;
var documentHeight = document.documentElement.clientHeight;
var audioPlayer = null;

var minRot = -90,
  maxRot = 90,
  solveDeg = (Math.random() * 180) - 90,
  solvePadding = 1,
  maxDistFromSolve = 25,
  pinRot = 0,
  cylRot = 0,
  lastMousePos = 0,
  mouseSmoothing = 2,
  keyRepeatRate = 25,
  cylRotSpeed = 3,
  pinDamage = 10,
  pinHealth = 100,
  pinDamageInterval = 150,
  numPins = 1,
  userPushingCyl = false,
  gameOver = false,
  gamePaused = false,
  pin, cyl, driver, cylRotationInterval, pinLastDamaged;

  $(document).ready(function () {
    // Initialize game elements
    pin = $('#pin');
    cyl = $('#cylinder');
    driver = $('#driver');
  
    // Start the lockpick game automatically
    startLockpickGame();
  
    // Mouse event handlers
    $('body').on('mousemove', function (e) {
      if (lastMousePos && !gameOver && !gamePaused) {
        var pinRotChange = (e.clientX - lastMousePos) / mouseSmoothing;
        pinRot += pinRotChange / 2;
        pinRot = Util.clamp(pinRot, maxRot, minRot);
        pin.css({
          transform: "rotateZ(" + pinRot + "deg)"
        });
      }
      lastMousePos = e.clientX;
    });
  
    $('body').on('mouseleave', function (e) {
      lastMousePos = 0;
    });
  
    // Keyboard event handlers
    $('body').on('keydown', function (e) {
      if ((e.keyCode == 87 || e.keyCode == 65 || e.keyCode == 83 || e.keyCode == 68) && !userPushingCyl && !gameOver && !gamePaused) {
        pushCyl();
      }
      if ((e.keyCode == 39) && !userPushingCyl && !gameOver && !gamePaused) {
        pinUpdate(1);
      }
  
      if ((e.keyCode == 37) && !userPushingCyl && !gameOver && !gamePaused) {
        pinUpdate(2);
      }
    });
  
    $('body').on('keyup', function (e) {
      pinUpdate(0);
  
      if ((e.keyCode == 87 || e.keyCode == 65 || e.keyCode == 83 || e.keyCode == 68) && !gameOver) {
        unpushCyl();
      }
    });
  
    // Touch event handlers
    $('body').on('touchstart', function (e) {
      console.log('touchStart', e);
    });
  }); // docready
  
  let updating = 0;
  let penis = false;
  
  function pinUpdate(set) {
    updating = set;
    if (set == 0 || penis) {
      return;
    }
    penis = true;
    if (set == 1) {
      pinRot = pinRot + 1;
    } else {
      pinRot = pinRot - 1;
    }
    pin.css({
      transform: "rotateZ(" + pinRot + "deg)"
    });
  
    if (updating != 0 && !userPushingCyl && !gameOver && !gamePaused) {
      setTimeout(() => {
        pinUpdate(updating);
        penis = false;
      }, 1);
    }
  }
  
  // CYL INTERACTIVITY EVENTS
  function pushCyl() {
    var distFromSolve, cylRotationAllowance;
    clearInterval(cylRotationInterval);
    userPushingCyl = true;
    distFromSolve = Math.abs(pinRot - solveDeg) - solvePadding;
    distFromSolve = Util.clamp(distFromSolve, maxDistFromSolve, 0);
    cylRotationAllowance = Util.convertRanges(distFromSolve, 0, maxDistFromSolve, 1, 0.02);
    cylRotationAllowance = cylRotationAllowance * maxRot;
  
    cylRotationInterval = setInterval(function () {
      cylRot += cylRotSpeed;
      if (cylRot >= maxRot) {
        cylRot = maxRot;
        clearInterval(cylRotationInterval);
        unlock();
      }
      else if (cylRot >= cylRotationAllowance) {
        cylRot = cylRotationAllowance;
        damagePin();
      }
  
      cyl.css({
        transform: "rotateZ(" + cylRot + "deg)"
      });
      driver.css({
        transform: "rotateZ(" + cylRot + "deg)"
      });
    }, keyRepeatRate);
  }
  
  function unpushCyl() {
    userPushingCyl = false;
    clearInterval(cylRotationInterval);
    cylRotationInterval = setInterval(function () {
      cylRot -= cylRotSpeed;
      cylRot = Math.max(cylRot, 0);
      cyl.css({
        transform: "rotateZ(" + cylRot + "deg)"
      });
      driver.css({
        transform: "rotateZ(" + cylRot + "deg)"
      });
      if (cylRot <= 0) {
        cylRot = 0;
        clearInterval(cylRotationInterval);
      }
    }, keyRepeatRate);
  }
  
  // PIN AND SOLVE EVENTS
  function damagePin() {
    if (!pinLastDamaged || Date.now() - pinLastDamaged > pinDamageInterval) {
      var tl = new TimelineLite();
      pinHealth -= pinDamage;
      pinLastDamaged = Date.now();
      tl.to(pin, (pinDamageInterval / 4) / 1000, {
        rotationZ: pinRot - 2
      });
      tl.to(pin, (pinDamageInterval / 4) / 1000, {
        rotationZ: pinRot
      });
      if (pinHealth <= 0) {
        breakPin();
      }
    }
  }
  
  function breakPin() {
    playSound("pinbreak", 0.3);
    var tl, pinTop, pinBott;
    gamePaused = true;
    clearInterval(cylRotationInterval);
    numPins--;
    $('span').text(numPins);
    pinTop = pin.find('.top');
    pinBott = pin.find('.bott');
    tl = new TimelineLite();
    tl.to(pinTop, 0.7, {
      rotationZ: -400,
      x: -200,
      y: -100,
      opacity: 0
    });
    tl.to(pinBott, 0.7, {
      rotationZ: 400,
      x: 200,
      y: 100,
      opacity: 0,
      onComplete: function () {
        if (numPins > 0) {
          setTimeout(function() {
            gamePaused = false;
            reset();
          }, 2000); // 2-second delay before resetting
        }
        else {
          outOfPins();
        }
      }
    }, 0);
    tl.play();
  }
  
  function reset() {
    cylRot = 0;
    pinHealth = 100;
    pinRot = 0;
    pin.css({
      transform: "rotateZ(" + pinRot + "deg)"
    });
    cyl.css({
      transform: "rotateZ(" + cylRot + "deg)"
    });
    driver.css({
      transform: "rotateZ(" + cylRot + "deg)"
    });
    TweenLite.to(pin.find('.top'), 0, {
      rotationZ: 0,
      x: 0,
      y: 0,
      opacity: 1
    });
    TweenLite.to(pin.find('.bott'), 0, {
      rotationZ: 0,
      x: 0,
      y: 0,
      opacity: 1
    });
  }
  
  function playSound(file, volume) {
    if (audioPlayer != null) {
      audioPlayer.pause();
    }
  
    audioPlayer = new Audio("./sounds/" + file + ".ogg");
    audioPlayer.volume = volume;
    audioPlayer.play();
  }
  
  function outOfPins() {
    gameOver = true;
    $('#lose').css('display', 'inline-block');
    $('#modal').fadeIn();
    setTimeout(function() {
      reset();
      startLockpickGame()
    }, 1000); // 2-second delay before resetting
  }
  
  function unlock() {
    playSound("lockUnlocked", 0.6);
    gameOver = true;
    $('#win').css('display', 'inline-block');
    $('#modal').fadeIn();
    setTimeout(function() {
      reset();
      startLockpickGame()
    }, 1000); // 2-second delay before resetting
  }
  
  // UTIL
  Util = {};
  Util.clamp = function (val, max, min) {
    return Math.min(Math.max(val, min), max);
  };
  Util.convertRanges = function (OldValue, OldMin, OldMax, NewMin, NewMax) {
    return (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin;
  };
  
  // Start the lockpick game
  function startLockpickGame() {
    solveDeg = (Math.random() * 180) - 90;
    solvePadding = 1;
    maxDistFromSolve = 25;
    pinDamage = 10;
    pinHealth = 100;
    minRot = -90;
    maxRot = 90;
    pinRot = 0;
    cylRot = 0;
    lastMousePos = 0;
    mouseSmoothing = 2;
    keyRepeatRate = 25;
    cylRotSpeed = 3;
    pinDamageInterval = 150;
    numPins = 1;
    userPushingCyl = false;
    gameOver = false;
    gamePaused = false;
  
    reset();
    openContainer();
  }
  
  function openContainer() {
    $("#wrap").css("display", "block");
    document.body.style.backgroundColor = "rgba(190,190,190,0.2)";
  }
  
  function closeContainer() {
    $("#wrap").css("display", "none");
    document.body.style.backgroundColor = "rgba(190,190,190,0.0)";
  }
  
  // Listen for NUI Events
  window.addEventListener('message', function (event) {
    var item = event.data;
  
    if (item.openPhone === true) {
      openContainer();
    }
  
    if (item.openSection == "playgame") {
      solveDeg = (Math.random() * 180) - 90;
      solvePadding = item.padding;
      maxDistFromSolve = item.solveDist;
      pinDamage = item.damage;
      pinHealth = item.health;
  
      minRot = -90;
      maxRot = 90;
      pinRot = 0;
      cylRot = 0;
      lastMousePos = 0;
      mouseSmoothing = 2;
      keyRepeatRate = 25;
      cylRotSpeed = 3;
      pinDamageInterval = 150;
      numPins = 1;
      userPushingCyl = false;
      gameOver = false;
      gamePaused = false;
  
      reset();
    }
  
    if (item.openPhone === false) {
      closeContainer();
    }
  });
  