import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'

// Define your icon
const myIcon = L.icon({
    iconUrl: '/noun-location.svg', // the URL of the icon image
    iconSize: [38, 95], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

function Mapdum() {
    return (
        <MapContainer style={{ height: "15vh", width: "100%" }} center={[30, 31]} zoom={50} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[30, 31]} icon={myIcon}>
                <Popup>
                    Delta1 device
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Mapdum