(function(){

  var target = "There was a time in which I liked to go swimming in the lake"
  var mutationRate = 0.001
  var nPopulation = 5000

  class DNA {

    //init as random string of same length of target
    constructor(){
      this.genes = []
      this.genes.length = target.length
      for (var i = 0; i < this.genes.length; i++) {
        this.genes[i] =  String.fromCharCode(32 + Math.random()*(128 - 32))
      }
    }

    //
    calculateFitness() {
      var score = 0;
      for (var i = 0; i < this.genes.length; i++) {
        if (this.genes[i] == target[i]) {
          score++
        }
      }

      this.fitness = score/target.length
      this.fitness = (Math.pow(5, this.fitness)-1)*.25
      if (this.fitness > 1) this.fitness = 1
    }

    //Cross current with another DNA and return child
    crossover(partner){
      var child = new DNA()
      var midpoint = parseInt(Math.random()*this.genes.length)
      for (var i=0; i<this.genes.length; i++){
        if (i < midpoint) child.genes[i] = this.genes[i]
        else child.genes[i] = partner.genes[i]
      }
      return child
    }

    mutate(mutationRate){
      for (var i = 0; i < this.genes.length; i++) {
        if (Math.random() < mutationRate) {
          this.genes[i] = String.fromCharCode(32 + Math.random()*(128 - 32))
        }
      }
    }

  }

  //Setup
  var population = []
  for (var i=0; i<nPopulation; i++){
    population.push(new DNA())
  }

  var loop = function(){

    // /LOOP
    //Fitness
    for (var i=0; i<population.length; i++){
      population[i].calculateFitness()
    }
    // console.log(population[0].fitness);
    printBestChild()

    //Mating Pool
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
    setTimeout(loop, 30)
  }

  var printBestChild = function(){
    var maxFitness = -1
    var bestChild = -1
    for (var i = 0; i<population.length; i++){
      if (population[i].fitness > maxFitness) {
        bestChild = i
        maxFitness = population[i].fitness
      }
    }

    var string = ""
    for (var i = 0; i< population[bestChild].genes.length; i++) string = string+population[bestChild].genes[i]

    console.log(maxFitness, string)

  }

  loop()


})()
