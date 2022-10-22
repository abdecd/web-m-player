import React from 'react'

export default function LoadingBlock({ loading, children, style, className, opacityMin=0.35, opacityMax=1, innerRef }) {
    return (
        <div ref={innerRef} className={className} style={{transition: "0.2s", opacity: (loading ? opacityMin : opacityMax), ...style}}>
            {children}
        </div>
    )
}