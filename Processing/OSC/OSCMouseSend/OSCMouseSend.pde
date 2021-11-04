import oscP5.*;
import netP5.*;
  
OscP5 oscP5;
NetAddress myRemoteLocation;

void setup() {
  size(400,400);
  oscP5 = new OscP5(this,12345);
  myRemoteLocation = new NetAddress("127.0.0.1",1234);
}

void sendMsgXY(String addr, int x, int y) {
  OscMessage myMessage = new OscMessage(addr);
  myMessage.add(x); 
  myMessage.add(y); 
  oscP5.send(myMessage, myRemoteLocation); 
}


void draw() {  
 background(0);
 if (mousePressed) background(255);
}

void mousePressed() {
  sendMsgXY("/mouse", mouseX, mouseY);
}
