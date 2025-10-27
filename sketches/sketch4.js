// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  //zelda gamified studying thing where link battles a monster (assignment) and as time goes on both health goes down
  //press to take a break and heal
  //minutes spent = health goes down and attacks
  //health is the max ammount of time you can spend
  // cool animaiton if you finish hw early
  // health potion to do more work
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = function () {
    p.background(200, 240, 200);
    p.fill(30, 120, 40);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('HWK #4. C', p.width / 2, p.height / 2);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
