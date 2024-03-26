import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('./Map'), { ssr: false });

function Map({ deviceID, height }: { height: string, deviceID: Number }) {
    return <DynamicMap deviceID={deviceID} height={height} />;
}

export default Map
