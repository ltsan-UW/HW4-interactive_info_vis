// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {


  let startTime = -1;
  let workLength = 0.05 * 60 * 1000; //minutes to ms
  let restLength = 0.05 * 60 * 1000; //minutes to ms
  let restOn = false;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    // Create button
    myButton = p.createButton('Click me');
    myButton.mousePressed(() => {
    // Button click handler
      startTime = p.millis();
    });
  };

  p.draw = function () {

    centerButton(myButton)

    p.background('white');

    if(restOn) {
      drawTimer(restLength);
    } else {
      drawTimer(workLength);
    }
  };







  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };

  function drawTimer(timerLength) {
    let timerMs = timerLength;
    if(startTime !== -1) {
      timerMs = startTime + timerLength- p.millis()
    }
    console.log(timerMs);
    if(timerMs <= 0) {
      restOn = !restOn;
      startTime = p.millis()
    }
    let midX = p.windowWidth / 2;
    let midY = p.windowHeight / 2
    p.textAlign(p.CENTER, p.CENTER);

    let barLength = 400;
    p.fill('black');
    p.textSize(16);
    let timerText = msToTimeString(timerMs) + " / " + msToTimeString(timerLength);
    p.text(timerText, midX + barLength / 2 - 70, midY + 40);
    drawRoundedBar(midX - barLength / 2, midY, barLength, 20, timerMs / timerLength);
  }



  //helper functions
  function msToTimeString(ms) {
    // Prevent negative values
    if (ms < 0) ms = 0;

    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    // Format as HH:MM:SS
    return (
      String(hours).padStart(2, '0') + ':' +
      String(minutes).padStart(2, '0') + ':' +
      String(seconds).padStart(2, '0')
    );
  }

  function drawRoundedBar(x, y, w, h, percent) {
    percent = p.constrain(percent, 0, 1);

    // Background bar (gray)
    p.fill(220);
    p.rect(x, y, w, h, h/2); // h/2 gives circular ends

    // Foreground fill (colored)
    let fillWidth;
    if(restOn) {
      fillWidth = w - percent * w;
      p.fill('lightblue');
    } else {
      fillWidth = percent * w;
      p.fill('lightgreen');
    }
    fillWidth = p.constrain(fillWidth, h, w);

    // Draw fill from RIGHT to LEFT
    p.rect(x, y, fillWidth, h, h/2);
  }

  function centerButton(button) {
    button.position(
      p.windowWidth / 2 - button.size().width / 2 - 8,
      p.windowHeight / 2 - button.size().height / 2 + 200
    );
  }

});


/*

  background image:
  https://v3x3d.itch.io/mystic-chambers


*/