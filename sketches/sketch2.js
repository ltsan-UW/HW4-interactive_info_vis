// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {

  let workTime = 0.5;
  let restTime = 0.4;
  let totalTime = workTime + restTime;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
  };
  p.draw = function () {
    p.background(220);
    p.fill(100, 150, 240);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('HWK #4. A', p.width / 2, p.height / 2);
    p.ellipse(p.mouseX, p.mouseY - 50, 50,50);

    console.log(Math.floor(p.millis() / 1000 / 60));
    drawPie(p.windowWidth / 2, p.windowHeight / 2, 150, workTime / totalTime, p.millis() / 1000 / 60/ totalTime, 'green', 'yellow');
  };

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };


  function drawPie(x, y, radius, percent, linePercent, color1, color2) {
    percent = p.constrain(percent, 0, 1);

    let angle1 = percent * 360;

    // Draw the two slices
    p.noStroke();
    p.fill(color1);
    p.arc(x, y, radius * 2, radius * 2, 0, angle1, p.PIE);

    p.fill(color2);
    p.arc(x, y, radius * 2, radius * 2, angle1, 360, p.PIE);

    let markerAngle = linePercent * 360;
    let markerRad = p.radians(markerAngle);
    let lineX = x + Math.cos(markerRad) * radius;
    let lineY = y + Math.sin(markerRad) * radius;
    p.stroke(0);
    p.strokeWeight(3);
    p.line(x, y, lineX, lineY);
  }
});
