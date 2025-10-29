// Example 2
registerSketch('sk5', function (p) {

  const draftPlayerMap = new Map();

  let boardData;
  let draftData;

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

    p.fill(100, 150, 240);
    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    for(let i = 1; i <= rankRange[1]; i++) {
      let x = midWidth - graphLength / distanceBetweenRanks;
      let x2 = midWidth + graphLength / distanceBetweenRanks;
      let y = p.map(i, rankRange[0], rankRange[1], yStart, yEnd)

      let playerData = boardData.getRow(i);
      playerData = playerData.obj;
      let playerDraftPosition = draftPlayerMap.get(playerData.Name);
      console.log(playerDraftPosition);

      let y2 = p.map(playerDraftPosition, rankRange[0], rankRange[1], yStart, yEnd)
      p.text(i, x, y);
      p.line(x + textPixelLineOffset, y, x2 - textPixelLineOffset, y2)
    }


  }


  function drawLine() {

  }


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
