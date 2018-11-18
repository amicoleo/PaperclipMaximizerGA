
var population = []
var target = []
var paperclips = []

var canvasPreview = null
var canvasFull = null


var lastMaxFitnessInt = 0
var lastMaxFitnessTime = 0

var paperclipTargets = document.querySelectorAll(".paperclip-target")
paperclipTargets.forEach(function(paperclipTarget){
  paperclipTarget.addEventListener("click",function(){

    removeSelectedFromPaperclip()
    startEvolution(this.className.split("paperclip-target ")[1])
    this.classList.add('selected')
  })
})

var removeSelectedFromPaperclip = function(){
  var paperclipTargets = document.querySelectorAll(".paperclip-target")
  paperclipTargets.forEach(function(paperclipTarget){
    paperclipTarget.classList.remove('selected')
  })
}

var startEvolution = function(targetName){

  //create nPopulation elements with same genes as target
  population = []
  target = normalizeTarget(targets[targetName])
  for (var i=0; i<parameters.nPopulation; i++){
    population.push(new DNAVector(target, customFitnessFunction))
  }

  lastMaxFitnessInt = 0
}


var setup = function(){

  //preview
  var canvasPreview = createCanvas(document.body.offsetWidth, document.body.offsetHeight)
  canvasPreview.parent("home")

  startEvolution("gem")

}

var draw = function(){

  if (frameCount%3 == 0) {

    calcFitness()

    clear()

    // draw paperclips
    for (key in paperclips){
      push()
      translate(paperclips[key].position.x, paperclips[key].position.y)
      rotate(paperclips[key].rotation)

      stroke(0)
      translate(-1,-1)
      drawPaperclip(paperclips[key])

      pop()
    }


    // //preview bg
    // noStroke()
    // fill("#FFFFFC")
    // rect(document.querySelector("#preview-image").getBoundingClientRect().x, document.querySelector("#preview-image").getBoundingClientRect().y, document.querySelector("#preview-image").getBoundingClientRect().width, document.querySelector("#preview-image").getBoundingClientRect().height)

    //draw preview
    strokeWeight(2)
    translate(-2,-2)
    stroke(0)
    drawBestChild()

    mate()

  }
}


//
var calcFitness = function(){
  for (var i=0; i<population.length; i++){
    population[i].calculateFitness()
  }
}

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
    child.mutate(parameters.mutationRate)

    population[i] = child

  }
}

var drawPaperclip = function(element){

  // //Broken
  // noFill()
  // beginShape()
  // for (var i=0; i<element.genes.length; i++){
  //   push()
  //   vertex(element.genes[i][0], element.genes[i][1])
  //   pop()
  // }
  // endShape()

  //curved
  noFill()
  beginShape()
  curveVertex(element.genes[0][0], element.genes[0][1])
  for (var i=0; i<element.genes.length; i++){
    push()
    curveVertex(element.genes[i][0], element.genes[i][1])
    pop()
  }
  curveVertex(element.genes[element.genes.length-1][0], element.genes[element.genes.length-1][1])
  endShape()


}

var drawBestChild = function(){
  push()

  translate(document.querySelector("#preview-image").getBoundingClientRect().x, document.querySelector("#preview-image").getBoundingClientRect().y )
  scale(1.8, 1.8)

  drawPaperclip(population[getBestChildIndex()])

  var fitnessInt = parseInt(population[getBestChildIndex()].fitness*100)

  var confidenceDiv = document.querySelector(".confidence #number")
  confidenceDiv.textContent = fitnessInt

  if (fitnessInt > lastMaxFitnessInt){
    lastMaxFitnessTime = millis()
    lastMaxFitnessInt = fitnessInt
  }

  if (millis() - lastMaxFitnessTime > parameters.stableConfidenceTime && fitnessInt==lastMaxFitnessInt){
    confidenceDiv.style.color = "red"
    confidenceDiv.style.fontWeight = 600
    paperclips.push(population[getBestChildIndex()])
  }else{
    confidenceDiv.style.color = "black"
    confidenceDiv.style.fontWeight = 400
  }
  //
  //
  // if (fitnessInt > parameters.minConfidence){
  //   confidenceDiv.style.color = "red"
  //   confidenceDiv.style.fontWeight = 600
  //   paperclips.push(population[getBestChildIndex()])
  // }else{
  //   confidenceDiv.style.color = "black"
  //   confidenceDiv.style.fontWeight = 400
  // }

  pop()
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

function normalizeTarget(targetRaw){

  var normTarget = []
  for (var i = 0; i < targetRaw.length; i++) {
    if (i%1 == 0){

      var val = []
      val[0] = targetRaw[i][0]*100
      val[1] = targetRaw[i][1]*100
      normTarget.push(val)
    }
  }

  return normTarget
}

function windowResized() {
  resizeCanvas(document.body.offsetWidth, document.body.offsetHeight)
}
