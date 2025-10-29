// Example 2
registerSketch('sk5', function (p) {

  const draftPlayerMap = new Map();

  let boardData;
  let draftData;

  let correctnessRange = 6;

  let textColor = "black"
  let correctColor = "green"
  let incorrectColor = "red"
  let numbersTextSize = 14;
  let lineWeight = 1;

  p.preload = function () {
    boardData = p.loadTable('sketches/hw5assets/ESPN-2024.csv', 'csv', 'header');
    draftData = p.loadTable('sketches/hw5assets/DRAFT-2024.csv', 'csv', 'header');
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    for(let i = 0; i < draftData.getRowCount(); i++) {
      draftPlayerMap.set(draftData.getString(i, "Player"), draftData.getString(i, "Pk"));
    }
  };


  p.draw = function () {
    let width = p.windowWidth;
    let height = p.windowHeight;
    let midWidth = p.windowWidth / 2;
    let midHeight = p.windowHeight / 2;

    let graphLength = 800;
    let graphHeight = 600;

    p.background(250);



    let rankRange = [1,30];
    let yStart = midHeight - graphHeight / 2;
    let yEnd = midHeight + graphHeight / 2;
    let distanceBetweenRanks = 3; // graphLength / number
    let textPixelLineOffset = 10;

    p.fill(textColor);
    p.textSize(numbersTextSize);
    p.textAlign(p.CENTER, p.CENTER);
    p.strokeWeight(lineWeight);

    for(let i = 0; i < rankRange[1]; i++) {
      let x = midWidth - graphLength / distanceBetweenRanks;
      let x2 = midWidth + graphLength / distanceBetweenRanks;

      let boardRank = boardData.getString(i, "Rank");

      let playerData = boardData.getRow(i);
      playerData = playerData.obj;
      let draftPosition = draftPlayerMap.get(playerData.Name);

      let y = p.map(boardRank, rankRange[0], rankRange[1], yStart, yEnd);
      let y2 = p.map(draftPosition, rankRange[0], rankRange[1], yStart, yEnd);


      if(draftPosition > rankRange[1]) {
        p.fill(incorrectColor);
        p.textSize(numbersTextSize * 0.7);
        p.text(draftPosition, x + textPixelLineOffset + 10, y);
        p.textSize(numbersTextSize);
        p.fill(textColor);
        p.stroke(incorrectColor);
        p.strokeWeight(lineWeight * 2);
        p.line(x + textPixelLineOffset, y, x + textPixelLineOffset, y);
        p.strokeWeight(lineWeight);

      } else {
        if(isCorrect(boardRank, draftPosition)) {
          p.stroke(correctColor);
        } else {
          p.strokeWeight(lineWeight * 2);
          p.stroke(incorrectColor);
        }
        p.line(x + textPixelLineOffset, y, x2 - textPixelLineOffset, y2);
      }
      p.noStroke();
      p.strokeWeight(lineWeight);

      p.text(i + 1, x, y);
      p.text(i + 1, x2, y);
    }


  }


  function isCorrect(rank1, rank2) {
    rank1 = Number(rank1);
    rank2 = Number(rank2);
    return (rank1 + correctnessRange >= rank2 && rank1 - correctnessRange <= rank2)
  }


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
