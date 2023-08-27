import React from 'react'

function Caption
    ({ label, className }) {
    return (
        <h1 className={`text-xs font-normal  ${className}`}>
            {label}
        </h1>
    )
}

export default Caption
