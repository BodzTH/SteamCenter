'use client';
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios';
import AudiosBlock from '@/components/AudiosBlock';

function Records() {

  interface RecordData {
    _id: number;
    map: any;
    filepath: string;
    date: string;
    time: string;
    // Add other properties as needed
  }
  const { deviceid } = useParams() ?? { deviceid: '' };
  const [data, setData] = useState(null as RecordData | null);
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
  }, []);
  return (
    <>
      <div className='flex'>
        <div>
          <ul className=''>
            <div className='recDetails'>
              <li>DATE: {data && data?.date}</li>
              <li>TIME: {data && data?.time}</li>
            </div>
            <div className='recDetails'>
              <li>CAUSE OF NOISE: { }</li>
              <li>FREQUENCY: { }</li>
            </div>
            <div className='recDetails'>
              <li>AVG. DECIBEL: { }</li>
              <li>PEAK DECIBEL:{ } -- PEAK TIME: </li>
            </div>
          </ul>
        </div>
        <div className='ml-20'>
          {
            data && data?.map((record: RecordData) => (
              <AudiosBlock key={record._id} path={record.filepath} />
            ))
          }
        </div>
      </div>
    </>
  )
}

export default Records