import oscP5.*;
import netP5.*;
  
OscP5 oscP5;

class Circle {
  int x;
  int y;
  
  Circle(int x_, int y_) {
    x = x_;
    y = y_;    
  }
  
  void draw() {
    circle(x,y,40);
  }
};

ArrayList<Circle> circles = new  ArrayList<Circle>();

void setup() {
  size(400,400);
  oscP5 = new OscP5(this,1234);
}

void draw() {  
 background(0);
 fill(0,255,0);
 for(Circle c: circles) {
   c.draw();
 }
}

void oscEvent(OscMessage msg) {
 if(msg.checkAddrPattern("/mouse")==true) { 
   int x =  msg.get(0).intValue();
   int y =  msg.get(1).intValue();
   circles.add( new Circle(x,y) );
 }
}
