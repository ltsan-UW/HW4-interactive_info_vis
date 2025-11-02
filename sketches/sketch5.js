
// Ideas:
//  - NBA headshots next to the ranking for visual hook
//  - Big social media headline text
//  - biggest change / drop
//  - make the sources a list that shows the bar graph, accuracy, % for each, sorted by the most accurate
//  - commonly incorrect players, or commonly missed players maybe?
//  - fix right side out of range like AJ Johnson should show up
registerSketch('sk5', function (p) {

  const draftPlayerMap = new Map();
  const draftPlayerFree = new Set();

  let boardPlayerMap = new Map();

  let boardData = null;
  let draftData = null;

  const boardDataMap = new Map();

  let correctnessRange = 3;
  let rankRange = [1, 35];

  let textColor = "black"
  let correctColor = "green"
  let incorrectColor = "red"
  let missedColor = "darkred"
  let numbersTextSize = 14;
  let lineWeight = 2;
  let graphLength = 400;
  let graphHeight = 600;
  let graphPositionOffsetX = 0;
  let graphPositionOffsetY = 140;
  let sliderLength = 200;

  let correctnessSlider;
  let rankSourceSelect;


  p.preload = function () {
    let ESPNB = p.loadTable('sketches/hw5assets/ESPN-BOARD-2024.csv', 'csv', 'header');
    let SNB = p.loadTable('sketches/hw5assets/SN-BOARD-2024.csv', 'csv', 'header');
    let TRB = p.loadTable('sketches/hw5assets/TR-BOARD-2024.csv', 'csv', 'header');
    let TRM = p.loadTable('sketches/hw5assets/TR-MOCK-2024.csv', 'csv', 'header');
    let ESPNM = p.loadTable('sketches/hw5assets/ESPN-MOCK-2024.csv', 'csv', 'header');
    let SNM = p.loadTable('sketches/hw5assets/SN-MOCK-2024.csv', 'csv', 'header');
    let TANKM = p.loadTable('sketches/hw5assets/TANK-MOCK-2024.csv', 'csv', 'header');
    boardDataMap.set("ESPN - Mock Draft", ESPNM);
    boardDataMap.set("SportingNews - Mock Draft", SNM);
    boardDataMap.set("The Ringer - Mock Draft", TRM);
    boardDataMap.set("Tankathon - Mock Draft", TANKM);
    // boardDataMap.set("ESPN - Top Players", ESPNB);
    // boardDataMap.set("SportingNews - Top Players", SNB);
    // boardDataMap.set("The Ringer - Top Players", TRB);
    boardData = ESPNM;
    draftData = p.loadTable('sketches/hw5assets/DRAFT-2024.csv', 'csv', 'header');
    console.log("draftData loaded in preload");


    rankSourceSelect = p.createSelect();
    rankSourceSelect.style('width', '150px');

    boardDataMap.keys().forEach((source) => {
      rankSourceSelect.option(source);
    })

    rankSourceSelect.changed(() => {
      let value = rankSourceSelect.value();
      boardData = boardDataMap.get(value);
      boardPlayerMap = createBoardMap(boardData);
    });
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, graphHeight + 250);

    correctnessSlider = p.createSlider(0, 20, correctnessRange);
    correctnessSlider.style('width', sliderLength + "px");


    p.textFont('lato');

  };


  p.draw = function () {
    p.background(250);
    let midWidth = p.windowWidth / 2;
    let fourthWidth = p.windowWidth / 2 - graphLength / 2;
    let midHeight = p.windowHeight / 2;



    if (draftData === null || boardData === null || draftData.getRowCount() === 0 || boardData.getRowCount() === 0) {
      console.log("loading data");
    } else {

      if (boardPlayerMap.size === 0) {
        boardPlayerMap = createBoardMap(boardData);
      }

      //title
      p.textStyle(p.BOLD);
      p.textSize(30);
      p.text("2024 NBA Draft: Media Rankings vs. Draft Positions", midWidth, 40);
      p.textSize(22);
      p.text("Can we trust sports media?", midWidth, 75);
      p.textSize(16);
      p.textStyle(p.NORMAL);

      let infoY = 150;
      let playerSets = getPlayerSets(boardData);

      let correctPlayers = playerSets[0];
      let incorrectPlayers = playerSets[1];
      let missedPlayers = playerSets[2];
      let accuracy = playerSets[3];
      let percentage = playerSets[4];
      p.text("Correct Players: " + correctPlayers.size, fourthWidth, infoY + 30);
      p.text("Incorrect Players: " + incorrectPlayers.size, fourthWidth, infoY + 50);
      p.text("Missed Players: " + missedPlayers.size, fourthWidth, infoY + 70);
      p.textSize(25);
      p.textStyle(p.ITALIC);
      p.text(percentage + "% of guesses are correct", fourthWidth, infoY)

      //drawSourceStats(fourthWidth, 140 + infoY, barHeight, playerSets, "ESPN - Mock Draft");


      let playerSetsMap = new Map();
      boardDataMap.keys().forEach((option) => {
        let playerSets = getPlayerSets(boardDataMap.get(option));
        playerSetsMap.set(option, playerSets);
      })

      //sort by accuracy
      let sortBy = 4;
      let sortedplayerSetsMap = playerSetsMap;
      //let sortedplayerSetsMap = new Map([...playerSetsMap.entries()].sort((a, b) => - a[1][sortBy] + b[1][sortBy]));

      let barHeight = 35;
      let ySpacing = 60
      sortedplayerSetsMap.entries().forEach((entry) => {
        let option = entry[0];
        let playerSets = entry[1];
        let isSelected = (option === rankSourceSelect.value());
        drawSourceStats(fourthWidth, 40 + ySpacing + infoY, barHeight, playerSets, option, isSelected);
        ySpacing += 60;
      })

      let interactY = 750;
      correctnessRange = correctnessSlider.value();
      correctnessSlider.position(fourthWidth - correctnessSlider.width / 2, interactY);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text("0", fourthWidth - sliderLength / 2 + 10, interactY - 30);
      p.textAlign(p.LEFT, p.CENTER);
      p.text("20", fourthWidth + sliderLength / 2, interactY - 30);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("when the difference is less than " + correctnessRange, fourthWidth, interactY - 70);

      p.text("Media Source", fourthWidth, interactY - 130);
      rankSourceSelect.position(fourthWidth - rankSourceSelect.width / 2, interactY - 60);


      let yStart = graphPositionOffsetY;
      let yEnd = graphHeight + graphPositionOffsetY;
      let x = midWidth + graphPositionOffsetX;
      let x2 = midWidth + graphLength + graphPositionOffsetX;
      let textPixelLineOffset = 12;

      p.fill(textColor);
      p.textSize(numbersTextSize);
      p.textAlign(p.CENTER, p.CENTER);
      p.strokeWeight(lineWeight);
      p.text("Media Rankings", x, yStart - 20);
      p.text("Draft Positions", x2, yStart - 20);


      let hoverData = [];

      for (let i = 0; i < rankRange[1]; i++) {

        let boardRank = boardData.getString(i, "Rank");

        let playerData = boardData.getRow(i);
        playerData = playerData.obj;
        let draftPosition = "N/A";
        if (draftPlayerMap.has(playerData.Name)) {
          draftPosition = draftPlayerMap.get(playerData.Name);
        }
        draftPlayerFree.delete(playerData.Name);


        let y = p.map(boardRank, rankRange[0], rankRange[1], yStart, yEnd);
        let y2 = p.map(draftPosition, rankRange[0], rankRange[1], yStart, yEnd);


        if (isCorrect(boardRank, draftPosition)) {
          p.stroke(correctColor);
          p.fill(correctColor);
        } else {
          p.stroke(incorrectColor);
          p.fill(incorrectColor);
        }

        let d;
        if (draftPosition === "N/A" || draftPosition > rankRange[1]) { //draw dot with number if out of range
          p.strokeWeight(lineWeight * 3);
          drawDot(x + textPixelLineOffset + 2, y);
          p.noStroke();
          if (draftPosition !== "N/A") {
            p.textSize(numbersTextSize * 0.7);
            p.text(draftPosition, x + textPixelLineOffset + 12, y);
            p.textSize(numbersTextSize);
          }
          d = pointLineDistance(p.mouseX, p.mouseY, x + textPixelLineOffset, y, x + textPixelLineOffset, y);
        } else {
          d = pointLineDistance(p.mouseX, p.mouseY, x + textPixelLineOffset, y, x2 - textPixelLineOffset, y2);
          p.line(x + textPixelLineOffset, y, x2 - textPixelLineOffset, y2);
        }
        p.noStroke();
        p.strokeWeight(lineWeight);

        if (d < 4) {
          hoverData = [playerData.Name, boardRank, draftPosition];
        }

        p.fill(textColor);
        p.text(i + 1, x, y);
        if (draftData.getRowCount() > i) {
          p.text(i + 1, x2, y);
        }
      }

      draftPlayerFree.forEach(player => {
        let boardRank = "N/A";
        let draftPosition = draftPlayerMap.get(player);
        let y = p.map(draftPosition, rankRange[0], rankRange[1], yStart, yEnd);

        if (boardPlayerMap.has(player)) {
          boardRank = boardPlayerMap.get(player);
          if (isCorrect(boardRank, draftPosition)) {
            p.stroke(correctColor);
            p.fill(correctColor);
          } else {
            p.stroke(incorrectColor);
            p.fill(incorrectColor);
          }
          drawDot(x2 - textPixelLineOffset - 2, y);
          p.noStroke();
          p.textSize(numbersTextSize * 0.7);
          p.text(boardRank, x2 - textPixelLineOffset - 12, y);
          p.textSize(numbersTextSize);
        } else {
          p.fill(missedColor);
          p.stroke(missedColor);
          drawDot(x2 - textPixelLineOffset - 2, y);
        }
        p.noStroke();
        p.fill(textColor);

        let d = pointLineDistance(p.mouseX, p.mouseY, x2 - textPixelLineOffset - 2, y, x2 - textPixelLineOffset - 2, y);
        if (d < 4) {
          hoverData = [player, boardRank, draftPosition];
        }
      });


      if (hoverData.length !== 0) {
        drawHoverBox(hoverData);
      }
    }

  }

  function drawDot(x, y) {
    p.strokeWeight(lineWeight * 3);
    p.line(x, y, x, y);
    p.strokeWeight(lineWeight);
  }

  function createBoardMap(boardData) {
    let map = new Map();
    for (let i = 0; i < boardData.getRowCount(); i++) {
      let row = boardData.getRow(i);
      row = row.obj;
      map.set(row.Name, row.Rank);
    }
    return map;
  }

  function drawSourceStats(x, y, barHeight, playerSets, sourceName, isSelected) {
    let nameParts = sourceName.split(" - ");
    let correctPlayers = playerSets[0];
    let incorrectPlayers = playerSets[1];
    let missedPlayers = playerSets[2];
    let accuracy = playerSets[3];
    let percentage = playerSets[4];
    p.textStyle(p.NORMAL);
    p.textSize(16);
    drawBarGraph(x, y + 3, 100, barHeight, missedPlayers, incorrectPlayers, correctPlayers, rankRange[1] + 5);
    p.textSize(20);
    p.text(nameParts[0], x - 180, y + barHeight / 3);
    p.textSize(14);
    p.text("+/- " + accuracy, x + 140, y + 8);
    p.text(percentage + "%", x + 140, y + barHeight - 2);
    p.text(nameParts[1], x - 180, y + barHeight - 2);
    if (isSelected) {
      p.rect(x - 260, y + 3, 2, barHeight);
      p.text("selected", x - 260 - 40, y + barHeight / 2);
    }
  }

  function drawHoverBox(hoverData) {
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

  function drawBarGraph(x, y, length, height, miss, inc, cor, max) {
    // p.fill("white");
    // p.stroke("black");
    // p.rect(x - length, y - 1, length * 2, height + 2);
    // p.noStroke();
    p.textSize(14);
    let correctBarLength = p.map(cor.size, 0, max, 0, length);
    let incorrectBarLength = p.map(inc.size, 0, max, 0, length);
    let missingBarLength = p.map(miss.size, 0, max, 0, length);
    p.fill("green");
    p.rect(x + 1, y, correctBarLength, height);
    p.text(cor.size, x + correctBarLength + 12, y + height / 2);
    p.fill("red");
    p.rect(x - incorrectBarLength - 1, y, incorrectBarLength, height);
    p.text(inc.size, x - incorrectBarLength - missingBarLength - 1 - 12, y + height / 4);
    p.fill("darkred");
    p.rect(x - incorrectBarLength - missingBarLength - 1, y, missingBarLength, height);
    p.text("+" + miss.size, x - incorrectBarLength - missingBarLength - 1 - 12, y + height / 4 * 3);
    p.fill("black");
    p.rect(x - 1, y, 2, height);
    p.textSize(16);
  }

  function isCorrect(rank1, rank2) {
    rank1 = Number(rank1);
    rank2 = Number(rank2);
    return (rank1 + correctnessRange >= rank2 && rank1 - correctnessRange <= rank2)
  }

  function getPlayerSets(source) {
    let guessMap = createBoardMap(source);
    let correctPlayers = new Set();
    let incorrectPlayers = new Set();
    let missedPlayers = new Set();
    let accuracy = 0;
    if (draftPlayerMap.size === 0) {
      for (let i = 0; i < draftData.getRowCount(); i++) {
        draftPlayerMap.set(draftData.getString(i, "Player"), draftData.getString(i, "Pk"));
        if (i < rankRange[1]) {
          draftPlayerFree.add(draftData.getString(i, "Player"));
        }
      }
    }

    for (let i = rankRange[0] - 1; i < rankRange[1]; i++) {
      let playerName = source.getString(i, "Name");
      let playerRank = source.getString(i, "Rank");
      let draftRank = draftPlayerMap.get(playerName);
      if (!draftPlayerMap.has(playerName)) {
        draftRank = null;
        incorrectPlayers.add(playerName);
      } else {
        accuracy += Math.abs(draftRank - playerRank);
        if (isCorrect(draftRank, playerRank)) {
          correctPlayers.add(playerName);
        } else {
          incorrectPlayers.add(playerName);
        }
      }
    }
    draftPlayerFree.forEach(player => {
      if (!guessMap.has(player)) {
        missedPlayers.add(player);
      } else {
        let playerRank = guessMap.get(player);
        let draftRank = draftPlayerMap.get(player);
        accuracy += Math.abs(draftRank - playerRank);
        if (isCorrect(draftRank, playerRank)) {
          correctPlayers.add(player);
        } else {
          incorrectPlayers.add(player);
        }
      }
    });
    accuracy /= rankRange[1];
    let percentage = correctPlayers.size / (correctPlayers.size + incorrectPlayers.size + missedPlayers.size);

    accuracy = Math.floor(accuracy * 10) / 10;
    percentage = Math.floor(percentage * 100);
    return [correctPlayers, incorrectPlayers, missedPlayers, accuracy, percentage];
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
