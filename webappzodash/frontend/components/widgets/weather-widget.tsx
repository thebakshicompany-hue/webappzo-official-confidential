'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Snowflake, Wind } from 'lucide-react';

interface WeatherData {
    temp: string;
    condition: string;
    location: string;
}

export function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchWeather();
    }, []);

    const fetchWeather = async () => {
        try {
            const res = await fetch('https://wttr.in/?format=%t|%C|%l');
            const text = await res.text();
            const [temp, condition, location] = text.split('|');
            setWeather({ temp: temp.trim(), condition: condition.trim(), location: location.trim() });
        } catch {
            setError('Unable to fetch weather');
        } finally {
            setLoading(false);
        }
    };

    const getWeatherIcon = (condition: string) => {
        const c = condition.toLowerCase();
        if (c.includes('rain') || c.includes('drizzle')) return <CloudRain className="h-8 w-8 text-blue-400" />;
        if (c.includes('snow')) return <Snowflake className="h-8 w-8 text-cyan-300" />;
        if (c.includes('cloud') || c.includes('overcast')) return <Cloud className="h-8 w-8 text-gray-400" />;
        if (c.includes('wind')) return <Wind className="h-8 w-8 text-teal-400" />;
        return <Sun className="h-8 w-8 text-yellow-400" />;
    };

    return (
        <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Cloud className="h-4 w-4" />
                    Weather
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-muted-foreground">Loading...</div>
                ) : error ? (
                    <div className="text-destructive text-sm">{error}</div>
                ) : weather ? (
                    <div className="flex items-center gap-4">
                        {getWeatherIcon(weather.condition)}
                        <div>
                            <div className="text-2xl font-bold">{weather.temp}</div>
                            <div className="text-sm text-muted-foreground">{weather.condition}</div>
                            <div className="text-xs text-muted-foreground">{weather.location}</div>
                        </div>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
