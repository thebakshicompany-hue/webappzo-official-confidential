'use client';

import pb from '@/lib/pocketbase';
import type { EmbeddedApp } from '@/lib/pocketbase';

export const HARDCODED_APPS: EmbeddedApp[] = [
    {
        id: 'video-editor',
        name: 'Video Editor',
        url: 'https://v0-webappzo-editz.vercel.app/',
        icon: '🎬',
        organization: 'system',
        created_by: 'system',
        created: '2023-12-08T12:00:00.000Z',
        updated: '2023-12-08T12:00:00.000Z',
    },
    {
        id: 'calculator',
        name: 'Calculator',
        url: 'https://staging-calculator-app-e7qi.frontend.encr.app/',
        icon: '🧮',
        organization: 'system',
        created_by: 'system',
        created: '2023-12-08T12:00:00.000Z',
        updated: '2023-12-08T12:00:00.000Z',
    },
    {
        id: 'edit-app-website',
        name: 'Edit your app / website',
        url: 'https://tally.so/r/A7B9Go',
        icon: '📝',
        organization: 'system',
        created_by: 'system',
        created: '2023-12-08T12:00:00.000Z',
        updated: '2023-12-08T12:00:00.000Z',
    }
];

export async function getApps(organizationId: string): Promise<EmbeddedApp[]> {
    try {
        const records = await pb.collection('embedded_apps').getFullList<EmbeddedApp>({
            filter: `organization = "${organizationId}"`,
            sort: 'name',
        });
        return [...HARDCODED_APPS, ...records];
    } catch (error) {
        console.error('Failed to fetch apps:', error);
        // Return hardcoded apps even if DB fails
        return HARDCODED_APPS;
    }
}

export async function getApp(appId: string): Promise<EmbeddedApp | null> {
    const hardcodedApp = HARDCODED_APPS.find(app => app.id === appId);
    if (hardcodedApp) return hardcodedApp;

    try {
        const record = await pb.collection('embedded_apps').getOne<EmbeddedApp>(appId);
        return record;
    } catch (error) {
        console.error('Failed to fetch app:', error);
        return null;
    }
}

export async function createApp(data: {
    name: string;
    url: string;
    icon?: string;
    organization: string;
}): Promise<EmbeddedApp> {
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error('Not authenticated');

    const record = await pb.collection('embedded_apps').create<EmbeddedApp>({
        ...data,
        created_by: userId,
    });
    return record;
}

export async function deleteApp(appId: string): Promise<boolean> {
    try {
        await pb.collection('embedded_apps').delete(appId);
        return true;
    } catch (error) {
        console.error('Failed to delete app:', error);
        return false;
    }
}
