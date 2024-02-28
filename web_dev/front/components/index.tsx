import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('./Map'), { ssr: false });

function Map({ deviceID }: { deviceID: Number }) {
    return <DynamicMap deviceID={deviceID}  />;
}

export default Map
