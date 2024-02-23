#include <Wire.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <TMRpcm.h>
#include <SD.h>
#include <SPI.h>

#ifndef RX_PIN
#define RX_PIN 4 // Arduino Pin connected to the TX of the GPS module
#endif

#ifndef TX_PIN
#define TX_PIN 3 // Arduino Pin connected to the RX of the GPS module
#endif

#ifndef DHTPIN
#define DHTPIN 2 // Define DHT11 pin
#endif

#ifndef DHTTYPE
#define DHTTYPE DHT11 // Define DHT type
#endif

// Global variable declaration
String lng = "0";
String lat = "0";
String alt = "0";

DHT dht(DHTPIN, DHTTYPE); // Initialize DHT sensor

TinyGPSPlus gps;                          // the TinyGPS++ object
SoftwareSerial gpsSerial(RX_PIN, TX_PIN); // the serial interface to the GPS module

TMRpcm audio;
int file_number = 1;
char filePrefixname[50] = "Noise";
char exten[10] = ".wav";
const int recordLed = 7;
const int mic_pin = A0;
const int sample_rate = 16000;
#define SD_CSPin 10

void gpsLocator()
{
  if (gpsSerial.available() > 0)
  {
    if (gps.encode(gpsSerial.read()))
    {
      if (gps.location.isValid())
      {
        lat = String(gps.location.lat(), 10); // 6 is the number of decimals you want
        lng = String(gps.location.lng(), 10); // 6 is the number of decimals you want
      }

      if (gps.altitude.isValid())
      {
        alt = String(gps.altitude.meters());
      }
    }
  }
}
void wait_sec(int secs)
{
  int count = 0;
  int seconds = secs;
  while (1)
  {
    delay(1000);
    count++;
    if (count == seconds)
    {
      count = 0;
      break;
    }
  }
  return;
}
void recordAudio()
{
  char fileSlNum[20] = "";
  itoa(file_number, fileSlNum, 10);
  char file_name[50] = "";
  strcat(file_name, filePrefixname);
  strcat(file_name, fileSlNum);
  strcat(file_name, exten);
  digitalWrite(recordLed, HIGH);
  audio.startRecording(file_name, sample_rate, mic_pin);
  // record audio for 2mins. means , in this loop process record 2mins of audio.
  // if you need more time duration recording audio then
  // pass higher value into the wait_min(int mins) function.
  wait_sec(30);
  digitalWrite(recordLed, LOW);
  audio.stopRecording(file_name);
  file_number++;
}

void setup()
{
  Serial.begin(9600); // Initialize serial communication
  // gpsSerial.begin(9600); // Default baud of NEO-6M GPS module is 9600
  dht.begin(); // Start DHT sensor
  // pinMode(mic_pin, INPUT);
  // pinMode(recordLed, OUTPUT);
  // while (!SD.begin(SD_CSPin))
  // {
  //   delay(500);
  // }
  // audio.CSPin = SD_CSPin;
}

void loop()
{
  if (Serial.available() > 0)
  {
    char command = Serial.read(); // Read incoming command from serial

    if (command == 'D')
    {

      // gpsLocator(); // Get GPS location
      //
      // Run DHT11 sensor project
      float humidity = dht.readHumidity();
      float temperature = dht.readTemperature();

      // Create a JSON object
      StaticJsonDocument<200> doc;

      // Add data to the JSON object
      doc["Humidity"] = humidity;
      doc["Temperature"] = temperature;
      doc["Latitude"] = lat;
      doc["Longitude"] = lng;
      doc["Altitude"] = alt;

      // Print the JSON object
      serializeJson(doc, Serial);
      Serial.println();
    }
    // else if (command == 'L')
    // {
    //   // Run LCD project
    //   while (!Serial.available())
    //   {
    //   } // Wait until text is available

    //   String text = Serial.readStringUntil('\n'); // Read text from serial until newline

    //   lcd.clear();
    //   lcd.setCursor(0, 0);
    //   lcd.print(text);

    //   if (text.length() > 16)
    //   {
    //     lcd.setCursor(0, 1);
    //     lcd.print(text.substring(16));
    //   }
    // }
    else if (command == 'P')
    {
      // gpsLocator(); // Get GPS location
      // recordAudio(); // Record audio
      StaticJsonDocument<300> loc;
      loc["Latitude"] = lat;
      loc["Longitude"] = lng;
      loc["Altitude"] = alt;
      serializeJson(loc, Serial);
      Serial.println();
    }
    // else if (command == 'G')
    // {
    //   // Create a JSON object
    //   StaticJsonDocument<200> doc;

    //   // Add data to the JSON object
    //   doc["Latitude"] = lat;
    //   doc["Longitude"] = lng;

    //   // Print the JSON object
    //   serializeJson(doc, Serial);
    //   Serial.println();
    // }
  }
  delay(200);
}