import React from 'react';
import '@/app/animated-themes.css';

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            <div className="animated-bg absolute inset-0 w-full h-full">
                {/* Main rotating circles */}
                <div className="animated-circle circle-1"></div>
                <div className="animated-circle circle-2"></div>
                <div className="animated-circle circle-3"></div>

                {/* Floating particles */}
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
                <div className="particle particle-4"></div>
                <div className="particle particle-5"></div>
                <div className="particle particle-6"></div>

                {/* Glowing orbs */}
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>

                {/* Wave lines */}
                <div className="wave wave-1"></div>
                <div className="wave wave-2"></div>
            </div>
        </div>
    );
}
