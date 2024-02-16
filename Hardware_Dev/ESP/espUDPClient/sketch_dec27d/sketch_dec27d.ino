#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <NTPClient.h> // Include the NTPClient library
#include <TimeLib.h>   // Include the Time library

#ifndef STASSID
#define STASSID "#_#"
#define STAPSK "MKnuby@ggezpz55"
#endif

IPAddress serverIP(192, 168, 1, 16); // Server's IP address
unsigned int serverPort = 5040;      // Server's port

char packetBuffer[255];

WiFiUDP Udp;
WiFiUDP ntpUDP;                                                // UDP client for NTP
NTPClient timeClient(ntpUDP, "pool.ntp.org", 2 * 3600, 60000); // NTP client, offset for Cairo time (UTC +2)

void setup()
{
  Serial.begin(9600);

  WiFi.mode(WIFI_STA);
  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }

  Udp.begin(0);       // Bind to any available port
  timeClient.begin(); // Start the NTP client
}

void loop()
{
  timeClient.update();                               // Update the time
  time_t rawTime = timeClient.getEpochTime();        // Get the Unix timestamp
  String currentDate = String(year(rawTime)) + "/" + // Convert to date string
                       String(month(rawTime)) + "/" +
                       String(day(rawTime)) + " " +
                       String(hour(rawTime)) + ":" +
                       String(minute(rawTime)) + ":" +
                       String(second(rawTime));

  Serial.print("D");
  String s = Serial.readStringUntil('\r');
  delay(300);
  Udp.beginPacket(serverIP, serverPort);
  Udp.print(currentDate + " " + s); // Send the current date and time with the UDP packet
  Udp.endPacket();

  delay(1500); // Delay for demonstration purposes
}