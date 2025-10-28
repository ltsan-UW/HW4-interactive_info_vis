// Instance-mode sketch for tab 3
//ideas:
  //zelda gamified studying thing where link battles a monster (assignment) and as time goes on both health goes down
  //press to take a break and heal
  //minutes spent = health goes down and attacks
  //health is the max ammount of time you can spend
  // cool animaiton if you finish hw early
  // health potion to do more work
registerSketch('sk3', function (p) {


  let startTime = -1;
  let workLength = 0.05 * 60 * 1000; //minutes to ms
  let restLength = 0.05 * 60 * 1000; //minutes to ms
  let restOn = false;


  let writing = p.loadImage('/sketches/assets/writing.webp');
  let coding = p.loadImage('/sketches/assets/coding.gif');
  let link = p.loadImage('/sketches/assets/link.gif');
  let linkReady = p.loadImage('/sketches/assets/link-ready.gif');
  let linkRest = p.loadImage('/sketches/assets/link-rest.gif');

  let character = link;
  let enemy = coding;



  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    // Create button
    myButton = p.createButton('Start');
    myButton.mousePressed(() => {
    // Button click handler
      startTime = p.millis();
    });
  };

  p.draw = function () {
    let midX = p.windowWidth / 2;
    let midY = p.windowHeight / 2

    myButton.position(
      p.windowWidth / 2 - myButton.size().width / 2 - 8,
      p.windowHeight / 2 - 350 + 500 + 10
    );

    p.background('darkgrey');
    p.fill('grey');
    p.rect(p.windowWidth / 2 - 300, p.windowHeight / 2 - 350, 600, 500);


    let statusText = "Ready...";
    if(startTime !== -1) {
      if(restOn) {
        statusText = "Resting...";
      } else {
        statusText = "Working!!";
      }
    }

    if(restOn) {
      drawTimer(restLength);
    } else {
      drawEnemy(coding, "INFO 474 HW4");
      drawTimer(workLength);
    }

    p.fill('black');
    p.textSize(38);
    p.textAlign(p.CENTER, p.TOP);
    p.text(statusText, p.windowWidth / 2, p.windowHeight / 2 - 350 + 40);

    drawCharacter();
  };



  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };


  function drawEnemy(enemy) {
    p.image(enemy, p.windowWidth / 2, p.windowHeight / 2 - 230, 200, 200);
    p.fill('black')
    p.textSize(18);
    p.text("INFO 474 HW4", p.windowWidth / 2 + 100, p.windowHeight / 2 - 20);
  }


  function drawCharacter() {
    if(startTime === -1) {
      character = linkReady;
    } else if(restOn) {
      character = linkRest;
    } else {
      character = link;
    }
    p.image(character, p.windowWidth / 2 - 250 - 100, p.windowHeight / 2 - 295, 500, 295);
  }





  function drawTimer(timerLength) {
    let timerMs = timerLength;
    if(startTime !== -1) {
      timerMs = startTime + timerLength- p.millis()
    }
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
    p.text(timerText, midX + barLength / 2 - 70, midY + 50);
    drawRoundedBar(midX - barLength / 2, midY + 10, barLength, 20, timerMs / timerLength);
  }



  //helper functions mostly written with AI
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

});


/*

  Images I do not own:

  link image owned by Nintendo:
  https://i.pinimg.com/originals/b0/87/53/b08753d58f327fe00490bb5cfa7fcf03.gif

  writing image upoloaded by @ehv-fernstudium on GIPHY.com
  https://giphy.com/stickers/ehv-ehv-fernstudium-europischerhochschulverbund-9udYDMLdVzBAFuWkmF

  coding gif uploaded by Zo_tov on GIFDB.com
  https://gifdb.com/gif/scrolling-up-green-system-coding-nxt2vg8bl6e4wbo1.html


*/