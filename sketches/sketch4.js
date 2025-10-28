// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {

  let startTime = -1;
  let minutesMax = 60;
  let totalTimeOfLine = minutesMax * 1000 * 60;
  let working = true;
  let newSegment = false;
  let segments = [];
  let pastLines = [];

  p.setup = function () {
    p.createCanvas(800, 800);
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
    p.background('lightgrey');
    myButton.position(
      800 / 2 - myButton.size().width / 2 - 8 - 50,
      800 / 2 - 350 + 500 + 10
    );
    modeButton.position(
      800 / 2 - myButton.size().width / 2 - 8 + 50,
      800 / 2 - 350 + 500 + 10
    );



    p.fill('black');
    p.strokeWeight(0);
    p.textSize(40);
    if(startTime !== -1) {
      p.text(msToTimeString(p.millis() - startTime), 800 / 2, 800/ 2);
    } else {
      p.text(msToTimeString(0), 800 / 2, 800/ 2);
    }
    drawTimeLine(totalTimeOfLine);
    drawPastLines()




  };
  p.windowResized = function () { p.resizeCanvas(800, 800); };

  //helper function written with AI
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

  function drawPastLines() {
    if(pastLines.length === 0) return;

    let baseX = 800 / 2;
    let baseY = 800 / 2 + 280; // start below main line
    let lineSpacing = 40; // vertical spacing between past lines

    p.fill(0);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Past Lines", baseX - 30, baseY - 45);

    pastLines.forEach((lineArray, index) => {
      let lineY = baseY + index * lineSpacing;

      lineArray.forEach(segment => {
        p.stroke(segment.working ? 'lightgreen' : 'lightblue');
        p.strokeWeight(8);
        p.line(segment.lineStart, lineY, segment.lineWidth, lineY);
        p.fill(0);
        p.strokeWeight(0);
        p.textSize(16);
        p.textAlign(p.CENTER, p.CENTER);

        let midX = (segment.lineWidth + (segment.lineWidth - segment.length)) / 2;
        let time = Math.floor(segment.duration / 1000  / 60 * 100) / 100;
        p.text(time, midX, lineY - 12);
      });
    });
  }


  // Record line progress based on timer
  function drawTimeLine(timerLength) {
    let timerMs;

    if(startTime === -1){
      timerMs = 0; // hasn't started yet
      newSegment = false;
    } else {
      timerMs = p.millis() - startTime; // elapsed time
    }


    // Constrain elapsed time to timer length
    timerMs = p.constrain(timerMs, 0, timerLength);

    // Calculate progress ratio (0 to 1)
    let progress = timerMs / timerLength;

    // Define line position and size
    let lineX = 800 / 2 - 200; // start x
    let lineY = 800 / 2 + 200; // vertical position
    let lineWidth = 400; // full line width

    // Draw background line
    p.stroke(180);
    p.strokeWeight(8);
    p.line(lineX, lineY, lineX + lineWidth, lineY);


    // Draw progress line
    p.stroke(working ? 'lightgreen' : 'lightblue');
    p.strokeWeight(8);
    p.line(800 / 2 - 200, lineY, 800 / 2 - 200 + lineWidth * progress, lineY);


    let prevDurations = 0;
    let prevLengths = 0;
    segments.forEach((segment) => {
      prevDurations += segment.duration;
      prevLengths += segment.length;
      let time = Math.floor(segment.duration / 1000  / 60 * 100) / 100;
      p.stroke(segment.working ? 'lightgreen' : 'lightblue');
      p.strokeWeight(8);
      p.line(segment.lineStart, lineY, segment.lineWidth, lineY);
      p.fill(0);
      p.strokeWeight(0);
      p.textSize(16);
      p.textAlign(p.CENTER, p.CENTER);

      let midX = (segment.lineWidth + (segment.lineWidth - segment.length)) / 2;
      p.text(time, midX, lineY - 15);
    })


    // Draw marker
    p.fill('white'); // red marker
    p.noStroke();
    let markerX = lineX + lineWidth * progress;
    let markerY = lineY - 8;
    p.rect(markerX, markerY, 4, 16); // circle marker

    // Draw labels at ends
    p.fill(0);
    p.textSize(16);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("0", lineX, lineY + 30);              // left end
    p.text(minutesMax, lineX + lineWidth, lineY + 30); // right end


    // Check if a line segment is finished
    if (newSegment && startTime !== -1) {
      // Add finished segment
      segments.unshift({working: !working, lineStart: lineX, lineWidth: lineX + lineWidth * progress, duration: timerMs - prevDurations, length: lineWidth * progress - prevLengths});
      console.log(segments);
      newSegment = false;
    }


    if(timerMs >= timerLength) {

      segments.unshift({working: working, lineStart: lineX, lineWidth: lineX + lineWidth * progress, duration: timerMs - prevDurations, length: lineWidth * progress - prevLengths});
      console.log(segments);
      pastLines.push(segments);
      segments = [];
      startTime = p.millis();
      newSegment = false;
    }
  }
});
