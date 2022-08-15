import React from 'react'

export default function LoadingBlock({children,loading,style}) {
    return (
        <div style={{transition: "0.2s", opacity: (loading ? 0.35 : 1), ...style}}>
            {children}
        </div>
    )
}
