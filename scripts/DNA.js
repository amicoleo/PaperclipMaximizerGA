class DNA {

  //init as random string of same length of target

  constructor(target, customFitnessFunction){
    this.target = target
    this.customFitnessFunction = customFitnessFunction

    // console.log(customFitnessFunction);

    this.genes = []
    this.genes.length = target.length
    for (var i = 0; i < this.genes.length; i++) {
      this.genes[i] =  String.fromCharCode(32 + Math.random()*(128 - 32))
    }
  }

  //
  calculateFitness() {
    if (this.customFitnessFunction === undefined || this.customFitnessFunction === null){

      var score = 0;
      for (var i = 0; i < this.genes.length; i++) {
        if (this.genes[i] == this.target[i]) {
          score++
        }
      }

      this.fitness = score/this.target.length
      this.fitness = (Math.pow(5, this.fitness)-1)*.25
      if (this.fitness > 1) this.fitness = 1

    }else{
      this.fitness = this.customFitnessFunction(this.genes)
    }
  }

  //Cross current with another DNA and return child
  crossover(partner){
    var child = new DNA(this.target, this.customFitnessFunction)
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
