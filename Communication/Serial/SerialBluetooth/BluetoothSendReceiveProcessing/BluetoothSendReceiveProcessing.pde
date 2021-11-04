import processing.serial.*;
import controlP5.*;

Serial myPort;  // The serial port
ControlP5 cp5;
int sliderValue = 100;

void setup() {
  size(500,300);
  
  cp5 = new ControlP5(this);

  cp5.addSlider("sliderValue")
     .setPosition(100,50)
     .setRange(0,255)
     ;
     
     
  printArray(Serial.list());    // List all the available serial ports
  
  int num = 5;
  myPort = new Serial(this, Serial.list()[num], 9600);
  delay(100);
}

void draw() {
  while (myPort.available() > 0) {
    int inByte = myPort.read();
    println(inByte);
  }
}


void keyPressed() {
  if(key == 'w') {
      myPort.write('w');
  }
  if(key == 's') {
      myPort.write('s');
  }
  if(key == '2') {
      myPort.write('2');
      myPort.write(sliderValue);    
      myPort.write(';');
  }

}
