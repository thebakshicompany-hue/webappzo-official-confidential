'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin } from 'lucide-react';

export function ClockWidget() {
    const [time, setTime] = useState(new Date());
    const [timezone, setTimezone] = useState('');

    useEffect(() => {
        // Get user's timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(tz);

        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: timezone || undefined,
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: timezone || undefined,
        });
    };

    const getTimezoneAbbr = () => {
        return new Date().toLocaleTimeString('en-US', {
            timeZoneName: 'short',
            timeZone: timezone || undefined,
        }).split(' ').pop();
    };

    return (
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Clock
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold tabular-nums">{formatTime(time)}</div>
                <div className="text-sm text-muted-foreground mt-1">{formatDate(time)}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <MapPin className="h-3 w-3" />
                    <span>{timezone} ({getTimezoneAbbr()})</span>
                </div>
            </CardContent>
        </Card>
    );
}
