import React from 'react'

export default function LoadingBlock({ loading, children, style, opacityMin=0.35, opacityMax=1, innerRef, textHint="", ...remain }) {
    return (
        <div {...remain} ref={innerRef} style={{transition: "0.2s", opacity: (loading ? opacityMin : opacityMax), ...style}}>
            {loading&&textHint ? <p style={{textAlign: "center"}}>{textHint}</p> : children}
        </div>
    )
}