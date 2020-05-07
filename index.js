$(function (){
  screenWidth = $(window).width();
  screenHeight = $(window).height();
  playerX = 0;
  playerY = 0;
  jumpAcc = 0;
  xAcc = 0;
  jumpCool = 0;
  jumpDown = false;
  jumpPressed = false;
  playerCollision = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  pointThis = 0;
  levelNow = 7;

  $(document).keydown(function(e) {
    if (event.keyCode == '32' && jumpCool < 0) {
      jumpPressed = true;
    }
    else if (event.keyCode == '37'){
      xAcc = -1;
    }
    else if (event.keyCode == '39'){
      xAcc = 1;
    }
  });
  $(document).keyup(function(e) {
    if (event.keyCode == '32'){
      jumpPressed = false;
      jumpDown = true;
      jumpCool = 0.85;
    }
    else if (event.keyCode == '37'){
      xAcc = 0;
    }
    else if (event.keyCode == '39'){
      xAcc = 0;
    }
  });

  function screenUpdate() {
    screenWidth = $(window).width();
    screenHeight = $(window).height();
    $('#player').css('transform', 'matrix(5, 0, 0, 5, ' + (screenWidth/2) + ', ' + (screenHeight/2) + ')');
    $('#gameScreen').css('transform', 'matrix(1, 0, 0, 1, ' + (screenWidth/2-screenWidth*0.02-(screenWidth*playerX*0.05)) + ', ' + ((screenHeight/2)-screenWidth*0.9705+(screenWidth*playerY*0.05)) + ')');
    for (var i = 0; i < 20; i++) {
      for (var j = 0; j < 20; j++) {
        $('.l' + i + 'b' + j).css('transform', 'matrix(1, 0, 0, 1, ' + (screenWidth*(j*0.05)) + ', 0)');
      }
    }
  }
  function playerUpdate() {
    playerCollision = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    playerPointX = Math.round(playerX);
    playerPointY = 19-Math.round(playerY);
    if (playerPointY <= 18) {
      if (playerPointX >= 1) {
        playerCollision[0] = map[levelNow][(playerPointY+1)*20+(playerPointX-1)];
      }
      playerCollision[1] = map[levelNow][(playerPointY+1)*20+playerPointX];
      if (playerPointX <= 18) {
        playerCollision[2] = map[levelNow][(playerPointY+1)*20+(playerPointX+1)];
      }
    }
    if (playerPointX >= 1) {
      playerCollision[3] = map[levelNow][playerPointY*20+(playerPointX-1)];
    }
    playerCollision[4] = map[levelNow][playerPointY*20+playerPointX];
    if (playerPointX <= 18) {
      playerCollision[5] = map[levelNow][playerPointY*20+(playerPointX+1)];
    }
    if (playerPointY >= 1) {
      if (playerPointX >= 1) {
        playerCollision[6] = map[levelNow][(playerPointY-1)*20+(playerPointX-1)];
      }
      playerCollision[7] = map[levelNow][(playerPointY-1)*20+playerPointX];
      if (playerPointX <= 18) {
        playerCollision[8] = map[levelNow][(playerPointY-1)*20+(playerPointX+1)];
      }
    }
    if (playerCollision[4] == 3) {
      playerX = 0;
      playerY = 0;
    }
    if (playerCollision[4] == 2) {
      playerX = 0;
      playerY = 0;
      levelNow++;
      displayMap();
    }
    if (Math.max(playerCollision[1], playerCollision[3], playerCollision[4], playerCollision[5], playerCollision[7]) >= 1) {
      if (playerCollision[4] == 4) {
        playerY -= 0.2;
      }
      if (playerCollision[4] == 5) {
        playerY += 0.2;
      }
      if (playerCollision[4] == 1) {
        playerY += 0.4;
        playerX -= 0.6*xAcc;
        jumpDown = false;
      }
      if (playerCollision[7] == 1) {
        playerY += 1;
        jumpAcc = 0;
        jumpDown = false;
      }
    } else if (playerY < 0 || playerY > 20) {
      playerY = 0;
      jumpAcc = 0;
      jumpDown = false;
      jumpPressed = false;
    }
    if (jumpPressed && jumpDown != true) {
      if (jumpAcc >= 0.5) {
        jumpDown = true;
        jumpAcc -= 0.05;
        jumpCool = 0.85;
      }
      jumpAcc += 0.05;
    } else if (jumpDown == true || jumpAcc > 0.5) {
      jumpAcc -= 0.05;
      jumpDown = true;
    } else if (jumpAcc < -0.5) {
      jumpAcc = 0;
      jumpDown = false;
    }
    if (0 <= playerX && playerX <= 19) {
      playerX += xAcc/5;
    } else if (playerX < 0) {
      playerX = 0;
    } else if (playerX > 19) {
      playerX = 19;
    }
    playerY += jumpAcc/2;
  }
  function displayMap() {
    $('#stageDisplay').html(function (index,html) {
      return 'stage ' + (levelNow+1);
    });
    for (var i = 0; i < 20; i++) {
      for (var j = 0; j < 20; j++) {
        $('.l' + i + 'b' + j).attr({
          'class' : 'thingsBlock l' + i + 'b' + j + ' b' + map[levelNow][i*20+j]
        });
      }
    }
  }

  setInterval( function (){
    screenUpdate();
  }, 100);
  setInterval( function (){
    playerUpdate();
    jumpCool -= 0.02;
  }, 20);

  for (var i = 0; i < 20; i++) {
    for (var j = 0; j < 20; j++) {
      $('<span>').addClass('l' + i + 'b' + j).addClass('thingsBlock').css('transform', 'matrix(1, 0, 0, 1, ' + (screenWidth*(j*0.05)) + ', 0)').appendTo('#l' + i);
    }
  }
  displayMap();
});
