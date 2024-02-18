'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

function Search() {

    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    function handleSearch() {
        const query = searchTerm.trim(); // Get the search term

        // Update the URL to the search page with the query parameter
        router.push(`/search?q=${query}`);
    }



    return (
        <div className='flexStart mr-5'>
            <button className='pr-2 flexBetween ml-20 ' onClick={() => { handleSearch() }}>
                <Link href={`/search?q=${searchTerm}`}>
                    <Image
                        src="/search.svg"
                        alt="Bookz"
                        width={45}
                        height={10}
                    />
                </Link>
            </button>
            <input
                className="searchbar text-center placeholder:white"
                placeholder={"search for a device..."}
                onBlur={(e) => {
                    setSearchTerm(e.currentTarget.value); // Update the search term state
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        const inputValue = e.currentTarget.value.trim();
                        if (inputValue) { // Check if the input value is not empty
                            setSearchTerm(inputValue); // Update the search term state
                            router.push(`/searxch?q=${inputValue}`); // Navigate to the search page
                        }
                    }
                }}
                defaultValue={searchTerm}
            />


        </div>
    );
}

export default Search;
