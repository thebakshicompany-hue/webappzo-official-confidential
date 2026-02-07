'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote } from 'lucide-react';

const STORAGE_KEY = 'dashboard_notes';

export function NotesWidget() {
    const [notes, setNotes] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setNotes(saved);
    }, []);

    const handleChange = (value: string) => {
        setNotes(value);
        localStorage.setItem(STORAGE_KEY, value);
    };

    return (
        <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <StickyNote className="h-4 w-4" />
                    Quick Notes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="Write your notes here..."
                    value={notes}
                    onChange={(e) => handleChange(e.target.value)}
                    className="min-h-[100px] resize-none bg-background/50"
                />
            </CardContent>
        </Card>
    );
}
