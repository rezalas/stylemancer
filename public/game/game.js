(function() {
  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

let canvas,
  hud = document.getElementById("hud"),
  ctx,
  width,
  height,
  lastWidth,
  lastHeight,
  friction,
  gravity,
  level = 0,
  player = {},
  keys = [],
  boxes = [],
  triggers = [];

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

player.x = canvas.width / 10;
player.y = canvas.height * 0.01;

lastWidth = canvas.width;
lsatHeight = canvas.height;

// Initialise last width and height to correct canvas dimensions
if (window.innerWidth >= (window.innerHeight / 10) * 16) {
  lastWidth = (window.innerHeight / 10) * 16;
  lastHeight = window.innerHeight * 0.67;
} else {
  lastWidth = window.innerWidth;
  lastHeight = (window.innerWidth / 16) * 10 * 0.67;
}

function canvasSetup() {
  if (window.innerWidth >= (window.innerHeight / 10) * 16) {
    width = (window.innerHeight / 10) * 16;
    height = window.innerHeight * 0.67;
  } else {
    width = window.innerWidth;
    height = (window.innerWidth / 16) * 10 * 0.67;
  }
  canvas.width = width;
  canvas.height = height;
  hud.setAttribute(
    "style",
    `width: ${canvas.width}px; height: ${(canvas.height / 67) *
      33}px;`
  );
  // hud.setAttribute("style", ``);
  if (lastWidth !== canvas.width) {
    // Adjust player position, based on degree of screen resize
    player.x = Math.round((player.x * canvas.width) / lastWidth);
    player.y = Math.round((player.y * canvas.height) / lastHeight);
    lastWidth = canvas.width;
    lastHeight = canvas.height;
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight * 0.67,
  };
}

function physicsSetup() {
  friction = 0.8;
  gravity = canvas.width * 0.0003;
}

function levelSetup() {
  boxes = [];

  function box(x, y, w, h, c, e = null) {
    return {
      x: Math.round((width * x) / 100),
      y: Math.round((height * y) / 100),
      width: Math.round((width * w) / 100),
      height: Math.round((height * h) / 100),
      color: c,
      effect: e,
    };
  }

  switch (level) {
    case 0:
      boxes.push(box(0, 0, 1.5, 100, "black"));
      boxes.push(box(0, 95, 100, 5, "black"));
      boxes.push(box(97.5, 0, 2.5, 37.5, "black"));
      boxes.push(box(97.5, 65, 2.5, 42.5, "black"));
      boxes.push(box(40, 85, 5, 5 / ((1 / 1.6) * 0.67), "black"));
      boxes.push(box(65, 85, 5, 5 / ((1 / 1.6) * 0.67), "black"));
      boxes.push(box(85, 65, 37.5, 42.5, "black"));
      boxes.push(box(80, 75, 37.5, 42.5, "black"));
      triggers.push(
        box(102.5, 37.5, 2.5, 27.5, "rgba(0, 0, 0, 0)", { level: 1 })
      );
      break;
    case 1:
      player.x = 0;
      boxes.push(box(0, 0, 2.5, 37.5, "black"));
      boxes.push(box(0, 65, 2.5, 42.5, "black"));
      boxes.push(box(0, 95, 100, 5, "black"));
  }
}
function playerSetup() {
  player = {
    ...player,
    width: canvas.width * 0.04,
    height: canvas.height * 0.2,
    speed: canvas.width * 0.003,
    velX: 0,
    velY: 0,
    jumping: false,
    grounded: false,
    color: "#E6AC27",
  };
}

canvasSetup();
physicsSetup();
levelSetup();
playerSetup();

function update() {
  // check keys
  if (keys[38] || keys[32] || keys[87]) {
    // up arrow or space
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      player.grounded = false;
      player.velY = -player.speed * 2; //how high to jump
    }
  }
  if (keys[39] || keys[68]) {
    // right arrow
    if (player.velX < player.speed) {
      player.velX += canvas.width * 0.001;
    }
  }
  if (keys[37] || keys[65]) {
    // left arrow
    if (player.velX > -player.speed) {
      player.velX -= canvas.width * 0.001;
    }
  }

  player.velX *= friction;
  player.velY += gravity;

  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();

  player.grounded = false;

  // Draw boxes
  for (var i = 0; i < boxes.length; i++) {
    ctx.fillStyle = boxes[i].color;
    ctx.fillRect(
      boxes[i].x,
      boxes[i].y,
      boxes[i].width,
      boxes[i].height
    );

    var dir = colCheck(player, boxes[i]);

    if (dir === "l" || dir === "r") {
      player.velX = 0;
      player.jumping = false;
    } else if (dir === "b") {
      player.grounded = true;
      player.jumping = false;
    } else if (dir === "t") {
      player.velY *= -1;
    }
  }

  if (player.grounded) {
    player.velY = 0;
  }

  player.x += player.velX;
  player.y += player.velY;

  // Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Check for trigger collisions
  for (var j = 0; j < triggers.length; j++) {
    if (colCheck(player, triggers[j]) !== null) {
      Object.keys(triggers[j].effect).forEach((key, index) => {
        switch (key) {
          case "level":
            level = triggers[j].effect[key];
            levelSetup();
            break;
        }
      });
    }
  }

  requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
  // get the vectors to check against
  var vX =
      shapeA.x + shapeA.width / 2 - (shapeB.x + shapeB.width / 2),
    vY =
      shapeA.y + shapeA.height / 2 - (shapeB.y + shapeB.height / 2),
    // add the half widths and half heights of the objects
    hWidths = (shapeA.width + shapeB.width) / 2,
    hHeights = (shapeA.height + shapeB.height) / 2,
    colDir = null;

  // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    // figures out on which side we are colliding (top, bottom, left, or right)
    var oX = hWidths - Math.abs(vX),
      oY = hHeights - Math.abs(vY);
    if (oX >= oY) {
      if (vY > 0) {
        colDir = "t";
        shapeA.y += Math.ceil(oY * 10) / 10;
      } else {
        colDir = "b";
        shapeA.y -= Math.ceil(oY * 10) / 10;
      }
    } else {
      if (vX > 0) {
        colDir = "l";
        shapeA.x += Math.ceil(oX * 10) / 10;
      } else {
        colDir = "r";
        shapeA.x -= Math.ceil(oX * 10) / 10;
      }
    }
  }
  return colDir;
}

window.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
});

window.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});

window.addEventListener("resize", canvasSetup);
window.addEventListener("resize", physicsSetup);
window.addEventListener("resize", levelSetup);
window.addEventListener("resize", playerSetup);

window.addEventListener("load", function() {
  update();
});
