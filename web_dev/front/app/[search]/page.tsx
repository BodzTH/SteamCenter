'use client'
import { useSearchParams } from "next/navigation";
import { getBooksBySearchQuery } from "@/cartstore/cartstore";


function SearchFound() {
  const searchParams = useSearchParams()
  const search = searchParams.get('q')
  const query = getBooksBySearchQuery(search ?? '')


  return (
    <div>
      <span className=" text-5xl"><h1>Search Found: {query.length}</h1></span>
    </div>
  );
}

export default SearchFound;
