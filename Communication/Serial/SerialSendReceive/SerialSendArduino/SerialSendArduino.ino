
bool sendingSerial = true;
int sensorValues[3];

void setup() {
  Serial.begin(9600);
}

void loop() {
  sensorValues[0] = analogRead(0);
  sensorValues[1] = analogRead(1);
  sensorValues[2] = analogRead(2);

  if(sendingSerial) {
    String str_0 = String(sensorValues[0]) + ";";    
    String str_1 = String(sensorValues[1]) + ";";    
    String str_2 = String(sensorValues[2]) + ";";    
    Serial.print("c");  
    Serial.print(str_0);
    Serial.print(str_1);
    Serial.print(str_2);
    delay(5);
  }
  


  // Receive Code -------------------------------
  if (Serial.available()>0) {
    char input=Serial.read();
    //Serial.println(input);
  }
}
