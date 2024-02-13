import React from 'react'
import { useTheme } from '@/components/theme-provider';

const ExerciseLibrary = () => {
    const { theme } = useTheme();

    // Determine the background color class based on the theme
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    return (
        <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
            <div>Exercise Library</div>
        </div>
    )
}

export default ExerciseLibrary