import pb from '../pocketbase';
import type { User, Organization, UserOrganization } from '../pocketbase';

// ============================================
// AUTHENTICATION
// ============================================

export async function signUp(email: string, password: string, name: string) {
    const data = {
        email,
        password,
        passwordConfirm: password,
        name,
        emailVisibility: true,
    };

    const record = await pb.collection('users').create(data);

    // Send verification email
    await pb.collection('users').requestVerification(email);

    return record;
}

export async function signIn(email: string, password: string) {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return authData;
}

export async function signOut() {
    pb.authStore.clear();
}

export async function getCurrentUser(): Promise<User | null> {
    if (!pb.authStore.isValid || !pb.authStore.token) {
        return null;
    }

    try {
        // Refresh the auth token
        const authData = await pb.collection('users').authRefresh();
        return authData.record as unknown as User;
    } catch (error: any) {
        // Only log non-network errors
        if (error?.status !== 0) {
            console.error('Failed to get current user:', error);
        }
        pb.authStore.clear();
        return null;
    }
}

export function isAuthenticated(): boolean {
    return pb.authStore.isValid;
}

// ============================================
// ORGANIZATIONS
// ============================================

export async function createOrganization(name: string, description?: string) {
    const user = pb.authStore.model;
    if (!user) throw new Error('User not authenticated');

    // Create organization
    const org = await pb.collection('organizations').create({
        name,
        description,
        owner: user.id,
        created_by: user.id,
    });

    // Create user-organization relationship with owner role
    await pb.collection('user_organizations').create({
        user: user.id,
        organization: org.id,
        role: 'owner',
    });

    return org as unknown as Organization;
}

export async function getUserOrganizations(): Promise<Organization[]> {
    const user = pb.authStore.model;
    if (!user) return [];

    try {
        // Get user-organization relationships
        const userOrgs = await pb.collection('user_organizations').getFullList({
            filter: `user = "${user.id}"`,
            expand: 'organization',
        });

        // Extract organizations from expanded data
        const organizations = userOrgs
            .map((userOrg: any) => userOrg.expand?.organization)
            .filter(Boolean);

        return organizations as Organization[];
    } catch (error) {
        console.error('Failed to get user organizations:', error);
        return [];
    }
}

export async function getOrganization(id: string): Promise<Organization | null> {
    try {
        const org = await pb.collection('organizations').getOne(id);
        return org as unknown as Organization;
    } catch (error) {
        console.error('Failed to get organization:', error);
        return null;
    }
}

export async function updateOrganization(id: string, data: Partial<Organization>) {
    return await pb.collection('organizations').update(id, data);
}

export async function deleteOrganization(id: string) {
    return await pb.collection('organizations').delete(id);
}

// ============================================
// ORGANIZATION MEMBERS
// ============================================

export async function addOrganizationMember(
    organizationId: string,
    userId: string,
    role: 'member' | 'admin' = 'member'
) {
    return await pb.collection('user_organizations').create({
        user: userId,
        organization: organizationId,
        role,
    });
}

export async function getOrganizationMembers(organizationId: string) {
    const members = await pb.collection('user_organizations').getFullList({
        filter: `organization = "${organizationId}"`,
        expand: 'user',
    });

    return members;
}

export async function updateMemberRole(
    userOrgId: string,
    role: 'member' | 'admin' | 'owner'
) {
    return await pb.collection('user_organizations').update(userOrgId, { role });
}

export async function removeMemberFromOrganization(userOrgId: string) {
    return await pb.collection('user_organizations').delete(userOrgId);
}

// ============================================
// REALTIME SUBSCRIPTIONS
// ============================================

export function subscribeToOrganizations(
    callback: (data: any) => void
): () => void {
    const user = pb.authStore.model;
    if (!user) return () => { };

    pb.collection('organizations').subscribe('*', callback);

    // Return unsubscribe function
    return () => {
        pb.collection('organizations').unsubscribe('*');
    };
}

export function subscribeToOrganization(
    organizationId: string,
    callback: (data: any) => void
): () => void {
    pb.collection('organizations').subscribe(organizationId, callback);

    return () => {
        pb.collection('organizations').unsubscribe(organizationId);
    };
}
