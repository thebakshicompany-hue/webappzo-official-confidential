'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getApps, createApp, deleteApp } from '@/lib/api/apps';
import type { EmbeddedApp } from '@/lib/pocketbase';
import { Plus, Trash2, ExternalLink, AppWindow } from 'lucide-react';
import Link from 'next/link';

export default function AppsPage() {
    const [apps, setApps] = useState<EmbeddedApp[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newAppName, setNewAppName] = useState('');
    const [newAppUrl, setNewAppUrl] = useState('');
    const [newAppIcon, setNewAppIcon] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadApps();
    }, []);

    const loadApps = async () => {
        const orgId = localStorage.getItem('currentOrgId');
        if (!orgId) {
            setLoading(false);
            return;
        }
        const fetchedApps = await getApps(orgId);
        setApps(fetchedApps);
        setLoading(false);
    };

    const handleCreateApp = async (e: React.FormEvent) => {
        e.preventDefault();
        const orgId = localStorage.getItem('currentOrgId');
        if (!orgId) return;

        setCreating(true);
        try {
            await createApp({
                name: newAppName,
                url: newAppUrl,
                icon: newAppIcon || undefined,
                organization: orgId,
            });
            setDialogOpen(false);
            setNewAppName('');
            setNewAppUrl('');
            setNewAppIcon('');
            loadApps();
        } catch (error) {
            console.error('Failed to create app:', error);
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteApp = async (appId: string) => {
        if (!confirm('Are you sure you want to delete this app?')) return;
        await deleteApp(appId);
        loadApps();
    };

    if (loading) {
        return (
            <main className="container max-w-4xl py-6">
                <p>Loading apps...</p>
            </main>
        );
    }

    return (
        <main className="container max-w-4xl py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Embedded Apps</h1>
                    <p className="text-muted-foreground">Manage your embedded applications</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add App
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Embedded App</DialogTitle>
                            <DialogDescription>
                                Add an external website to embed in your dashboard.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateApp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">App Name</Label>
                                <Input
                                    id="name"
                                    value={newAppName}
                                    onChange={(e) => setNewAppName(e.target.value)}
                                    placeholder="My App"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">URL</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={newAppUrl}
                                    onChange={(e) => setNewAppUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon (emoji, optional)</Label>
                                <Input
                                    id="icon"
                                    value={newAppIcon}
                                    onChange={(e) => setNewAppIcon(e.target.value)}
                                    placeholder="📱"
                                    maxLength={10}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={creating}>
                                    {creating ? 'Adding...' : 'Add App'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {apps.length === 0 ? (
                <Card className="bg-background/60 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AppWindow className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No apps added yet.</p>
                        <p className="text-sm text-muted-foreground">Click "Add App" to get started.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {apps.map((app) => (
                        <Card key={app.id} className="bg-background/60 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    {app.icon && <span>{app.icon}</span>}
                                    {app.name}
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/dashboard/apps/${app.id}`}>
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteApp(app.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground truncate">{app.url}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
}
