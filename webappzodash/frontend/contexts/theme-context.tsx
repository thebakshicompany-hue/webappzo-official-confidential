'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'neon' | 'ocean' | 'sunset' | 'aurora' | 'minimal' | 'plasma';

export interface ThemeOption {
    name: ThemeName;
    label: string;
    colors: string[];
}

export const themes: ThemeOption[] = [
    { name: 'neon', label: 'Neon', colors: ['#ff0080', '#ffff00', '#00ff00'] },
    { name: 'ocean', label: 'Ocean', colors: ['#0066ff', '#00ccff', '#00ffcc'] },
    { name: 'sunset', label: 'Sunset', colors: ['#ff6600', '#ff3366', '#cc00ff'] },
    { name: 'aurora', label: 'Aurora', colors: ['#00ff88', '#8800ff', '#00aaff'] },
    { name: 'minimal', label: 'Minimal', colors: ['#666666', '#999999', '#cccccc'] },
    { name: 'plasma', label: 'Plasma', colors: ['#ff0066', '#00ffff', '#0088ff'] },
];

interface ThemeContextType {
    theme: ThemeName;
    setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'animated-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeName>('neon');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
        if (stored && themes.some(t => t.name === stored)) {
            setThemeState(stored);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem(STORAGE_KEY, theme);
            // Apply theme class to body
            document.body.className = document.body.className
                .replace(/theme-\w+/g, '')
                .trim();
            document.body.classList.add(`theme-${theme}`);
        }
    }, [theme, mounted]);

    const setTheme = (newTheme: ThemeName) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
