// var target = [
//   [30, 72],
//   [30, 13],
//   [49, 0],
//   [69, 13],
//   [69, 90],
//   [51, 100],
//   [41, 89],
//   [41, 30],
//   [50, 23],
//   [58, 31],
//   [58, 70]
// ]


// var targetRaw = targets.hellokitty
var target = []
var targetRaw


targetRaw = targets.gem
// targetRaw = targets.niagara
// targetRaw = targets.owl

setupRawTarget()

// function doubleClicked() {
//   var targetId = parseInt(Math.random()*3)
//
//   if (targetId == 0) targetRaw = targets.gem
//   else if (targetId == 1) targetRaw = targets.niagara
//   else if (targetId == 2) targetRaw = targets.owl
//
//   setupRawTarget()
//
//   console.log(target);
// }


function setupRawTarget(){

  target = []
  for (var i = 0; i < targetRaw.length; i++) {
    if (i%1 == 0){

      var val = []
      val[0] = targetRaw[i][0]*100
      val[1] = targetRaw[i][1]*100
      target.push(val)
    }
  }

}



var mutationRate = 0.001
var nPopulation = 2000

var paperclips = []

//
var customFitnessFunction = function(genes){
  var maxDistance = Math.sqrt(2)*100

  var accDistance = 0
  for (var i=0; i<target.length; i++){
    var distance = dist(target[i][0], target[i][1], genes[i][0], genes[i][1])
    var normDistance = distance/maxDistance
    accDistance+=normDistance
  }
  var fitness = (1 - accDistance/target.length)

  return fitness
}

//Setup
var population = []

var setup = function(){

  createCanvas(windowWidth, windowHeight);

  //create nPopulation elements with same genes as target
  for (var i=0; i<nPopulation; i++){
    population.push(new DNAVector(target, customFitnessFunction))
  }
}

var mate = function(){
  var matingPool = []
  for (var i = 0; i < population.length; i++){
    var n = parseInt(population[i].fitness * 100)
    for (var j=0; j < n; j++){
      matingPool.push(population[i]);
    }
  }
  //Mating!
  for (var i = 0; i < population.length; i++){
    var a = parseInt(matingPool.length*Math.random())
    var b = parseInt(matingPool.length*Math.random())
    var parentA = matingPool[a]
    var parentB = matingPool[b]

    var child = parentA.crossover(parentB)
    child.mutate(mutationRate)

    population[i] = child

  }

}

var draw = function(){

  // /LOOP
  //1. Calculate fitness on dna
  for (var i=0; i<population.length; i++){
    population[i].calculateFitness()
  }


  if (frameCount%4 == 0) {
    background(255, 255, 255)

    //draw targets
    // stroke(100)
    drawTarget()

    //draw best
    stroke(0)
    drawBestChild()

    for (key in paperclips){
      push()
      translate(paperclips[key].position.x, paperclips[key].position.y)
      rotate(paperclips[key].rotation)
      drawPaperclip(paperclips[key])
      pop()
    }
  }


  //2. Update generation
  //Mating Pool
  mate()

}


var getBestChildIndex = function(){

  var maxFitness = -1
  var bestChild = -1
  for (var i = 0; i<population.length; i++){
    if (population[i].fitness > maxFitness) {
      bestChild = i
      maxFitness = population[i].fitness
    }
  }

  return bestChild

}

var drawPaperclip = function(element){

  noFill()
  beginShape()
  for (var i=0; i<target.length; i++){
    push()
    vertex(element.genes[i][0], element.genes[i][1])
    pop()
  }
  endShape()

}

var drawTarget = function(){
  beginShape()
  for (var i=0; i<target.length; i++){
    push()
    vertex(target[i][0], target[i][1])
    pop()
  }
  endShape()
}

var drawBestChild = function(){
  push()

  translate(width*.5 - 50, height*.5 - 50)
  scale(2, 2)
  drawPaperclip(population[getBestChildIndex()])

  var fitnessInt = parseInt(population[getBestChildIndex()].fitness*100)

  fill(255, 0, 0)
  if (fitnessInt > 93){
    text("PAPERCLIP!!!!!", 0, 100)
    paperclips.push(population[getBestChildIndex()])
  }else{
    text("Confidence: "+fitnessInt, 0, 100)
  }

  pop()
}


var drawAll = function(){
  for (var i=0; i<100; i++){
    push()
    translate(positions[i].x, positions[i].y)
    drawPaperclip(population[i])
    pop()
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
