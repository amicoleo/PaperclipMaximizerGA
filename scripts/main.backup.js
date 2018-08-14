(function(){



  var target = "There was a time in which I liked to go swimming in the lake"
  var mutationRate = 0.001
  var nPopulation = 5000

  //
  var customFitnessFunction = function(genes){

    var score = 0;
    for (var i = 0; i < genes.length; i++) {
      if (genes[i] == target[i]) {
        score++
      }
    }

    var fitness = score/target.length
    fitness = (Math.pow(5, fitness)-1)*.4
    if (fitness > 1) fitness = 1

    return fitness

    // return 1

  }

  //Setup
  var population = []
  for (var i=0; i<nPopulation; i++){
    population.push(new DNA(target, customFitnessFunction))
  }

  var loop = function(){

    // /LOOP
    //1. Calculate fitness on dna
    for (var i=0; i<population.length; i++){
      population[i].calculateFitness()
    }

    printBestChild()


    //2. Update generation
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
