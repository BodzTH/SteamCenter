'use client';
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

// ... (imports)

function Home() {
  const [reads, setReads] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function getTempReadings() {
    try {
      setLoading(true);
      const response = await axios.get<any[]>(
        "http://192.168.1.7:5030/nextThum"
      );
      const newReads = response.data;
      setReads(newReads);
      setError(null);
    } catch (error) {
      console.error("Error fetching readings:", error);
      setError("Error fetching readings. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTempReadings();
  }, []); // Fetch readings on component mount

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Noise Pollution Readings</h1>
      <div className="flex mb-4">
        <input
          className="border border-gray-400 p-2 mr-2 flex-1"
          type="text"
          placeholder="Enter your value"
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleClick}
        >
          Refresh Readings
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div>
        {reads.length > 0 && (
          <ul className="list-disc pl-4">
            {reads.map((reading, index) => (
              <li key={index}>{reading}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  function handleClick() {
    getTempReadings();
  }
}

export default Home;