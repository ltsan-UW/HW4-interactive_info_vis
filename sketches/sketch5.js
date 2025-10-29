// Example 2
registerSketch('sk5', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

    let boardData = p.loadTable('sketches/hw5assets/DRAFT-2024.csv', 'csv', 'header');
    let draftData = p.loadTable('sketches/hw5assets/ESPN-2024.csv', 'csv', 'header');;

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
    p.fill(100, 150, 240);
    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    for(let i = 1; i <= rankRange[1]; i++) {
      let y = p.map(i, rankRange[0], rankRange[1], yStart, yEnd)
      p.text(i, midWidth - graphLength / distanceBetweenRanks, y);
    }


  }


  function drawLine() {

  }


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
