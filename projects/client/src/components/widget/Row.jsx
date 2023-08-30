import React from 'react'

function Row({ className, children }) {
    return (
        <div className={`flex flex-row w-fit ${className}`}>
            {children}
        </div>
    )
}

export default Row