class DNAVector {

  //init as random string of same length of target

  constructor(target, customFitnessFunction){
    this.target = target
    this.customFitnessFunction = customFitnessFunction

    this.genes = []
    this.genes.length = target.length

    var step = 100/this.genes.length
    for (var i = 0; i < this.genes.length; i++) {

      // v1 - random
      this.genes[i] = [parseInt(Math.random()*100), parseInt(Math.random()*100)]

      // //v2 - straigh line
      // this.genes[i] = [
      //   i*step,
      //   i*step
      // ]

      this.position = {x: Math.random()*width, y: Math.random()*height}
      this.rotation = Math.random()*2*Math.PI



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
    var child = new DNAVector(this.target, this.customFitnessFunction)
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
        this.genes[i][0]= this.genes[i][0] + parseInt(Math.random()*2 - 1)
        this.genes[i][1] = this.genes[i][1] + parseInt(Math.random()*2 - 1)

        this.genes[i][0] = Math.min(100, Math.max(0, this.genes[i][0]))
        this.genes[i][1] = Math.min(100, Math.max(0, this.genes[i][1]))
      }
    }
  }

}
