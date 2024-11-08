const MAX_POPULATION = 500; 
const INITIAL_POPULATION = 100; 
let nomocules = [];
let mutation_rate = 0.001;

function setup() {
  let canvas = createCanvas(500, 400);
  canvas.parent("p5-canvas-container");
  background(220);
  for (let i = 0; i < INITIAL_POPULATION; i++) {
    nomocules.push(new Nomocule());
  }
}

function draw() {
  //update all nomocules
  //display all nomocules
  background(220);


  fill(0);
  noStroke();
  text(`Max Population: ${MAX_POPULATION}`, 10, 10);
  text(`Initial Population: ${INITIAL_POPULATION}`, 10, 25);
  text(`Mutation Rate: ${mutation_rate}`, 10, 40);
  for (let i = 0; i < nomocules.length; i++) {
    push();
    if (nomocules[i].update()){
      nomocules.splice(i, 1);
    }else{
      nomocules[i].display();
    }
    pop();
  }
}

class Nomocule {
  constructor(replication_speed = 1, replication_accuracy = 0.9, longevity = 300) {
    // x,y,color, size
    //1. mutation_possibility
    //2. replication_speed
    //3. replication_accuracy
    //4. longevity
    this.x = random(0, width);
    this.y = random(0, height);
    this.replication_speed = replication_speed;
    this.replication_accuracy = replication_accuracy;
    this.longevity = longevity;
    this.birth_time = frameCount;
    this.color = color(
      map(this.replication_speed, 0.5, 1.5, 0, 255),
      map(this.replication_accuracy, 0.7, 1, 0, 255),
      map(this.longevity, 0, 300, 0, 255)
    );
    this.size = constrain(map(this.replication_speed * this.replication_accuracy * (this.longevity / 300), 0.35, 1.5, 10, 50), 10, 100);
  }

  update() {
    this.x = lerp(this.x, random(0, width), 0.05);
    this.y = lerp(this.y, random(0, height), 0.05);
    
    if (frameCount - this.birth_time > this.longevity) {
      return true
    }
    this.replicate();
    return false;
  }

  display() {
    //random x y position
    //color and size based on variables
    //draw circle
    fill(this.color);
    circle(this.x, this.y, this.size);
  }

  replicate() {
    if (nomocules.length >= MAX_POPULATION) return;

    if (random() < this.replication_speed * 0.01) {
      if (random() < this.replication_accuracy) {
        nomocules.push(new Nomocule(
          this.replication_speed,
          this.replication_accuracy,
          this.longevity
        ));
      } else {
        nomocules.push(new Nomocule(
          constrain(
            this.replication_speed + random(-0.2, 0.2), 
            0.1, 1.9
          ),
          constrain(
            this.replication_accuracy + random(-0.1, 0.1),
            0.3, 1
          ),
          constrain(
            this.longevity + random(-50, 50),
            100, 500
          )
        ));
      }
    }
  }
}
