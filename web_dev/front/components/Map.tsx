'use client';
import React, { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
interface MapProps {
    long: number;
    lat: number;
}

function Map({ long, lat }: MapProps) {
    const mapRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
                version: "weekly",
            }
            )
            const { Map } = await loader.importLibrary('maps');
            //init marker
            const { Marker } = await loader.importLibrary('marker') as google.maps.MarkerLibrary;
            const location = {
                lng: long
                , lat: lat
            };

            const mapOptions: google.maps.MapOptions = {
                center: location,
                zoom: 8,
                mapId: 'neweed'
            };

            //set the map 
            const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

            //put a marker on the map
            const marker = new Marker({
                position: location,
                map: map,
                title: 'Hello World!'
            });
        }
        initMap();
    }, [long, lat]);

    return (
        <div ref={mapRef} />
    )
}

export default Map;