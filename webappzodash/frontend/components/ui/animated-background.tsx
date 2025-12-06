import React from 'react';
import '@/app/animated-themes.css';

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            <div className="animated-bg absolute inset-0 w-full h-full">
                <div className="animated-circle circle-1"></div>
                <div className="animated-circle circle-2"></div>
                <div className="animated-circle circle-3"></div>
            </div>
        </div>
    );
}
