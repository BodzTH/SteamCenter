import React, { useState } from 'react';
import ReactPlayer from 'react-player';

function AudiosBlock({ path }: { path: string }) {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = () => {
        setIsSelected(!isSelected);
    };



    return (
        <div>
            <div onClick={handleClick} style={{ cursor: 'pointer', backgroundColor: isSelected ? 'lightgray' : 'white' }}>
                Audio: {path}
            </div>
            {isSelected && (
                <ReactPlayer
                    url={`http://localhost:5090/files${path}`}
                    controls={true}
                    playing={false}
                    width="100%"
                    height="50px"
                />
            )}
        </div>
    );
}

export default AudiosBlock;