'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { X, Plus, GripVertical } from 'lucide-react';

const STORAGE_KEY = 'dashboard_widget_layout';

export interface WidgetConfig {
    id: string;
    name: string;
    component: ReactNode;
    size?: 'small' | 'medium' | 'large';
}

interface WidgetGridProps {
    availableWidgets: WidgetConfig[];
    defaultWidgets: string[];
}

export function WidgetGrid({ availableWidgets, defaultWidgets }: WidgetGridProps) {
    const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
    const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setActiveWidgets(JSON.parse(saved));
            } catch {
                setActiveWidgets(defaultWidgets);
            }
        } else {
            setActiveWidgets(defaultWidgets);
        }
    }, [defaultWidgets]);

    const saveLayout = (widgets: string[]) => {
        setActiveWidgets(widgets);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    };

    const removeWidget = (id: string) => {
        saveLayout(activeWidgets.filter((w) => w !== id));
    };

    const addWidget = (id: string) => {
        if (!activeWidgets.includes(id)) {
            saveLayout([...activeWidgets, id]);
        }
        setDialogOpen(false);
    };

    const handleDragStart = (id: string) => {
        setDraggedWidget(id);
    };

    const handleDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedWidget || draggedWidget === targetId) return;

        const newWidgets = [...activeWidgets];
        const draggedIndex = newWidgets.indexOf(draggedWidget);
        const targetIndex = newWidgets.indexOf(targetId);

        if (draggedIndex !== -1 && targetIndex !== -1) {
            newWidgets.splice(draggedIndex, 1);
            newWidgets.splice(targetIndex, 0, draggedWidget);
            saveLayout(newWidgets);
        }
    };

    const handleDragEnd = () => {
        setDraggedWidget(null);
    };

    const inactiveWidgets = availableWidgets.filter((w) => !activeWidgets.includes(w.id));

    const getSizeClass = (size?: 'small' | 'medium' | 'large') => {
        switch (size) {
            case 'large':
                return 'md:col-span-2';
            case 'medium':
                return 'md:col-span-1';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Widgets</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Widget
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Widget</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {inactiveWidgets.length === 0 ? (
                                <p className="col-span-2 text-muted-foreground text-center py-4">
                                    All widgets are already added.
                                </p>
                            ) : (
                                inactiveWidgets.map((widget) => (
                                    <Button
                                        key={widget.id}
                                        variant="outline"
                                        className="justify-start"
                                        onClick={() => addWidget(widget.id)}
                                    >
                                        {widget.name}
                                    </Button>
                                ))
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {activeWidgets.map((widgetId) => {
                    const widget = availableWidgets.find((w) => w.id === widgetId);
                    if (!widget) return null;

                    return (
                        <div
                            key={widget.id}
                            className={`relative group ${getSizeClass(widget.size)} ${draggedWidget === widget.id ? 'opacity-50' : ''
                                }`}
                            draggable
                            onDragStart={() => handleDragStart(widget.id)}
                            onDragOver={(e) => handleDragOver(e, widget.id)}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => removeWidget(widget.id)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                            <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            {widget.component}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
