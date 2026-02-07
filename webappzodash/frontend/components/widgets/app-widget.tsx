'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface AppWidgetProps {
    name: string;
    href: string;
    icon: LucideIcon;
    color: string;
    description?: string;
}

export function AppWidget({ name, href, icon: Icon, color, description }: AppWidgetProps) {
    return (
        <Link href={href}>
            <Card className="bg-gradient-to-br from-slate-500/20 to-slate-600/20 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all cursor-pointer h-full">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-background/50 ${color}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-medium text-sm">{name}</div>
                        {description && (
                            <div className="text-xs text-muted-foreground">{description}</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
