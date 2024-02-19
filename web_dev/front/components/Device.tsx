'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Map from './index';

const Device = React.memo(() => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        axios.get(`https://geocode.maps.co/reverse?lat=${30.035573}&lon=${31.45139}&api_key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`)
            .then((response) => {
                setData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);
    Device.displayName = 'Device';
    return (
        <>
            <div className='flex border-b-2 pb-5 gap-64 border-border-color  mb-10'>
                <div className='flex gap-10 ml-5'>
                    <div>

                        <Image src={'/comp.jpeg'} className='max-w-none' width={400} height={50} alt={''}></Image>
                    </div>
                    <div className='shrink-0' >
                        <h1 className='mb-10'>
                            ProcessUnit :
                        </h1>

                        <h1 className='mb-10'>
                            Battery :
                        </h1>

                        <h1 className='mb-10'>
                            Status :
                        </h1>
                        <h1 className='mb-10'>
                            DeviceName :
                        </h1>
                        <h1 className='mb-10'>
                            Deviceid :
                        </h1>
                    </div>
                </div>
                <div className='flex gap-10'>


                    <Map />


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