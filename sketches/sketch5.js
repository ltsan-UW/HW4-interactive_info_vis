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
  let lineWeight = 1;
  let graphLength = 800;
  let graphHeight = 600;
  let sliderLength = graphLength / 2;

  let correctnessSlider;

  p.preload = function () {
    boardData = p.loadTable('sketches/hw5assets/ESPN-2024.csv', 'csv', 'header');
    draftData = p.loadTable('sketches/hw5assets/DRAFT-2024.csv', 'csv', 'header');
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    for(let i = 0; i < draftData.getRowCount(); i++) {
      draftPlayerMap.set(draftData.getString(i, "Player"), draftData.getString(i, "Pk"));
      if(i < rankRange[1]) {
        draftPlayerFree.add(draftData.getString(i, "Player"));
      }
    }

    correctnessSlider = p.createSlider(0, 20, correctnessRange);
    correctnessSlider.style('width', sliderLength + "px");
  };


  p.draw = function () {
    let width = p.windowWidth;
    let height = p.windowHeight;
    let midWidth = p.windowWidth / 2;
    let midHeight = p.windowHeight / 2;

    p.background(250);

    correctnessRange = correctnessSlider.value();
    correctnessSlider.position(midWidth - sliderLength / 2, midHeight - graphHeight / 2);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("0", midWidth - sliderLength / 2 + 10, midHeight - graphHeight / 2 - 30);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("20", midWidth + sliderLength / 2, midHeight - graphHeight / 2 - 30);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("when the difference is less than " + correctnessRange, midWidth, midHeight - graphHeight / 2 - 20);




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
      draftPlayerFree.delete(playerData.Name);


      let y = p.map(boardRank, rankRange[0], rankRange[1], yStart, yEnd);
      let y2 = p.map(draftPosition, rankRange[0], rankRange[1], yStart, yEnd);


      if(isCorrect(boardRank, draftPosition)) {
        p.stroke(correctColor);
        p.fill(correctColor);
      } else {
        p.strokeWeight(lineWeight * 2);
        p.stroke(incorrectColor);
        p.fill(incorrectColor);
      }

      if(draftPosition > rankRange[1]) {
        p.strokeWeight(lineWeight * 3);
        p.line(x + textPixelLineOffset + 2, y, x + textPixelLineOffset + 2, y);
        p.noStroke();
        p.textSize(numbersTextSize * 0.7);
        p.text(draftPosition, x + textPixelLineOffset + 10, y);
        p.textSize(numbersTextSize);
      } else {
        p.line(x + textPixelLineOffset, y, x2 - textPixelLineOffset, y2);
      }
      p.noStroke();
      p.strokeWeight(lineWeight);

      p.fill(textColor);
      p.text(i + 1, x, y);
      p.text(i + 1, x2, y);
    }

    draftPlayerFree.forEach(player => {
      let draftPosition = draftPlayerMap.get(player);
      let y = p.map(draftPosition, rankRange[0], rankRange[1], yStart, yEnd);
      let x = midWidth + graphLength / distanceBetweenRanks;
      p.fill(incorrectColor);
      p.textSize(numbersTextSize * 0.7);
      p.textSize(numbersTextSize);
      p.fill(textColor);
      p.stroke(incorrectColor);
      p.strokeWeight(lineWeight * 3);
      p.line(x - textPixelLineOffset - 2, y, x - textPixelLineOffset - 2, y);
      p.strokeWeight(lineWeight);
      p.noStroke();
    });


  }


  function isCorrect(rank1, rank2) {
    rank1 = Number(rank1);
    rank2 = Number(rank2);
    return (rank1 + correctnessRange >= rank2 && rank1 - correctnessRange <= rank2)
  }


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
