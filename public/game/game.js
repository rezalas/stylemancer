(function() {
  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

// Initial setup

let canvas = document.getElementById("canvas"),
  canvasContainer = document.getElementById("canvas-container"),
  ctx = canvas.getContext("2d"),
  hud = document.getElementById("hud"),
  code = document.getElementById("code"),
  submit = document.getElementById("submit"),
  reset = document.getElementById("reset"),
  width,
  height,
  lastWidth = canvas.width,
  lastHeight = canvas.height,
  friction,
  gravity,
  level = 3,
  player = {
    x: canvas.width / 3,
    y: canvas.height * -1,
  },
  keys = [],
  boxes = [],
  triggers = [],
  elements = [];

canvas.onclick = function() {
  document.getElementById("code").value = "";
  code.style.visibility = "hidden";
  submit.style.visibility = "hidden";
  reset.style.visibility = "hidden";
};

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
      33}px; visibility: hidden;`
  );
  code.style.visibility = "hidden";
  submit.style.visibility = "hidden";
  reset.style.visibility = "hidden";
  if (lastWidth !== canvas.width) {
    // Adjust player position, based on degree of screen resize
    player.x = Math.round((player.x * canvas.width) / lastWidth);
    player.y = Math.round((player.y * canvas.height) / lastHeight);
    elementsSetup(
      canvas.width / lastWidth,
      canvas.height / lastHeight
    );
    lastWidth = canvas.width;
    lastHeight = canvas.height;
  }
  canvasContainer.style.width = `${canvas.width}px`;
  canvasContainer.style.height = `${canvas.height}px`;
  return {
    width: window.innerWidth,
    height: window.innerHeight * 0.67,
  };
}

function elementsSetup(xResizeFactor, yResizeFactor) {
  elements.map((e, i) => {
    const el = document.getElementById(e);
    w = parseFloat(el.style.width) * xResizeFactor;
    h = parseFloat(el.style.height) * yResizeFactor;
    x = parseFloat(el.style.left) * xResizeFactor;
    y = parseFloat(el.style.top) * yResizeFactor;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  });
}

function physicsSetup() {
  friction = 0.8;
  gravity = canvas.width * 0.00035;
}

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

function levelSetup(num) {
  typeof num === "number" ? (level = num) : (num = level);
  boxes = [];
  triggers = [];

  switch (level) {
    case 0:
      canvas.setAttribute(
        "style",
        "background: -webkit-linear-gradient(to bottom right,#2c5364,#203a43,#0f2027); background: linear-gradient(to bottom right, #2c5364, #203a43, #0f2027);"
      );
      boxes.push(box(0, 0, 1.5, 100, "black"));
      boxes.push(box(0, 95, 100, 5, "black"));
      boxes.push(box(20, 0, 80, 2.5, "black"));
      boxes.push(box(97.5, 0, 2.5, 37.5, "black"));
      boxes.push(box(97.5, 65, 2.5, 42.5, "black"));
      boxes.push(box(40, 85, 5, 5 / ((1 / 1.6) * 0.67), "black"));
      boxes.push(box(65, 85, 5, 5 / ((1 / 1.6) * 0.67), "black"));
      boxes.push(box(75, 85, 5, 5 / ((1 / 1.6) * 0.67), "black"));
      boxes.push(box(85, 65, 37.5, 42.5, "black"));
      boxes.push(box(80, 75, 37.5, 42.5, "black"));
      triggers.push(
        box(102.5, 37.5, 2.5, 27.5, "rgba(0, 0, 0, 0)", {
          player: { x: 0 },
          level: 1,
        })
      );
      break;
    case 1:
      canvas.setAttribute(
        "style",
        "background: -webkit-linear-gradient(to right,#203a43,#0f2027,#0d1c23); background: linear-gradient(to right,#203a43,#0f2027,#0d1c23);"
      );
      boxes.push(box(0, 0, 2.5, 37.5, "black"));
      boxes.push(box(0, 65, 2.5, 42.5, "black"));
      boxes.push(box(0, 0, 100, 2.5, "black")); //ceiling
      boxes.push(box(0, 95, 100, 5, "black")); // ground
      boxes.push(box(0, 65, 40, 42.5, "black")); // left platform
      boxes.push(box(40, 75, 5, 42.5, "black"));
      boxes.push(box(45, 85, 5, 5 / ((1 / 1.6) * 0.67), "black"));
      boxes.push(box(60, 65, 40, 42.5, "black"));
      boxes.push(box(97.5, 0, 2.5, 37.5, "black"));
      boxes.push(box(97.5, 65, 2.5, 42.5, "black"));
      triggers.push(
        box(-2.5, 37.5, 2.5, 27.5, "rgba(0, 0, 0, 0)", {
          player: { x: Math.round((width * 97.5) / 100) },
          level: 0,
        })
      );
      triggers.push(
        box(102.5, 37.5, 2.5, 27.5, "rgba(0, 0, 0, 0)", {
          player: { x: 0 },
          level: 2,
        })
      );
      break;
    case 2:
      canvas.setAttribute(
        "style",
        "background: -webkit-linear-gradient(to bottom right, #0d1c23, #091318); background: linear-gradient(to bottom right, #0d1c23, #091318);"
      );
      boxes.push(box(0, 0, 2.5, 37.5, "black"));
      boxes.push(box(0, 65, 2.5, 42.5, "black"));
      boxes.push(box(0, 0, 100, 2.5, "black")); //ceiling
      boxes.push(box(0, 65, 37.5, 802.5, "black")); // left platform
      boxes.push(box(62.5, 65, 37.5, 802.5, "black")); // right platform
      boxes.push(box(97.5, 0, 2.5, 37.5, "black"));
      boxes.push(box(97.5, 65, 2.5, 42.5, "black"));
      triggers.push(
        box(-2.5, 37.5, 2.5, 27.5, "rgba(0, 0, 0, 0)", {
          player: { x: Math.round((width * 97.5) / 100) },
          level: 1,
        })
      );
      triggers.push(
        box(0, 800, 100, 100, "rgba(0, 0, 0, 0)", {
          player: { y: Math.round((width * -10) / 100), velY: 0 },
          level: 3,
        })
      );
      break;
    case 3:
      canvas.setAttribute(
        "style",
        "background: -webkit-linear-gradient(to bottom, #0d1c23, #060d10); background: linear-gradient(to bottom, #0d1c23, #060d10);"
      );
      boxes.push(box(0, 95, 100, 5, "black")); // ground
      boxes.push(box(0, 0, 1.5, 100, "black")); // left wall
      boxes.push(box(98.5, 0, 1.5, 100, "black")); // right wall
      boxes.push(box(0, -10, 37.5, 12.5, "black")); // left platform
      boxes.push(box(62.5, -10, 37.5, 12.5, "black")); // right platform
      boxes.push(box(32.5, 85, 5, 5 / ((1 / 1.6) * 0.67), "black"));
      boxes.push(box(62.5, 85, 5, 5 / ((1 / 1.6) * 0.67), "black"));
      boxes.push(box(75, 85, 15, 15 / ((1 / 1.6) * 0.67), "black"));
      if (player.styles === true) {
        triggers.push(
          box(
            81.5,
            80 - 5 / ((1 / 1.6) * 0.67),
            2,
            2 / ((1 / 1.6) * 0.67),
            "rgba(0,0,0,0)",
            {
              player: { x: 0 },
              level: 4,
            }
          )
        );
      } else {
        triggers.push(
          box(
            2.5,
            85,
            5,
            5 / ((1 / 1.6) * 0.67),
            "rgba(0, 0, 255, 1)",
            {
              styles: true,
            }
          )
        );
      }
      break;
    case 4:
      boxes.push(box(0, 95, 100, 5, "#230c00")); // ground
      boxes.push(box(0, 0, 100, 2.5, "#230c00")); //ceiling
      boxes.push(box(0, 0, 2.5, 57.5, "#230c00"));
      boxes.push(box(0, 85, 2.5, 42.5, "#230c00"));
      boxes.push(box(2.5, 85, 5, 5 / ((1 / 1.6) * 0.67), "#230c00"));
      boxes.push(box(97.5, 0, 2.5, 57.5, "#230c00"));
      boxes.push(box(97.5, 85, 2.5, 42.5, "#230c00"));
      boxes.push(box(92.5, 85, 5, 5 / ((1 / 1.6) * 0.67), "#230c00"));
      boxes.push(box(50, 50, 25, 45, "purple"));
      triggers.push(
        box(-2.5, 57.5, 2.5, 27.5, "rgba(0, 0, 0, 0)", {
          player: { x: Math.round((width * 77.5) / 100) },
          level: 3,
        })
      );
      addElement({
        tag: "div",
        id: "guards",
        code: ".guards {\n  background-color: purple;\n}",
        answer: `.guards{background-color:red;}`,
        dimensions: boxes[boxes.length - 1],
        color: "rgba(0,0,0,0)",
      });
      break;
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
    frozen: false,
    running: false,
    jumping: false,
    grounded: false,
    color: "#E6AC27",
  };
}

player.styles = false;

canvasSetup();
physicsSetup();
levelSetup(level);
playerSetup();

function update() {
  // check keys
  if (
    player.frozen === false &&
    document.activeElement.id !== "code"
  ) {
    if (keys[16]) {
      player.running = true;
      player.speed = canvas.width * 0.0045;
    } else {
      player.running = false;
      player.speed = canvas.width * 0.003;
    }
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
        if (key === "player") {
          player = {
            ...player,
            ...triggers[j].effect[key],
          };
        }
        if (key === "level") {
          levelSetup(triggers[j].effect[key]);
        }
        if (key === "styles") {
          styles = true;
          player.frozen = true;
          triggers.shift();
          hud.setAttribute(
            "style",
            `width: ${canvas.width}px; height: ${(canvas.height /
              67) *
              33}px; visibility: visible;`
          );
          window.setTimeout(unlockStyle, 3500);
        }
      });
    }
  }

  function unlockStyle() {
    player.frozen = false;
    player.styles = true;
    // const newBox = boxes.push(
    //   box(
    //     77.5,
    //     70 - 5 / ((1 / 1.6) * 0.67),
    //     10,
    //     10 / ((1 / 1.6) * 0.67),
    //     "rgba(0,0,0,0)"
    //   )
    // );
    // addElement({
    //   tag: "div",
    //   id: "grate",
    //   dimensions: boxes[boxes.length - 1],
    // });
    triggers.push(
      box(
        81.5,
        80 - 5 / ((1 / 1.6) * 0.67),
        2,
        2 / ((1 / 1.6) * 0.67),
        "rgba(0,0,0,0)",
        {
          player: { x: 0 },
          level: 4,
        }
      )
    );
  }

  requestAnimationFrame(update);
}

function addElement(el) {
  if (document.getElementById(`${el.id}`) === null) {
    let newEl = document.createElement(el.tag);
    const canvasContainer = document.getElementById(
      "canvas-container"
    );
    canvasContainer.prepend(newEl);
    newEl.setAttribute("id", `${el.id}`);
    newEl.setAttribute(
      "style",
      `position: absolute; height: ${el.dimensions.height}px; width: ${el.dimensions.width}px; left: ${el.dimensions.x}px; top: ${el.dimensions.y}px; cursor: pointer; background-color: ${el.color}; z-index: 10;`
    );
    newEl.onclick = function() {
      code.value = el.code;
      code.name = el.id;
      code.style.visibility = "visible";
      submit.style.visibility = "visible";
      submit.onclick = () =>
        clickSubmit(el.id, el.answer, code.value);
      reset.style.visibility = "visible";
      reset.onclick = () => clickReset();
    };
    elements.push(newEl.id);
  }
}

function clickSubmit(id, answer, value) {
  console.log("---submit---");
  // console.log("id: ", id);
  // console.log("answer: ", strip(answer));
  // console.log("value: ", strip(value));
  console.log(strip(answer) === strip(value));
  // console.log(typeof answer);
  // console.log(typeof value);
}

function clickReset() {
  console.log("reset");
}

function strip(text) {
  let originalString = text;
  const replace = originalString.replace(
    /[\t\v\f\r\n \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/g,
    ""
  );
  console.log(replace);
  return replace;
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
