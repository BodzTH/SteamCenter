'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Map from './index';

const Device = React.memo(() => {
    const [data, setData] = useState(null);
    const [deviceData, setDeviceData] = useState(null);
    const deviceID = 1;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First request to get device location
                const response = await axios.get(`http://localhost:5090/location/${deviceID}`);
                setDeviceData(response.data);
                const latitude = response.data.latitude;
                const longitude = response.data.longitude;
                console.log(latitude, longitude);

                // Second request to get geocode information
                const geoResponse = await axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`);
                setData(geoResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    Device.displayName = 'Device';

    return (
        <>
            <div className='flex border-b-2 pb-5 gap-64 border-border-color  mb-10'>
                <div className='flex gap-10 ml-5'>
                    <div>

                        <Image src={'/espduino.jpeg'} className='max-w-none' width={400} height={50} alt={''}></Image>
                    </div>
                    <div className='shrink-0' >
                        <h1 className='mb-10'>
                            ProcessUnit : {deviceData?.processUnit}
                        </h1>
                        <h1 className='mb-10'>
                            MicModule : {deviceData?.micModule}
                        </h1>
                        <h1 className='mb-10'>
                            DeviceName : {deviceData?.deviceName}
                        </h1>
                        <h1 className='mb-10'>
                            Deviceid : {deviceData?.deviceId}
                        </h1>
                    </div>
                </div>
                <div className='flex gap-10'>


                    <Map deviceID={1} />


                    <div>
                        <h1 className='mb-10'>
                            Place_id : {data?.place_id}
                        </h1>
                        <h1 className='mb-10'>
                            Longitude : {data?.lon}
                        </h1>
                        <h1 className='mb-10'>
                            Latitude : {data?.lat}
                        </h1>
                        <h1 className='mb-10'>
                            City : {data?.address?.city}
                        </h1>
                        <h1 className='mb-10'>
                            Area : {data?.address?.neighbourhood}
                        </h1>
                        <h1 className='mb-10'>
                            Street : {data?.address?.village}
                        </h1>
                        <h1 className='mb-10'>
                            Full Address : {data?.display_name}
                        </h1>

                    </div>
                </div>
            </div>

        </>
    );
});

export default Device;