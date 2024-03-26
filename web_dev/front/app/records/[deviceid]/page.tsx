'use client';
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios';
import AudiosBlock from '@/components/AudiosBlock';
import Map from '@/components/Map';
import { useStore } from "@/geos";

function Records() {

  interface RecordData {
    find: any;
    _id: number;
    map: any;
    filepath: string;
    date: string;
    time: string;
    filename: string;

    // Add other properties as needed
  }
  const { deviceid } = useParams() ?? { deviceid: '' };
  const [data, setData] = useState(null as RecordData | null);
  const [selectedId, setSelectedId] = useState(null as RecordData | null);
  const { City, Area, Street, FullAddress } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5090/records/${deviceid}`);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [deviceid]);




  const handleDataFromChild = (id: number) => {
    setSelectedId(data?.find((record: RecordData) => record._id === id));
    console.log('Selected ID:', id);
  };



  return (
    <>
      <div className='flex'>
        <div className='textBlock ml-10 mb-10'>
          <ul className=''>
            <div className='recDetails'>
              <li>DATE: {selectedId && selectedId?.date}</li>
              <li>TIME: {selectedId && selectedId?.time}</li>
              <li>FILENAME: {selectedId && selectedId?.filename}</li>
            </div>
            <div className='recDetails'>
              <li>CAUSE OF NOISE: { }</li>
              <li>FREQUENCY: { }</li>
            </div>
            <div className='recDetails'>
              <li>AVG. DECIBEL: { }</li>
              <li>PEAK DECIBEL:{ } -- PEAK TIME: </li>
            </div>
            <div>
              <li>LOCATION: {City}, {Area}, {Street}</li>
              <li>ADDRESS: {FullAddress}</li>
            </div>
          </ul>
        </div>

        <div className='ml-20'>
          {
            data && data?.map((record: RecordData) => (
              <AudiosBlock key={record._id} path={record.filepath} id={record._id} sendDataToParent={handleDataFromChild} />
            ))
          }
          <Map deviceID={Number(deviceid)} height={'40vh'} />
        </div>


      </div>
    </>
  )
}

export default Records