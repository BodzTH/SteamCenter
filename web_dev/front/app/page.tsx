'use client';
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const [reads, setReads] = useState<any>();
  async function getTempReadings(): Promise<any> {
    try {
      const response = await axios.get<number>(
        "http://192.168.1.7:5030/nextThum"
      );
      const newReads = response.data;
      setReads(newReads);
    } catch (error) {
      console.error("Error fetching quantity:", error);
      throw error;
    }
  }

  function handleClick() {
    getTempReadings();
  }

  return (
    <div>
      <h1>Noise pollution</h1>
      <input className="border border-border-color mr-5 " type="text" />
      <button onClick={handleClick}>
        Click for readings
      </button>      
      <div>
       {reads}
      </div>
    </div>
  );
}

