import React from 'react'

export default function LoadingBlock({loading,children,style,className}) {
    return (
        <div className={className} style={{transition: "0.2s", opacity: (loading ? 0.35 : 1), ...style}}>
            {children}
        </div>
    )
}