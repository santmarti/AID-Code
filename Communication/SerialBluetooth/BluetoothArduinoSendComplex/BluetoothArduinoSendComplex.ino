#include <SoftwareSerial.h>

boolean bBluetooth = false;
SoftwareSerial SerialBT(9, 8); // RX, TX

int sensorValues[2];

void setup() {
  Serial.begin(9600);
  if(bBluetooth) SerialBT.begin(9600);
}

void loop() {
  sensorValues[0] = analogRead(A0);
  sensorValues[1] = analogRead(A1);

  if(bBluetooth)  {
    SerialBT.print("a"+String(sensorValues[0])+";" ); 
    SerialBT.print("b"+String(sensorValues[1])+";" ); 
    SerialBT.println("");
  } else {
    Serial.print("a"+String(sensorValues[0])+";" );
    Serial.print("b"+String(sensorValues[1])+";" );
    Serial.println("");
  }
  delay(10);

  // Receive -------------------------------
  if(bBluetooth)
  if (SerialBT.available()>0) {
    char input=SerialBT.read();
    Serial.println(input);
  }
}
