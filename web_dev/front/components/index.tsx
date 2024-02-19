import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('./Map'), { ssr: false });


function Map() {
    return <DynamicMap />;


}

export default Map
