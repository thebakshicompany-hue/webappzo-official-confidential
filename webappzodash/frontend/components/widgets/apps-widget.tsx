'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Circle, AppWindow, PenTool, Video, FileText } from 'lucide-react';
import Link from 'next/link';

const apps = [
    { name: 'Recorder', href: '/dashboard/recorder', icon: Circle, color: 'text-red-500' },
    { name: 'Browser', href: '/dashboard/browser', icon: AppWindow, color: 'text-blue-500' },
    { name: 'Whiteboard', href: '/dashboard/whiteboard', icon: PenTool, color: 'text-green-500' },
    { name: 'Meetings', href: '/dashboard/meetings', icon: Video, color: 'text-purple-500' },
    { name: 'PDF Viewer', href: '/dashboard/pdf-viewer', icon: FileText, color: 'text-orange-500' },
];

export function AppsWidget() {
    return (
        <Card className="bg-gradient-to-br from-indigo-500/20 to-pink-500/20 backdrop-blur-sm border-white/10 col-span-2">
            <CardContent className="p-4">
                <div className="text-sm font-medium mb-3">Quick Access</div>
                <div className="grid grid-cols-5 gap-2">
                    {apps.map((app) => (
                        <Link
                            key={app.name}
                            href={app.href}
                            className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <app.icon className={`h-6 w-6 ${app.color}`} />
                            <span className="text-xs text-muted-foreground">{app.name}</span>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
