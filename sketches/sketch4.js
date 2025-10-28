// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {

  let startTime = -1;
  let totalTimeOfLine = 10 * 1000;
  let working = true;
  let newSegment = false;
  let segments = [];

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    // Create button
    myButton = p.createButton('Start');
    myButton.mousePressed(() => {
    // Button click handler
      startTime = p.millis();
    });
    modeButton = p.createButton('Mode: Working');
    modeButton.mousePressed(() => {
      if(working) {
        modeButton.html('Mode: Resting');
        working = false;
      } else {
        modeButton.html('Mode: Working');
        working = true;
      }
      newSegment = true;
    });
  };
  p.draw = function () {
    myButton.position(
      p.windowWidth / 2 - myButton.size().width / 2 - 8 - 50,
      p.windowHeight / 2 - 350 + 500 + 10
    );
    modeButton.position(
      p.windowWidth / 2 - myButton.size().width / 2 - 8 + 50,
      p.windowHeight / 2 - 350 + 500 + 10
    );

    p.background(200, 240, 200);
    drawTimeLine(totalTimeOfLine);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };


  // Record line progress based on timer
  function drawTimeLine(timerLength) {
    let timerMs;

    if(startTime === -1){
      timerMs = 0; // hasn't started yet
    } else {
      timerMs = p.millis() - startTime; // elapsed time
    }

    // Constrain elapsed time to timer length
    timerMs = p.constrain(timerMs, 0, timerLength);

    // Calculate progress ratio (0 to 1)
    let progress = timerMs / timerLength;

    // Define line position and size
    let lineX = p.windowWidth / 2 - 200; // start x
    let lineY = p.windowHeight / 2 + 200; // vertical position
    let lineWidth = 400; // full line width

    // Draw background line
    p.stroke(180);
    p.strokeWeight(8);
    p.line(lineX, lineY, lineX + lineWidth, lineY);


    // Draw progress line
    p.stroke(working ? 'green' : 'yellow');
    p.strokeWeight(8);
    p.line(p.windowWidth / 2 - 200, lineY, p.windowWidth / 2 - 200 + lineWidth * progress, lineY);



    segments.forEach((segment) => {
      p.stroke(segment.working ? 'green' : 'yellow');
      p.strokeWeight(8);
      p.line(segment.lineStart, lineY, segment.lineWidth, lineY);
    })


    // Draw marker
    p.fill('white'); // red marker
    p.noStroke();
    let markerX = lineX + lineWidth * progress;
    let markerY = lineY - 8;
    p.rect(markerX, markerY, 4, 16); // circle marker


    // Check if a line segment is finished
    if (newSegment) {
      // Add finished segment
      segments.unshift({working: !working, lineStart: lineX, lineWidth: lineX + lineWidth * progress});
      console.log(segments);
      newSegment = false;
    }
  }



});
