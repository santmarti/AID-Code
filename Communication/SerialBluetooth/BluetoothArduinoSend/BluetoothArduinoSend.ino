#include <SoftwareSerial.h>

boolean bBluetooth = false;
SoftwareSerial SerialBT(9, 8); // RX, TX

void setup() {
  Serial.begin(9600);
  if(bBluetooth) SerialBT.begin(9600);
}


void loop() {
  if(bBluetooth)  {
    SerialBT.print("a"); 
  } else {
    Serial.print("a");
  }
  delay(1000);
}
