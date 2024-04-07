#include <ArduinoJson.h>
#include <TinyGPS++.h>
#include <WiFi.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <TimeLib.h>
#include <FS.h>
#include "Wav.h"
#include "I2S.h"
#include <SD.h>
#include <SoftwareSerial.h>
#include <cmath>

#ifndef STASSID
#define STASSID "#_#"
#endif

#ifndef STAPSK
#define STAPSK "R@t0ha.35"
#endif

#ifndef DEVICE_ID
#define DEVICE_ID 1
#endif

#ifndef SERVER_IP1
#define SERVER_IP1 192
#endif

#ifndef SERVER_IP2
#define SERVER_IP2 168
#endif

#ifndef SERVER_IP3
#define SERVER_IP3 1
#endif

#ifndef SERVER_IP4
#define SERVER_IP4 7
#endif

#ifndef SERVER_PORT1
#define SERVER_PORT1 5040
#endif

#ifndef SERVER_PORT2
#define SERVER_PORT2 5030
#endif

#ifndef I2S_MODE
#define I2S_MODE I2S_MODE_ADC_BUILT_IN
#endif

#ifndef GPS_BAUDRATE
#define GPS_BAUDRATE 9600  // The default baudrate of NEO-6M is 9600
#endif

// Global variable declaration
const int deviceId = DEVICE_ID;
IPAddress serverIP(SERVER_IP1, SERVER_IP2, SERVER_IP3, SERVER_IP4);
unsigned int serverPort = SERVER_PORT1;
unsigned int serverPortTCP = SERVER_PORT2;
unsigned int localUdpPort = 5432;
String lng = "0";
String lat = "0";
String alt = "0";
String currentDate;
String currentTime;

StaticJsonDocument<50> checkId;
char packetBuffer[100];

WiFiUDP Udp;
WiFiUDP ntpUDP;
TinyGPSPlus gps;                                                // UDP client for NTP
NTPClient timeClient(ntpUDP, "pool.ntp.org", 2 * 3600, 60000);  // NTP client, offset for Cairo time (UTC +2)
WiFiClient client;
File file;

// SD card pin
const int CS_PIN = 5;       // Use the correct chip select pin for your setup
const int record_time = 8;  // second
int file_number = 1;
char filePrefixname[50] = "Noise";
char exten[10] = ".wav";
const int recordLed = 25;
const int TCPLed = 26;
const int mic_pin = A0;

const int headerSize = 44;
const int waveDataSize = record_time * 88000;
const int numCommunicationData = 8000;
const int numPartWavData = numCommunicationData / 4;
byte header[headerSize];
char communicationData[numCommunicationData];
char partWavData[numPartWavData];



/////////////////////////////////////
void setup() {
  Serial.begin(GPS_BAUDRATE);
  connectToWiFi();
  delay(400);
  startUDPandNTP();
  prepareData();
  if (checkDeviceId()) {
    sendJsonData();
  } else {
    Udp.beginPacket(serverIP, serverPort);
    Udp.println("I am already there!");
    Udp.endPacket();
  }
  initializeSDCard(CS_PIN);  // Call the function with the CS pin number, for example, 10
  // Initialize the I2S interface for recording
  I2S_Init(I2S_MODE, I2S_BITS_PER_SAMPLE_32BIT);
  pinMode(recordLed, OUTPUT);
  pinMode(TCPLed, OUTPUT);
}

void loop() {
  startRecording();
  delay(3000);
}
//////////////////////////////////



void connectToWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void startUDPandNTP() {
  Udp.begin(localUdpPort);  // Bind to any available port
  timeClient.begin();       // Start the NTP client
}

void gpsLocator() {
  // Check if there is data available from the GPS module
  StaticJsonDocument<80> ser;
  int x = 0;
  ser["processUnit"] = x;
  if (Serial.available() > 0) {
    x = 532;
    Udp.beginPacket(serverIP, serverPort);
    ArduinoJson::serializeJson(ser, Udp);  // Send the combined JSON
    Udp.endPacket();
    if (gps.encode(Serial.read())) {
      if (gps.location.isValid()) {
        lat = String(gps.location.lat(), 7);  // Adjusted to 6 as per the original comment
        lng = String(gps.location.lng(), 7);  // Adjusted to 6 as per the original comment
        if (gps.altitude.isValid()) {
          alt = String(gps.altitude.meters());
        }
      } else {
        Udp.beginPacket(serverIP, serverPort);
        Udp.println(F("long lat not valid yet"));
        Udp.endPacket();
      }
    }
  } else {
    x = 90;
    Udp.beginPacket(serverIP, serverPort);
    ArduinoJson::serializeJson(ser, Udp);  // Send the combined JSON
    Udp.endPacket();
  }
}

String getCurrentDate(time_t rawTime) {
  return String(year(rawTime)) + "/" +  // Convert to date string
         String(month(rawTime)) + "/" + String(day(rawTime));
}

String getCurrentTime(time_t rawTime) {
  return String(hour(rawTime)) + ":" +  // Convert to time string
         String(minute(rawTime)) + ":" + String(second(rawTime));
}

void prepareData() {
  gpsLocator();                                // Get GPS location
  timeClient.update();                         // Update the time
  time_t rawTime = timeClient.getEpochTime();  // Get the Unix timestamp
  currentDate = getCurrentDate(rawTime);
  currentTime = getCurrentTime(rawTime);
}

void initializeSDCard(const int CS_PIN) {
  if (!SD.begin(CS_PIN)) {
    return;
  }

  uint8_t cardType = SD.cardType();
  if (cardType == CARD_NONE) {
    return;
  }
}

void sendJsonData() {
  gpsLocator();  // Get GPS location
  // Create a JSON object
  StaticJsonDocument<80> doc;
  // Add data to the JSON object
  doc["processUnit"] = "ESP32";
  doc["wirelessModule"] = "WEMOS D1 R32";
  doc["micModule"] = "MAX9814";
  doc["deviceName"] = "Delta1";
  doc["deviceId"] = deviceId;
  doc["image"] = "/home/bodz/SteamCenter/web_dev/database/device1.jpeg";
  doc["Latitude"] = lat;
  doc["Longitude"] = lng;
  doc["Altitude"] = alt;

  // Send the JSON string over UDP
  Udp.beginPacket(serverIP, serverPort);
  ArduinoJson::serializeJson(doc, Udp);  // Send the combined JSON
  Udp.endPacket();
}

bool checkDeviceId() {
  int packetSize = 0;
  bool isDeviceId = true;
  for (int i = 0; i < 4; i++) {
    checkId["deviceId"] = deviceId;
    Udp.beginPacket(serverIP, serverPort);
    ArduinoJson::serializeJson(checkId, Udp);
    Udp.endPacket();

    delay(500);  // Wait for the response

    packetSize = Udp.parsePacket();
    if (packetSize) {
      int len = Udp.read(packetBuffer, 255);
      if (len > 0) {
        packetBuffer[len] = 0;
      }
      // Check if the response is "OK"
      if (strcmp(packetBuffer, "OK") == 0) {
        isDeviceId = false;
        break;
      }
      // Check if the response is "NO"
      else if (strcmp(packetBuffer, "NO") == 0) {
        break;
      }
    }
  }

  return isDeviceId;  // Return true if no "OK" or "NO" response is received after 4 attempts
}

void sendJsonOverUDP(const char* filename) {
  StaticJsonDocument<80> doc;

  // Add data to the JSON object
  doc["Latitude"] = lat;
  doc["Longitude"] = lng;
  doc["Altitude"] = alt;
  doc["date"] = currentDate;
  doc["time"] = currentTime;
  doc["deviceId"] = deviceId;
  doc["filename"] = filename;
  // Create a JSON object

  Udp.beginPacket(serverIP, serverPort);
  ArduinoJson::serializeJson(doc, Udp);  // Send the combined JSON
  Udp.endPacket();
}

void sendFileOverTCP(const char* filename) {
  if (!client.connect(serverIP, serverPortTCP)) {
    return;
  }

  file = SD.open(filename, "r");
  if (!file) {
    return;
  }
  digitalWrite(TCPLed, HIGH);
  while (file.available()) {
    char buf[2048];
    size_t len = file.readBytes(buf, sizeof(buf));
    client.write((const uint8_t*)buf, len);
  }
  digitalWrite(TCPLed, LOW);
  file.close();
  client.stop();
  delay(1000);
}

void startRecording() {
  // Generate the new file name based on the file_number
  char fileSlNum[20] = "";
  itoa(file_number, fileSlNum, 10);   // Convert file_number to string
  char file_name[50] = "/";           // Start with root directory
  strcat(file_name, filePrefixname);  // Prefix for the file name
  strcat(file_name, fileSlNum);       // Add the file number
  strcat(file_name, exten);           // Append the file extension

  // Indicate the new file name on Serial Monitor


  // Prepare the WAV file header
  CreateWavHeader(header, waveDataSize);

  // Open a new file on the SD card for writing
  file = SD.open(file_name, FILE_WRITE);
  if (!file) {
    return;
  }

  // Write the WAV header to the file
  file.write(header, headerSize);
  prepareData();
  sendJsonOverUDP(file_name);
  digitalWrite(recordLed, HIGH);
  // Read and write the audio data in chunks
  for (int j = 0; j < waveDataSize / numPartWavData; ++j) {
    I2S_Read(communicationData, numCommunicationData);  // Read data from I2S
    // Process the raw data to fit WAV format requirements
    for (int i = 0; i < numCommunicationData / 8; ++i) {
      // Convert 32-bit samples to 16-bit and store them
      partWavData[2 * i] = communicationData[8 * i + 2];
      partWavData[2 * i + 1] = communicationData[8 * i + 3];
    }
    // Write the processed audio data to the file
    file.write((const byte*)partWavData, numPartWavData);
  }

  // Close the file after recording is done
  file.close();

  // Turn off the recording LED
  digitalWrite(recordLed, LOW);


  sendFileOverTCP(file_name);
  // Increment the file number for the next recording
  file_number++;
}
