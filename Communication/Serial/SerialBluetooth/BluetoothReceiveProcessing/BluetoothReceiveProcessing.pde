import processing.serial.*;

Serial myPort;  // The serial port

void setup() {
  printArray(Serial.list());    // List all the available serial ports
  
  int num = 5;
  myPort = new Serial(this, Serial.list()[num], 9600);
  delay(100);
}

void draw() {
  while (myPort.available() > 0) {
    int inByte = myPort.read();
    println(inByte - 'a');
  }
}
