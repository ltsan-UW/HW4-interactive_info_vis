
// Ideas:
//  - NBA headshots next to the ranking for visual hook
//  - Big social media headline text
//  - biggest change / drop
//  - make the sources a list that shows the bar graph, accuracy, % for each, sorted by the most accurate
//  - commonly incorrect players, or commonly missed players maybe?
//  - fix right side out of range like AJ Johnson should show up
registerSketch('sk5', function (p) {

  const draftPlayerMap = new Map();

  let sourceToBoardPlayerMap = new Map();

  let boardDataName = null;
  let boardData = null;
  let draftData = null;

  const boardDataMap = new Map();

  let correctnessRange = 3;
  let rankRange = [1, 30];

  let textColor = "black"
  let correctColor = "green"
  let incorrectColor = "red"
  let missedColor = "darkred"
  let backgroundColor = "beige";

  let numbersTextSize = 14;
  let lineWeight = 2;
  let graphLength = 400;
  let graphHeight = 550;
  let graphPositionOffsetX = 100;
  let graphPositionOffsetY = 155;
  let sliderLength = 200;

  let correctnessSlider;


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
    boardDataName = "ESPN - Mock Draft";
    draftData = p.loadTable('sketches/hw5assets/DRAFT-2024.csv', 'csv', 'header');
    console.log("draftData loaded in preload");

  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, graphHeight + 250);

    correctnessSlider = p.createSlider(0, 18, correctnessRange);
    correctnessSlider.style('width', sliderLength + "px");


    p.textFont('lato');

  };


  p.draw = function () {
    p.background(backgroundColor);
    let midWidth = p.windowWidth / 2;
    let fourthWidth = p.windowWidth / 2 - graphLength / 2;
    let midHeight = p.windowHeight / 2;



    if (draftData === null || boardData === null || draftData.getRowCount() === 0 || boardData.getRowCount() === 0) {
      console.log("loading data");
    } else {

      //make source -> player -> rank map, after data is loaded since preload doesnt work for some reason
      if(sourceToBoardPlayerMap.size === 0) {
        boardDataMap.keys().forEach((sourceName) => {
          let currData = boardDataMap.get(sourceName);
          let newMap = createBoardMap(currData);
          sourceToBoardPlayerMap.set(sourceName, newMap);
        });
      }

      //title
      p.textStyle(p.BOLD);
      p.textSize(30);
      p.text("2024 NBA Draft: Media Predictions vs. Reality", midWidth, 40);
      p.textSize(22);
      p.text("Can we trust sports media?", midWidth, 75);
      p.textSize(16);
      p.textStyle(p.NORMAL);


      let infoY = 120;
      //playerSets contains [correctPlayers, incorrectPlayers, missedPlayers, accuracy, percentage]

      let playerSetsMap = new Map();
      boardDataMap.keys().forEach((option) => {
        let playerSets = getPlayerSets(boardDataMap.get(option));
        playerSetsMap.set(option, playerSets);
      })

      //sort by accuracy
      let sortBy = 4;
      let sortedplayerSetsMap = playerSetsMap; //no sorting
      //let sortedplayerSetsMap = new Map([...playerSetsMap.entries()].sort((a, b) => - a[1][sortBy] + b[1][sortBy]));

      let sourcesY = 350;
      let barHeight = 10;
      let ySpacing = 50;
      let startSpacing = ySpacing;
      let totalStats = [0, 0, 0, 0, 0];
      p.textSize(18)
      p.text("Media Outlets", fourthWidth, sourcesY + ySpacing / 2 + infoY)
      sortedplayerSetsMap.entries().forEach((entry) => {
        let option = entry[0];
        let playerSets = entry[1];
        for (let i = 0; i < playerSets.length; i++) {
          if (playerSets[i] instanceof Map || playerSets[i] instanceof Set) {
            totalStats[i] += playerSets[i].size;
          } else {
            totalStats[i] += playerSets[i];
          }
        }
        let isSelected = (option === boardDataName);
        drawSourceStats(fourthWidth, sourcesY + startSpacing + infoY, barHeight, playerSets, option, isSelected);
        startSpacing += ySpacing;
      })


      let correctPlayers = totalStats[0];
      let incorrectPlayers = totalStats[1];
      let missedPlayers = totalStats[2];
      let accuracy = Math.floor(totalStats[3] / sortedplayerSetsMap.size * 10) / 10;
      let percentage = totalStats[4] / sortedplayerSetsMap.size;
      let totalPlayers = totalStats[1] + totalStats[2] + totalStats[0];
      let legendY = 29;
      let legendX = 260;
      p.textAlign(p.LEFT, p.CENTER);
      p.fill(correctColor);
      p.text("Correct Players: " + correctPlayers + " / " + totalPlayers, fourthWidth - legendX, infoY + legendY + 40);
      p.fill(incorrectColor);
      p.text("Incorrect Players: " + incorrectPlayers + " / " + totalPlayers, fourthWidth - legendX, infoY + legendY + 60);
      p.fill(missedColor);
      p.text("Missed Players: " + missedPlayers + " / " + totalPlayers, fourthWidth - legendX, infoY + legendY + 80);
      p.fill('black');
      p.text("Average Accuracy: ± " + accuracy, fourthWidth - legendX, infoY + legendY + 110);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(20);
      p.textStyle(p.ITALIC);
      p.text(percentage + "% of total guesses are correct", fourthWidth, infoY)
      p.textStyle(p.NORMAL);
      p.textSize(16);

      let bigGraphLength = 220;
      drawBigBarGraph(midWidth - 200 - bigGraphLength / 2, infoY + 27, bigGraphLength, bigGraphLength, missedPlayers, incorrectPlayers, correctPlayers, totalPlayers)




      let interactY = infoY + 350;
      correctnessRange = correctnessSlider.value();
      correctnessSlider.position(fourthWidth - correctnessSlider.width / 2, interactY + 10);
      p.textSize(14);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text("0", fourthWidth - sliderLength / 2 + 10, interactY - 20);
      p.textAlign(p.LEFT, p.CENTER);
      p.text("18", fourthWidth + sliderLength / 2 - 10, interactY - 20);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(15);
      p.text("Correctness Range: ± " + correctnessRange + " picks", fourthWidth, interactY - 75);
      p.textSize(12);
      let guess = 15;
      let leftGuess = Math.max(1, guess - correctnessRange);
      let rightGuess = guess + correctnessRange;
      if(correctnessRange === 0) {
        p.text("(A guess of " + guess + " should be picked at " + guess + ")", fourthWidth, interactY - 58);
      } else {
        p.text("(A guess of " + guess + " should be between picks " + (leftGuess) + " and " + (rightGuess) + ")", fourthWidth, interactY - 58);
      }


      let yStart = graphPositionOffsetY;
      let yEnd = graphHeight + graphPositionOffsetY;
      let x = midWidth + graphPositionOffsetX;
      let x2 = midWidth + graphLength + graphPositionOffsetX;
      let textPixelLineOffset = 12;

      p.fill(textColor);
      p.textAlign(p.CENTER, p.CENTER);
      p.strokeWeight(lineWeight);
      p.textSize(18);
      p.text(boardDataName.split(" - ")[0], (x + x2) / 2, infoY);
      p.textSize(numbersTextSize);
      p.text("Media Picks", x, yStart - 20);
      p.text("NBA Picks", x2, yStart - 20);


      let hoverData = [];


      let draftPlayerFree = resetDraftPlayerFree();
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
            p.textSize(numbersTextSize * 0.9);
            p.text(draftPosition, x + textPixelLineOffset + 15, y + 1);
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
        let currentBoardPlayerMap = sourceToBoardPlayerMap.get(boardDataName);
        if (currentBoardPlayerMap.has(player)) {
          boardRank = currentBoardPlayerMap.get(player);
          if (isCorrect(boardRank, draftPosition)) {
            p.stroke(correctColor);
            p.fill(correctColor);
          } else {
            p.stroke(incorrectColor);
            p.fill(incorrectColor);
          }
          drawDot(x2 - textPixelLineOffset - 2, y);
          p.noStroke();
          p.textSize(numbersTextSize * 0.9);
          p.text(boardRank, x2 - textPixelLineOffset - 15, y + 1);
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

  function resetDraftPlayerFree() {
      //reset draftplayerfree set
      let set = new Set();
      for (let i = 0; i < rankRange[1]; i++) {
        set.add(draftData.getString(i, "Player"));
      }
      return set;
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
    let height = 30;
    let nameParts = sourceName.split(" - ");
    let correctPlayers = playerSets[0];
    let incorrectPlayers = playerSets[1];
    let missedPlayers = playerSets[2];
    let accuracy = playerSets[3];
    let percentage = playerSets[4];
    const rectX = x - 240;
    const rectY = y - 2;
    const rectW = 440;
    const rectH = height + 10;
    if (isSelected) {
      p.noStroke();
      p.fill('lightgrey')
      p.rect(rectX, rectY, rectW, rectH);
      p.fill('black');
      p.rect(x - 240, y - 2, 2, height + 10);
    } else {
        if (p.mouseIsPressed) {
          if (p.mouseX > rectX && p.mouseX < rectX + rectW &&
              p.mouseY > rectY && p.mouseY < rectY + rectH) {
            boardData = boardDataMap.get(sourceName);
            boardDataName = sourceName;
          }
        }
    }
    p.textStyle(p.NORMAL);
    p.textSize(14);
    drawBarGraph(x, y - 2 + height / 2, 100, barHeight, missedPlayers, incorrectPlayers, correctPlayers, rankRange[1] + 5);
    p.textSize(16);
    p.text(nameParts[0], x - 180, y + height / 3);
    p.textSize(12);
    p.text("± " + accuracy, x + 140, y + 12);
    p.text(percentage + "%", x + 140, y + height - 6);
    p.text(nameParts[1], x - 180, y + height - 2);
  }

  function drawHoverBox(hoverData) {
    let box = [200, 80];
    p.fill("white");
    p.stroke("lightgrey");
    p.rect(p.mouseX - box[0] / 2, p.mouseY - box[0] / 2, box[0], box[1]);
    p.line(p.mouseX, p.mouseY, p.mouseX, p.mouseY - 20);
    p.noStroke();
    p.fill(textColor);
    p.textStyle(p.BOLD);
    p.textSize(16);
    p.text(hoverData[0], p.mouseX, p.mouseY - box[0] / 2 + 15);
    p.textSize(13);
    p.textStyle(p.NORMAL);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("Media Pick: " + hoverData[1], p.mouseX - 90, p.mouseY - box[0] / 2 + 40);
    p.text("Draft Pick: " + hoverData[2], p.mouseX - 90, p.mouseY + 20 - box[0] / 2 + 40);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Difference:", p.mouseX + 60, p.mouseY - box[0] / 2 + 40);
    p.text(Math.abs(hoverData[1] - hoverData[2]), p.mouseX + 60, p.mouseY + 20 - box[0] / 2 + 40);
  }

  function drawBarGraph(x, y, length, height, miss, inc, cor, max) {
    // p.fill("white");
    // p.stroke("black");
    // p.rect(x - length, y - 1, length * 2, height + 2);
    // p.noStroke();
    p.textSize(12);
    let correctBarLength = p.map(cor.size, 0, max, 0, length);
    let incorrectBarLength = p.map(inc.size, 0, max, 0, length);
    let missingBarLength = p.map(miss.size, 0, max, 0, length);
    p.fill(correctColor);
    p.rect(x + 1, y, correctBarLength, height);
    p.text(cor.size, x + correctBarLength + 12, y + height / 2);
    if (miss.size !== 0) {
      p.fill(incorrectColor);
      p.rect(x - incorrectBarLength - 1, y, incorrectBarLength, height);
      p.text(inc.size, x - incorrectBarLength - missingBarLength - 1 - 12, y);
      p.fill(missedColor);
      p.rect(x - incorrectBarLength - missingBarLength - 1, y, missingBarLength, height);
      p.textSize(10);
      p.text("+" + miss.size, x - incorrectBarLength - missingBarLength - 1 - 12, y  + 14);
    } else {
      p.fill(incorrectColor);
      p.rect(x - incorrectBarLength - 1, y, incorrectBarLength, height);
      p.text(inc.size, x - incorrectBarLength - missingBarLength - 1 - 12, y + height / 2);
    }
    p.fill(textColor);
    p.rect(x - 1, y, 2, height);
    p.textSize(16);
  }

  // function drawBigBarGraph(x, y, length, height, miss, inc, cor, max) {

  //   // p.textSize(14);
  //   // let correctBarLength = p.map(cor, 0, max, 0, length);
  //   // let incorrectBarLength = p.map(inc, 0, max, 0, length);
  //   // let missingBarLength = p.map(miss, 0, max, 0, length);
  //   // p.fill("black");
  //   // p.rect(x - 1, y, 2, height);
  //   // if(miss !== 0) {
  //   //   p.fill("red");
  //   //   p.rect(x + 1, y, incorrectBarLength, height);
  //   //   p.text(inc, x + correctBarLength - missingBarLength - 1 - 12, y + height / 4);
  //   //   p.fill("darkred");
  //   //   p.rect(x + incorrectBarLength, y, missingBarLength, height);
  //   //   p.text("+" + miss, x - incorrectBarLength - missingBarLength - 1 - 12, y + height / 4 * 3);
  //   // } else {
  //   //   p.fill("red");
  //   //   p.rect(x + 1, y, incorrectBarLength, height);
  //   //   p.text(inc, x - incorrectBarLength - missingBarLength - 1 - 12, y + height / 2);
  //   // }
  //   // p.fill(correctColor);
  //   // p.rect(x + incorrectBarLength + missingBarLength, y, correctBarLength, height);
  //   // p.text(cor, x + correctBarLength + 12, y + height / 2);
  //   // p.textSize(16);
  // }

  /**
 * Draws a grid of circles representing points with correct, incorrect, or missing statuses.
 * * @param {number} x - The x-coordinate (top-left) of the grid area.
 * @param {number} y - The y-coordinate (top-left) of the grid area.
 * @param {number} length - The width of the grid area.
 * @param {number} height - The height of the grid area.
 * @param {number} miss - The count of 'missing' points (e.g., color RED).
 * @param {number} inc - The count of 'incorrect' points (e.g., color YELLOW).
 * @param {number} cor - The count of 'correct' points (e.g., color GREEN).
 * @param {number} max - The total number of points in the grid (e.g., 100).
 */
  function drawBigBarGraph(x, y, length, height, miss, inc, cor, max) {
    // --- Configuration ---
    const columns = 10; // Number of columns in the grid
    const rows = Math.ceil(max / columns); // Calculate rows based on max points

    const cellWidth = length / columns;
    const cellHeight = height / rows;
    const circleDiameter = Math.min(cellWidth, cellHeight) * 0.75; // 75% of the smallest cell dimension


    // --- Drawing Logic ---
    let pointCount = 0; // Counter for the current point being drawn

    p.noStroke(); // Circles will have no outline

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        pointCount++;

        // Check if we've drawn all 'max' points
        if (pointCount > max) {
          p.fill(backgroundColor);
        } else {
          // Determine the color based on the counts
          if (pointCount <= cor) {
            // This point is one of the 'correct' ones
            p.fill(correctColor);
          } else if (pointCount <= cor + inc) {
            // This point is one of the 'incorrect' ones
            p.fill(incorrectColor);
          } else if (pointCount <= cor + inc + miss) {
            // This point is one of the 'missing' ones
            p.fill(missedColor);
          } else {
            // All accounted points have been drawn, use the unused color
            p.fill(backgroundColor);
          }
        }

        // Calculate the center coordinates for the current circle
        let centerX = x + c * cellWidth + cellWidth / 2;
        let centerY = y + r * cellHeight + cellHeight / 2;

        // Draw the circle
        p.ellipse(centerX, centerY, circleDiameter, circleDiameter);
        p.fill('black');
      }
    }
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
    let draftPlayerFree = resetDraftPlayerFree();
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
