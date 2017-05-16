peg = $(".peg")
numBlocksSelector = $("select")
movesDisplay = $(".moves")
timerDisplay = $(".timer")
numBlocks = 5
timer = 0


numBlocksSelector.change(startGame)
peg.on("click", clickedPeg)

var user = {
  moves: 0,
  minMoves: 0,
  thisTimer: null,

  updateScore(){
    this.moves++
    movesDisplay.text("Moves: " + this.moves)
    console.log("Moves: " + this.moves)
  },

  win(){
    this.stopTimer()
  },

  bestPossible(num){
    this.minMoves = Math.pow(2,num) - 1
  },

  startTimer(){
    this.thisTimer = setInterval(this.displayTimer,1000)
  },

  stopTimer(){
    clearInterval(this.thisTimer)
  },

  displayTimer(){
    timer++
    timerDisplay.text("Time: " + timer)
  },

  refreshDisplay(){
    timerDisplay.text("Time: " + timer)
    movesDisplay.text("Moves: " + this.moves)
  }

}

var tower = {
  peg1: [],
  peg2: [],
  peg3: [],

  click1: "",
  click2: "",


  blockSizeWorks(block1, block2){
    if (block1.size > block2.size) {
      console.log("This block can't be moved to that peg")
      return false
    }else{
      return true
    }
  },

  move(pegStart, pegEnd) {
    var block1 = pegStart[pegStart.length - 1]
    var block2 = pegEnd[pegEnd.length - 1]
    if (block2 == undefined || this.blockSizeWorks(block1,block2) == true) {
      pegStart.pop()
      pegEnd.push(block1)
      user.updateScore()
      this.checkIfWin()
    }
      this.updateTower()
  },

  clearTowerView(){
    peg.empty()
  },

  restartTower(){
    peg.empty()
    this.peg1 = []
    this.peg2 = []
    this.peg3 = []
  },

  updateTower() {
    this.clearTowerView()
    this.updatePeg(this.peg1, 1)
    this.updatePeg(this.peg2, 2)
    this.updatePeg(this.peg3, 3)
  },

  updatePeg(pegNum, num){
    for (var i = pegNum.length - 1; i >= 0; i--) {
      var width = pegNum[i].size * 10 + 10
      var createdBlock = $("<div></div>")
      createdBlock.addClass("block")
      createdBlock.css("width", width)
      createdBlock.css("background-color", pegNum[i].color)
      $("#peg" + num).append(createdBlock)
    }
  },

  checkIfWin(){
    if (this.peg1[0] == null && (this.peg2[0] == null || this.peg3[0] == null)) {
      console.log("WINNER!!!!!!")
      console.log(`Best possible score with ${numBlocks} blocks: ${user.minMoves}`)
      user.win()
    }
  }
}


class Block{
  constructor(size, color){
    this.size = size
    this.color = color
    //this.color = color
  }

  createBlock(i) {
    var width = this.size * 10 + 10
    var createdBlock = $("<div></div>")
    createdBlock.addClass("block")
    createdBlock.css("width", width)
    createdBlock.attr("id","block" + i)
  }


}
function createStartBoard(numBlocks=4){
  numBlocks++
  for (var i = 1; i < numBlocks; i++) {
    var color = getRandomColor()
    var newBlock = new Block(i, color)
    tower.peg1.unshift(newBlock)
  }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createOptionValues() {
  for (var i = 3; i < 11; i++) {
    var newOption = $("<option></option>")
    newOption.attr("value",i)
    newOption.text(i)
    $("select").append(newOption)
  }
  numBlocksSelector.val('4')

}

function clickedPeg(){
  pegClick1 = this.id
  if (tower[pegClick1][0] != null) {
    console.log("1: " + this.id)
    tower.click1 = this.id

    $(this).children().first().addClass("clickedPeg")
    //$(this).addClass("clickedPeg")
    peg.off("click")
    peg.on("click", secondClickedPeg)
    $(this).off("click")
  }

}

function secondClickedPeg(){
  pegClick2 = this.id
  console.log("2: " + pegClick2)
  tower.click2 = pegClick2
  peg.removeClass("clickedPeg")
  tower.move(tower[pegClick1],tower[pegClick2])



  peg.off("click",secondClickedPeg)
  peg.on("click", clickedPeg)

  displayTower()
}

function startGame(){
  user.moves = 0
  timer = 0  
  user.stopTimer()
  user.refreshDisplay()
  console.log("startGame")
  numBlocks = numBlocksSelector.val()
  console.log("numBlocks: " + numBlocks)
  tower.restartTower()
  createStartBoard(numBlocks)
  tower.updateTower()
  user.bestPossible(numBlocks)
  peg.on("click", startTimerOnClick)
}

function startTimerOnClick(){
  user.startTimer()
  peg.off("click", startTimerOnClick)
}



function displayTower(){
  console.log("peg1 : " + tower.peg1)
  console.log("peg2 : " + tower.peg2)
  console.log("peg3 : " + tower.peg3)
}


createOptionValues()
console.log(tower.numBlocks)
startGame()
tower.updateTower()
