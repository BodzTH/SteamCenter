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
  const [data, setData] = useState([] as RecordData[]);
  const [selected, setSelected] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({} as RecordData);
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
  useEffect(() => {
    if (selected) {
      setSelectedRecord(data.find((record) => record._id === selectedRecord._id) || {} as RecordData);
    }
  }, [selected, selectedRecord._id]);
  return (
    <>
      <div className='flex'>
        <div>
          <ul className=''>
            <div className='recDetails'>
              <li>DATE: {selectedRecord && selectedRecord?.date}</li>
              <li>TIME: {selectedRecord && selectedRecord?.time}</li>
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
              <AudiosBlock key={record._id} path={record.filepath} id={record._id} openDetails={function (id: number): void {
                throw new Error('Function not implemented.');
              }} />
            ))
          }
        </div>
      </div>
    </>
  )
}

export default Records