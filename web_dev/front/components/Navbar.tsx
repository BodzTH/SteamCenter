import Link from 'next/link';
import Image from 'next/image';

function Navbar() {

  return (


    <nav className=' flexBetween navbar mb-10 '>
      <div className='flex-1 flexStart  '>
        <Link href="/" className='ml-6 ' >
          <Image className='max-w-none'
            src="/noun-sliders.svg" alt="Bookz"
            width={90}
            height={10}
          />

        </Link>
        {/* p-10 vs ml-10 mr-10 gap?*/}

        {/* Title */}
        <div className='flexBetween ml-10'>
          <h1 className=' text-3xl flexBetween flex-shrink-0 '>
            The Big Fu** Organization For Noise Reduction
          </h1>
        </div>
        {/* Search block */}
        <div className=' ml-auto mr-10 gap-x-5 flexBetween flex-shrink-0 '>
          <div className='flexBetween'>

            {/* Search bar */}

          </div>

          <div className='flexBetween flex-shrink-0'>
            <button className='flexBetween ' >
            </button>
          </div>

          <div>
            <ul className=' flexBetween pb-10 pt-10 gap-7 text-2xl flex-shrink-0 '>
              <Link href={"/reports"}>Reports</Link>

            </ul>
          </div>

        </div>


      </div>
    </nav>
  )
}
export default Navbar;