'use client';

import { useTheme, themes, ThemeName } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette } from 'lucide-react';

export function ThemePicker() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Palette className="h-5 w-5" />
                    <span className="sr-only">Choose theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-black/80 backdrop-blur-md border-white/20">
                {themes.map((t) => (
                    <DropdownMenuItem
                        key={t.name}
                        onClick={() => setTheme(t.name)}
                        className={`flex items-center gap-3 cursor-pointer text-white hover:bg-white/10 ${theme === t.name ? 'bg-white/20' : ''
                            }`}
                    >
                        <div className="flex gap-1">
                            {t.colors.map((color, i) => (
                                <div
                                    key={i}
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                        <span>{t.label}</span>
                        {theme === t.name && <span className="ml-auto">✓</span>}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
