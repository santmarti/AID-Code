import fisica.*;

int N_STATES = 3;
int state = 0;
float hue = 0.25;

FWorld world;
 
Ball[] balls = new Ball[0];

void add_circle(int x, int y, int d) {
  FCircle b = new FCircle(d);
  b.setPosition(x,y);
  b.setVelocity(50, 100);
  b.setFill(200, 30, 90);
  b.setRestitution(1);
  b.setDamping(0);
  world.add(b);  
}

void add_fisica() {
  add_circle(50,50,40);
  add_circle(150,150,160);
}


void add_balls() {
  balls = new Ball [2];
  balls[0] = new Ball(100, 400, 20); 
  balls[1] = new Ball(700, 400, 80);
}


PImage[] imgs = new PImage[2];
PFont f;


void setup() {
  size(640, 360);
  
  add_balls();
  
  Fisica.init(this);
  world = new FWorld();
  world.setGravity(0,0);
  world.setEdges();
  add_fisica();
  
  imgs[0] = loadImage("c.png");
  f = createFont("SourceCodePro-Regular.ttf", 45);
  textFont(f);
  
  colorMode(HSB, 1.0, 1.0, 1.0); 
}


void update_balls() {
  for (Ball b : balls) {
    b.update();
    
    fill(hue,1,1);

    b.display();
    b.checkBoundaryCollision();
    
    int r = int(b.radius)*2;
    if(state == 2) image(imgs[0], b.position.x-r/2, b.position.y-r/2,  r, r);
        
    textSize(r);   
    pushMatrix();
    int s = r/34;
    int x = 12*s;
    translate(b.position.x, b.position.y);
    rotate(radians(millis()/2));
    text("A",-x,x);
    popMatrix();
    
    //textAlign(CENTER, CENTER);
    //text("A", b.position.x, b.position.y);
  }
  if(balls.length > 0) balls[0].checkCollision(balls[1]);
}


void draw() {
  background(50);

  if(state == 0) {
        fill(hue,1,1);

    world.draw();
    world.step();
  }
  
  if(state >= 1) {  
    update_balls();
  } 
}


void keyPressed() {
  if(key == ' ') {
      state = (state+1) % N_STATES;
  }
}

void mousePressed() {
  hue = (float)mouseX / (float)width;
}
