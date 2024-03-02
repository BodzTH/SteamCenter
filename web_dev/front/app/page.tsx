
import Device from "@/components/Device";
import Search from "@/components/Search";


function Home() {

  return (
    <main >
      <div className="flexBetween mb-10 border-b-2 border-border-color">
        <div className="flexStart">
          <h1 className='text-5xl ml-5 mb-5 mr-2'>
            Devices
          </h1>
          <div className={" counter flex items-center justify-center w-9 h-9 bg-black mb-3 text-white rounded-full"}>1</div>

        </div>
        <Search />
      </div>
      <div>
        {
          <Device />
        }
      </div>

    </main >
  )

}


export default Home;