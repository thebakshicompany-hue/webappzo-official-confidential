import PocketBase from 'pocketbase';

// Initialize PocketBase client
const pb = new PocketBase(
    process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
);

// Enable auto cancellation for pending requests
pb.autoCancellation(false);

// Optional: Configure default settings
pb.beforeSend = function (url, options) {
    // Add custom headers or modify requests globally
    // options.headers = { ...options.headers, 'Custom-Header': 'value' };
    return { url, options };
};

// Export the PocketBase instance
export default pb;

// Type definitions for collections
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    created: string;
    updated: string;
    verified: boolean;
}

export interface Organization {
    id: string;
    name: string;
    description?: string;
    logo?: string;
    owner: string;
    created_by: string;
    created: string;
    updated: string;
}

export interface UserOrganization {
    id: string;
    user: string;
    organization: string;
    role: 'member' | 'admin' | 'owner';
    created: string;
    updated: string;
}

export interface EmbeddedApp {
    id: string;
    name: string;
    url: string;
    icon?: string;
    organization: string;
    created_by: string;
    created: string;
    updated: string;
}

