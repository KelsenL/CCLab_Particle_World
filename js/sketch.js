const MAX_POPULATION = 300; 
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
  for (let i = 0; i < nomocules.length; i++) {
    push();
    nomocules[i].update();
    nomocules[i].display();
    pop();
  }
}

class Nomocule {
  constructor(replication_speed = 1, replication_accuracy = 0.9, longevity = 150) {
    // x,y,color, size
    //1. mutation_possibility
    //2. replication_speed
    //3. replication_accuracy
    //4. longevity
    this.x = random(0, width);
    this.y = random(0, height);
    this.replication_speed = replication_speed;
    this.replication_accuracy = replication_accuracy;
    this.updateAppearance();
    this.birth_time = frameCount;  
    this.longevity = this.birth_time + longevity; 
  }

  updateAppearance() {
    this.color = color(
      map(this.replication_speed, 0.5, 2, 0, 255),
      map(this.replication_accuracy, 0.5, 1, 0, 255),
      map(this.longevity, 100, 500, 0, 255)
    );
    this.size = map(
      this.replication_speed * this.replication_accuracy * (this.longevity/300),
      0.25, 3.3, 10, 50
    );
  }

  update() {
    this.x = lerp(this.x, random(0, width), 0.05);
    this.y = lerp(this.y, random(0, height), 0.05);
    
    if (frameCount > this.longevity) {
      nomocules.splice(nomocules.indexOf(this), 1);
      return;
    }
    
    this.replicate();
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

    if (random() < this.replication_speed * 0.005) {
      if (random() < this.replication_accuracy) {
        let child_longevity = this.longevity - this.birth_time; 
        nomocules.push(new Nomocule(
          this.replication_speed,
          this.replication_accuracy,
          child_longevity
        ));
      } else {
        nomocules.push(new Nomocule(
          random(0.5, 1.5),  
          random(0.7, 1),    
          random(100, 300)   
        ));
      }
    }
  }

  mutate() {
    this.replication_speed = constrain(
      this.replication_speed + random(-0.2, 0.2), 
      0.5, 1.5
    );
    this.replication_accuracy = constrain(
      this.replication_accuracy + random(-0.1, 0.1),
      0.7, 1
    );
    this.longevity = constrain(
      this.longevity + random(-50, 50),
      100, 300
    );
    this.updateAppearance();
  }
}
