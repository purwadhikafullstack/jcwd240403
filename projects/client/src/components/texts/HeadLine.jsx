import React from 'react'

function HeadLine({ label, className }) {
    return (
        <h1 className={`text-4xl font-bold  ${className}`}>
            {label}
        </h1>
    )
}

export default HeadLine