#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <ArduinoJson.h>
#include <TimeLib.h>

#ifndef STASSID
#define STASSID "#_#"
#endif

#ifndef STAPSK
#define STAPSK "MKnuby@ggezpz55"
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
#define SERVER_IP4 16
#endif

#ifndef SERVER_PORT
#define SERVER_PORT 5040
#endif

// Then use the defined values to initialize the variables
const int deviceId = DEVICE_ID;
IPAddress serverIP(SERVER_IP1, SERVER_IP2, SERVER_IP3, SERVER_IP4);
unsigned int serverPort = SERVER_PORT;

char packetBuffer[255];

WiFiUDP Udp;
WiFiUDP ntpUDP;                                                // UDP client for NTP
NTPClient timeClient(ntpUDP, "pool.ntp.org", 2 * 3600, 60000); // NTP client, offset for Cairo time (UTC +2)

void connectToWiFi()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
}

void startUDPandNTP()
{
  Udp.begin(0);       // Bind to any available port
  timeClient.begin(); // Start the NTP client
}

StaticJsonDocument<200> checkId;

bool checkDeviceId()
{
  int packetSize = 0;
  bool isDeviceId = true;
  for (int i = 0; i < 3; i++)
  {
    checkId["deviceId"] = deviceId;
    Udp.beginPacket(serverIP, serverPort);
    ArduinoJson::serializeJson(checkId, Udp);
    Udp.endPacket();

    delay(1000); // Wait for a second to give the server time to respond

    packetSize = Udp.parsePacket();
    if (packetSize)
    {
      int len = Udp.read(packetBuffer, 255);
      if (len > 0)
      {
        packetBuffer[len] = 0;
      }
      // Check if the response is "OK"
      if (strcmp(packetBuffer, "OK") == 0)
      {
        isDeviceId = false;
        break;
      }
      // Check if the response is "NO"
      else if (strcmp(packetBuffer, "NO") == 0)
      {
        break;
      }
    }
  }

  return isDeviceId; // Return true if no "OK" or "NO" response is received after 3 attempts
}

void sendJsonData()
{
  // Create a JSON object
  Serial.print("P");
  delay(800);
  if (Serial.available() > 0)
  {
    String json = Serial.readStringUntil('\r');
    delay(300);

    StaticJsonDocument<300> loc;

    DeserializationError error = deserializeJson(loc, json);
    if (error)
    {
      return;
    }

    StaticJsonDocument<300> doc;
    // Add data to the JSON object
    doc["processUnit"] = "ArduinoUNO";
    doc["wirelessModule"] = "ESP01S";
    doc["micModule"] = "MAX4466";
    doc["coverage"] = 100;
    doc["deviceName"] = "Delta1";
    doc["deviceId"] = deviceId;
    doc["image"] = "/home/bodz/SteamCenter/web_dev/database/device1.jpeg";

    for (JsonPair kv : loc.as<JsonObject>())
    {
      doc[kv.key()] = kv.value();
    }

    // Send the JSON string over UDP
    Udp.beginPacket(serverIP, serverPort);
    ArduinoJson::serializeJson(doc, Udp); // Send the combined JSON
    Udp.endPacket();
  }
}

String getCurrentDate(time_t rawTime)
{
  return String(year(rawTime)) + "/" + // Convert to date string
         String(month(rawTime)) + "/" + String(day(rawTime));
}

String getCurrentTime(time_t rawTime)
{
  return String(hour(rawTime)) + ":" + // Convert to time string
         String(minute(rawTime)) + ":" + String(second(rawTime));
}

void setup()
{
  Serial.begin(9600);
  connectToWiFi();
  startUDPandNTP();

  if (checkDeviceId())
  {
    sendJsonData();
  }
  else
  {
    Udp.beginPacket(serverIP, serverPort);
    Udp.println("I am already there!");
    Udp.endPacket();
  }
}

void loop()
{
  timeClient.update();                        // Update the time
  time_t rawTime = timeClient.getEpochTime(); // Get the Unix timestamp
  String currentDate = getCurrentDate(rawTime);
  String currentTime = getCurrentTime(rawTime);

  Serial.print("D");
  delay(300);
  if (Serial.available() > 0)
  {
    String json = Serial.readStringUntil('\r');
    delay(300);
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, json);
    if (error)
    {
      return;
    }

    // Create a new JSON document for the date and time
    StaticJsonDocument<300> combinedDoc;
    combinedDoc["date"] = currentDate;
    combinedDoc["time"] = currentTime;
    combinedDoc["deviceId"] = deviceId;

    // Copy each key-value pair from doc to dateDoc
    for (JsonPair kv : doc.as<JsonObject>())
    {
      combinedDoc[kv.key()] = kv.value();
    }

    Udp.beginPacket(serverIP, serverPort);
    ArduinoJson::serializeJson(combinedDoc, Udp); // Send the combined JSON
    Udp.endPacket();
  }

  delay(3000); // Delay for demonstration purposes
}
