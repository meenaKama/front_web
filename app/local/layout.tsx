import React from 'react';


const LAYOUT = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className='flex flex-row w-full h-dvh'>
            {children}
        </div>
    )
}

export default LAYOUT