// Example 2
registerSketch('sk5', function (p) {

  const draftPlayerMap = new Map();
  const draftPlayerFree = new Set();

  let boardData;
  let draftData;

  let correctnessRange = 3;
  let rankRange = [1,30];

  let textColor = "black"
  let correctColor = "green"
  let incorrectColor = "red"
  let numbersTextSize = 14;
  let lineWeight = 2;
  let graphLength = 800;
  let graphHeight = 600;
  let graphPositionOffsetX = 200;
  let graphPositionOffsetY = 0;
  let sliderLength = graphLength / 2;

  let correctnessSlider;

  p.preload = function () {
    boardData = p.loadTable('sketches/hw5assets/ESPN-2024.csv', 'csv', 'header');
    draftData = p.loadTable('sketches/hw5assets/DRAFT-2024.csv', 'csv', 'header');
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    correctnessSlider = p.createSlider(0, 20, correctnessRange);
    correctnessSlider.style('width', sliderLength + "px");
  };


  p.draw = function () {
    p.background(250);
    let midWidth = p.windowWidth / 2;
    let midHeight = p.windowHeight / 2;

    let correctIncorrectSetArray = updateCorrectAndIncorrectPlayers();
    let correctPlayers = correctIncorrectSetArray[0];
    let incorrectPlayers = correctIncorrectSetArray[1];
    p.text("Correct Rankings: " + correctPlayers.size, midWidth - graphPositionOffsetX - 30, midHeight);
    p.text("Incorrect Rankings: " + incorrectPlayers.size, midWidth - graphPositionOffsetX - 30, midHeight - 40);


    correctnessRange = correctnessSlider.value();
    correctnessSlider.position(midWidth - sliderLength / 2, midHeight - graphHeight / 2);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("0", midWidth - sliderLength / 2 + 10, midHeight - graphHeight / 2 - 30);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("20", midWidth + sliderLength / 2, midHeight - graphHeight / 2 - 30);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("when the difference is less than " + correctnessRange, midWidth, midHeight - graphHeight / 2 - 20);




    let yStart = midHeight - graphHeight / 2 + graphPositionOffsetY;
    let yEnd = midHeight + graphHeight / 2 + graphPositionOffsetY;
    let distanceBetweenRanks = 3; // graphLength / number
    let x = midWidth - graphLength / distanceBetweenRanks + graphPositionOffsetX;
    let x2 = midWidth + graphLength / distanceBetweenRanks + graphPositionOffsetX;
    let textPixelLineOffset = 10;

    p.fill(textColor);
    p.textSize(numbersTextSize);
    p.textAlign(p.CENTER, p.CENTER);
    p.strokeWeight(lineWeight);


    let hoverData = [];

    for(let i = 0; i < rankRange[1]; i++) {

      let boardRank = boardData.getString(i, "Rank");

      let playerData = boardData.getRow(i);
      playerData = playerData.obj;
      let draftPosition = draftPlayerMap.get(playerData.Name);
      draftPlayerFree.delete(playerData.Name);


      let y = p.map(boardRank, rankRange[0], rankRange[1], yStart, yEnd);
      let y2 = p.map(draftPosition, rankRange[0], rankRange[1], yStart, yEnd);


      if(isCorrect(boardRank, draftPosition)) {
        p.stroke(correctColor);
        p.fill(correctColor);
      } else {
        p.stroke(incorrectColor);
        p.fill(incorrectColor);
      }

      if(draftPosition > rankRange[1]) {
        p.strokeWeight(lineWeight * 3);
        p.line(x + textPixelLineOffset + 2, y, x + textPixelLineOffset + 2, y);
        p.noStroke();
        p.textSize(numbersTextSize * 0.7);
        p.text(draftPosition, x + textPixelLineOffset + 12, y);
        p.textSize(numbersTextSize);
      } else {
        p.line(x + textPixelLineOffset, y, x2 - textPixelLineOffset, y2);
      }
      p.noStroke();
      p.strokeWeight(lineWeight);

      p.fill(textColor);
      p.text(i + 1, x, y);
      p.text(i + 1, x2, y);

      let d = pointLineDistance(p.mouseX, p.mouseY, x + textPixelLineOffset, y, x2 - textPixelLineOffset, y2);
      if (d < 4) {
        hoverData = [playerData.Name, boardRank, draftPosition];
      }
    }

    draftPlayerFree.forEach(player => {
      let draftPosition = draftPlayerMap.get(player);
      let y = p.map(draftPosition, rankRange[0], rankRange[1], yStart, yEnd);
      p.fill(incorrectColor);
      p.textSize(numbersTextSize * 0.7);
      p.textSize(numbersTextSize);
      p.fill(textColor);
      p.stroke(incorrectColor);
      p.strokeWeight(lineWeight * 3);
      p.line(x2 - textPixelLineOffset - 2, y, x2 - textPixelLineOffset - 2, y);
      p.strokeWeight(lineWeight);
      p.noStroke();
      let d = pointLineDistance(p.mouseX, p.mouseY, x2 - textPixelLineOffset - 2, y, x2 - textPixelLineOffset - 2, y);
      if (d < 4) {
        hoverData = [player, "N/A", draftPosition];
      }
    });


    if(hoverData.length !== 0) {
      let box = [200, 100];
      p.fill("white");
      p.stroke("lightgrey");
      p.rect(p.mouseX - box[0] / 2, p.mouseY - 20 - box[0] / 2, box[0], box[1]);
      p.line(p.mouseX, p.mouseY, p.mouseX, p.mouseY - 20);
      p.noStroke();
      p.fill(textColor);
      p.text(hoverData[0], p.mouseX, p.mouseY - 20 - box[0] / 2 + 15);
      p.text("Rank: " + hoverData[1], p.mouseX - 40, p.mouseY - 20 - box[0] / 2 + 40);
      p.text("Pick: " + hoverData[2], p.mouseX + 40, p.mouseY - 20 - box[0] / 2 + 40);
    }

  }


  function isCorrect(rank1, rank2) {
    rank1 = Number(rank1);
    rank2 = Number(rank2);
    return (rank1 + correctnessRange >= rank2 && rank1 - correctnessRange <= rank2)
  }

  function updateCorrectAndIncorrectPlayers() {
    let correctPlayers = new Set();
    let incorrectPlayers = new Set();
    for(let i = 0; i < draftData.getRowCount(); i++) {
      draftPlayerMap.set(draftData.getString(i, "Player"), draftData.getString(i, "Pk"));
      if(i < rankRange[1]) {
        draftPlayerFree.add(draftData.getString(i, "Player"));
      }
    }

    const seenPlayers = new Set();
    for(let i = rankRange[0] - 1; i < rankRange[1]; i++) {
      let playerName = boardData.getString(i, "Name");
      let playerRank = boardData.getString(i, "Rank");
      seenPlayers.add(playerName);
      if(isCorrect(draftPlayerMap.get(playerName), playerRank)) {
        correctPlayers.add(playerName);
      } else {
        incorrectPlayers.add(playerName);
      }
    }
    draftPlayerFree.forEach(player => {
      if(!seenPlayers.has(player)) {
        incorrectPlayers.add(player);
      }});
      return [correctPlayers, incorrectPlayers];
  }

  //written with AI
  function pointLineDistance(px, py, x1, y1, x2, y2) {
    let A = px - x1;
    let B = py - y1;
    let C = x2 - x1;
    let D = y2 - y1;

    let dot = A * C + B * D;
    let len_sq = C * C + D * D;
    let param = len_sq != 0 ? dot / len_sq : -1;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    let dx = px - xx;
    let dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }



  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
