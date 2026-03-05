import React from 'react';

export default function SectionDivider({ color = '#ffffff', shape = 'wave' }) {

    // SVG Paths for different shapes
    let path = "";

    switch (shape) {
        case 'curve-up':
            path = "M0,120 C400,0 800,0 1200,120 Z";
            break;
        case 'curve-down':
            path = "M0,0 L0,120 L1200,120 L1200,0 C800,120 400,120 0,0 Z";
            break;
        case 'triangle':
            path = "M0,120 L600,0 L1200,120 Z";
            break;
        case 'wave':
        default:
            path = "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50.28,21.5,103.59,42.5,157.17,54.7,212.16,67.2,266.36,66.5,321.39,56.44Z";
            break;
    }

    return (
        <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'translateY(1px)' }}>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '50px' }}>
                <path d={path} fill={color}></path>
            </svg>
        </div>
    );
}
