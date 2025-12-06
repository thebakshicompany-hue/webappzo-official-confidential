'use client';

import pb from '@/lib/pocketbase';
import type { EmbeddedApp } from '@/lib/pocketbase';

export async function getApps(organizationId: string): Promise<EmbeddedApp[]> {
    try {
        const records = await pb.collection('embedded_apps').getFullList<EmbeddedApp>({
            filter: `organization = "${organizationId}"`,
            sort: 'name',
        });
        return records;
    } catch (error) {
        console.error('Failed to fetch apps:', error);
        return [];
    }
}

export async function getApp(appId: string): Promise<EmbeddedApp | null> {
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
