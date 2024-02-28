import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios, { AxiosError } from 'axios';

// Define your icon
const myIcon = L.icon({
    iconUrl: '/noun-location.svg', // Ensure this path is correct
    iconSize: [38, 95], // Adjust if necessary
    iconAnchor: [22, 94], // Adjust if necessary
    popupAnchor: [-3, -76] // Adjust if necessary
});

function Mapdum({ deviceID }: { deviceID: Number }) {
    const [position, setPosition] = useState();

    useEffect(() => {
        // Function to fetch location data
        const fetchLocation = async () => {
            try {
                const response = await axios.get(`http://localhost:5090/location/${deviceID}`);
                // Axios automatically parses the JSON response, so you can directly access `response.data`
                const { latitude, longitude } = response.data;
                if (response.status === 200) {
                    setPosition([latitude, longitude]);
                } else {
                    console.error('Failed to fetch location');
                }
            } catch (error) {
                console.error('Error:', error);
                // If you're dealing with HTTP errors, they are available under `error.response`
                // You might want to check for that and log or handle accordingly
                if ((error as AxiosError).response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log((error as AxiosError).response?.data);
                    console.log((error as AxiosError).response?.status);
                    console.log((error as AxiosError).response?.headers);
                } else if ((error as AxiosError).request) {
                    // The request was made but no response was received
                    console.log((error as AxiosError).request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', (error as Error).message);
                }
            }
        };

        fetchLocation();
    }, [deviceID]); // Dependency array to refetch if deviceID changes

    return position ? (
        <MapContainer style={{ height: "30vh", width: "100%" }} center={position} zoom={15} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={myIcon}>
                <Popup>
                    Delta1 device
                </Popup>
            </Marker>
        </MapContainer>
    ) : null; // Render null or a loading state until position is fetched
}

export default Mapdum;