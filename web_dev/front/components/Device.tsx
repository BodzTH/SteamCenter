'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Map from './index';
import Link from 'next/link';

const Device = React.memo(({ deviceid }: { deviceid: number }) => {
    interface DeviceData {
        processUnit: string;
        micModule: string;
        deviceName: string;
        deviceId: number;
        // Add other properties as needed
    }

    interface GeoData {
        place_id: string;
        lon: number;
        lat: number;
        address: {
            city: string;
            neighbourhood: string;
            village: string;
        };
        display_name: string;
        // Add other properties as needed
    }

    // Then use these interfaces when defining your state variables
    const [data, setData] = useState<GeoData | null>(null);
    const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
    const deviceID = deviceid;

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
            <div className='border-border-color border-b-2 pb-5 mb-10'>
                <div className='flex  gap-64 '>
                    <div className='flex gap-10 ml-5'>
                        <div>

                            <Image src={'/espduino.jpeg'} className='max-w-none images' width={400} height={50} alt={''}></Image>
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
                <Link href={`records/${deviceid}`}>
                    <button className="buttons mt-5 mx-10 ">Go to device recordings data</button>
                </Link>
            </div>
        </>
    );
});

export default Device;