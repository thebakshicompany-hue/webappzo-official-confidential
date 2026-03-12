'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'neon' | 'ocean' | 'sunset' | 'aurora' | 'minimal' | 'plasma' | 'cyber' | 'galaxy' | 'deepsea' | 'forest' | 'supernova';

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
    { name: 'plasma', label: 'Plasma', colors: ['#ff0066', '#00ffff', '#0088ff'] },
    { name: 'cyber', label: 'Cyber', colors: ['#f3e600', '#ff003c', '#00dfff'] },
    { name: 'galaxy', label: 'Galaxy', colors: ['#6d28d9', '#ec4899', '#1e40af'] },
    { name: 'deepsea', label: 'Deep Sea', colors: ['#0f172a', '#1e40af', '#0ea5e9'] },
    { name: 'forest', label: 'Forest', colors: ['#064e3b', '#10b981', '#a7f3d0'] },
    { name: 'supernova', label: 'Supernova', colors: ['#f97316', '#dc2626', '#facc15'] },
    { name: 'minimal', label: 'Minimal', colors: ['#666666', '#999999', '#cccccc'] },
];

export interface ThemeContextType {
    theme: ThemeName;
    animationsEnabled: boolean;
    setTheme: (theme: ThemeName) => void;
    setAnimationsEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'animated-theme';
const ANIMATION_STORAGE_KEY = 'animations-enabled';

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeName>('neon');
    const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
        if (stored && themes.some(t => t.name === stored)) {
            setThemeState(stored);
        }

        const storedAnimations = localStorage.getItem(ANIMATION_STORAGE_KEY);
        if (storedAnimations !== null) {
            setAnimationsEnabledState(storedAnimations === 'true');
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem(STORAGE_KEY, theme);
            // Apply theme class to body
            const classes = Array.from(document.body.classList);
            classes.forEach(c => {
                if (c.startsWith('theme-')) document.body.classList.remove(c);
            });
            document.body.classList.add(`theme-${theme}`);
        }
    }, [theme, mounted]);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem(ANIMATION_STORAGE_KEY, animationsEnabled.toString());
            if (animationsEnabled) {
                document.body.classList.remove('no-animations');
            } else {
                document.body.classList.add('no-animations');
            }
        }
    }, [animationsEnabled, mounted]);

    const setTheme = (newTheme: ThemeName) => {
        setThemeState(newTheme);
    };

    const setAnimationsEnabled = (enabled: boolean) => {
        setAnimationsEnabledState(enabled);
    };

    return (
        <ThemeContext.Provider value={{ theme, animationsEnabled, setTheme, setAnimationsEnabled }}>
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
