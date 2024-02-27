#include <TMRpcm.h>
#include <SD.h>
#include <SPI.h>

TMRpcm audio;
int file_number = 1;
char filePrefixname[50] = "Noise";
char exten[10] = ".wav";
const int recordLed = 2;
const int mic_pin = A0;
const int sample_rate = 16000;
#define SD_CSPin 10

void wait_sec(int sec) {
  int count = 0;
  int secs = sec;  // Convert minutes to seconds
  while (1) {
    Serial.print('.');
    delay(1000);
    count++;
    if (count == secs) {
      count = 0;
      break;
    }
  }
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  pinMode(mic_pin, INPUT);
  pinMode(recordLed, OUTPUT);
  Serial.println("loading... SD card");
  while (!SD.begin(SD_CSPin)) {
    Serial.print(".");
    delay(500);
  }
  audio.CSPin = SD_CSPin;
  Serial.println("SD Card Ready.");
}

void loop() {
  Serial.println("####################################################################################");
  char fileSlNum[20] = "";
  itoa(file_number, fileSlNum, 10);
  char file_name[50] = "";
  strcat(file_name, filePrefixname);
  strcat(file_name, fileSlNum);
  strcat(file_name, exten);
  Serial.print("New File Name: ");
  Serial.println(file_name);
  digitalWrite(recordLed, HIGH);
  audio.startRecording(file_name, sample_rate, mic_pin);
  Serial.println("startRecording ");
  wait_sec(5);  // Adjust the recording time as needed
  digitalWrite(recordLed, LOW);
  audio.stopRecording(file_name);
  Serial.println("stopRecording");
  file_number++;
  Serial.println("####################################################################################");

  sendFile();  // Call the function to send the file
}

void sendFile() {
  File myFile = SD.open("Noise1.wav");  // Replace 'test.wav' with your file's name
  if (myFile) {
    while (myFile.available()) {
      Serial.write(myFile.read());
    }
    myFile.close();
    // Add at the end of the file transfer loop
    Serial.write(0xFF);
    Serial.write(0xFE);
    Serial.write(0xFD);

  } else {
    Serial.println("Error opening file");
  }
}
