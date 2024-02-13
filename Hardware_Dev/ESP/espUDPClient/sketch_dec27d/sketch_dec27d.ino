#include <ESP8266WiFi.h>
#include <WiFiUdp.h>

#ifndef STASSID
#define STASSID "Orange-ESP01S"
#define STAPSK "esp01sardy"
#endif

IPAddress serverIP(192, 168, 1, 7); // Server's IP address
unsigned int serverPort = 5040;     // Server's port

char packetBuffer[255];

WiFiUDP Udp;

void setup()
{
  Serial.begin(9600);

  WiFi.mode(WIFI_STA);
  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }

  Udp.begin(0); // Bind to any available port
}

void loop()
{
  Serial.print("D");
  String s = Serial.readStringUntil('\r');
  delay(300);
  Udp.beginPacket(serverIP, serverPort);
  Udp.print(s);
  Udp.endPacket();

  delay(1500); // Delay for demonstration purposes
}
