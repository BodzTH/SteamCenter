#include <ESP8266WiFi.h>
#include <WiFiUdp.h>

#ifndef STASSID
#define STASSID "Orange-ESP01S"
#define STAPSK "esp01sardy"
#endif

unsigned int localPort = 5009; // local port to listen on

char packetBuffer[255];

WiFiUDP Udp;
IPAddress staticIP(192, 168, 1, 109); // Static IP configuration
IPAddress gateway(192, 168, 1, 109);    // Your gateway IP address
IPAddress subnet(255, 255, 255, 0);   // Your subnet mask
void setup()
{
  Serial.begin(9600);

  WiFi.mode(WIFI_STA);
  WiFi.config(staticIP, gateway, subnet); // Set static IP configuration
  WiFi.begin(STASSID, STAPSK);
  
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }

  Udp.begin(localPort);
}

void loop()
{
  int packetSize = Udp.parsePacket();
  if (packetSize)
  {
    IPAddress remoteIP = Udp.remoteIP();
    unsigned int remotePort = Udp.remotePort();
    delay(200);
    int len = Udp.read(packetBuffer, sizeof(packetBuffer));
    if (len > 0)
    {
      packetBuffer[len] = 0;

      char line = packetBuffer[0];

      if (line == '1')
      {
        Serial.write('D');
        String s = Serial.readStringUntil('\r');
        Udp.beginPacket(remoteIP, remotePort);
        Udp.print(s);
        Udp.endPacket();
      }
      else if (line == '2')
      {
        String lcd = ""; // Store Morse data
        for (int i = 1; i < len; i++)
        { // Start from index 1, skipping the command identifier
          if (packetBuffer[i] != '\r')
          {
            lcd += packetBuffer[i]; // Append non-delimiter characters to Morse string
          }
          else
          {
            break; // Stop reading at the delimiter ('\r')
          }
        }
        Serial.print('L' + lcd); // Print 'B' and Morse data
      }
      else if (line == '3')
      {
        String moorse = ""; // Store Morse data
        for (int i = 1; i < len; i++)
        { // Start from index 1, skipping the command identifier
          if (packetBuffer[i] != '\r')
          {
            moorse += packetBuffer[i]; // Append non-delimiter characters to Morse string
          }
          else
          {
            break; // Stop reading at the delimiter ('\r')
          }
        }
        Serial.print('B' + moorse); // Print 'B' and Morse data
      }
      else if (line == '4')
      {
        Serial.write('M');
        String s = Serial.readStringUntil('\r');
        Udp.beginPacket(remoteIP, remotePort);
        Udp.print(s);
        Udp.endPacket();
      }
      else
      {
        Udp.beginPacket(remoteIP, remotePort);
        Udp.print("Wrong prompt");
        Udp.endPacket();
      }
    }
  }
}
