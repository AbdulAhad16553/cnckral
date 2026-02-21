import React from 'react'
import { cn } from '@/lib/utils'

interface AnimatedSkeletonProps {
    className?: string
    style?: React.CSSProperties
}

const AnimatedSkeleton = ({ className = '', style }: AnimatedSkeletonProps) => {
    return (
        <div
            className={cn("rounded-md skeleton-shimmer", className)}
            style={style}
        />
    )
}

export default AnimatedSkeleton