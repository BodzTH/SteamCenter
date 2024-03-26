import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
interface AudiosBlockProps {
    path: string;
    id: number;
    sendDataToParent: (id: number) => void;
}

function AudiosBlock({ id, path, sendDataToParent }: AudiosBlockProps) {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = () => {
        setIsSelected(!isSelected);
    };
    useEffect(() => {
        if (isSelected) {
            sendDataToParent(id);
        }
        else {
            sendDataToParent(0);
        }

    }
        , [isSelected]);

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