'use client';

import { useState, useEffect } from 'react';
import { getUserOrganizations } from '@/lib/api/pocketbase-client';
import type { Organization } from '@/lib/pocketbase';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building2, Check, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function OrganizationSelector() {
    const router = useRouter();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
    const [currentOrgName, setCurrentOrgName] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrganizations();

        // Get current organization from localStorage
        const orgId = localStorage.getItem('currentOrgId');
        const orgName = localStorage.getItem('currentOrgName');
        setCurrentOrgId(orgId);
        setCurrentOrgName(orgName || '');
    }, []);

    const loadOrganizations = async () => {
        try {
            const orgs = await getUserOrganizations();
            setOrganizations(orgs);
        } catch (err) {
            console.error('Failed to load organizations:', err);
        } finally {
            setLoading(false);
        }
    };

    const selectOrganization = (org: Organization) => {
        localStorage.setItem('currentOrgId', org.id);
        localStorage.setItem('currentOrgName', org.name);
        setCurrentOrgId(org.id);
        setCurrentOrgName(org.name);

        // Refresh the page to reload with new organization context
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-2 py-1.5">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">Loading...</span>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 font-normal">
                    <Building2 className="h-4 w-4" />
                    <span className="truncate">{currentOrgName || 'Select Organization'}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {organizations.map((org) => (
                    <DropdownMenuItem
                        key={org.id}
                        onClick={() => selectOrganization(org)}
                        className="flex items-center justify-between"
                    >
                        <span className="truncate">{org.name}</span>
                        {currentOrgId === org.id && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/select-organization')}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Create Organization</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
