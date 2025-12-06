'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePocketBaseAuth } from '@/hooks/use-pocketbase-auth';
import { getUserOrganizations, createOrganization } from '@/lib/api/pocketbase-client';
import type { Organization } from '@/lib/pocketbase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import Image from 'next/image';

export default function SelectOrganizationPage() {
	const router = useRouter();
	const { user, loading: authLoading } = usePocketBaseAuth();
	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const [loading, setLoading] = useState(true);
	const [creating, setCreating] = useState(false);
	const [newOrgName, setNewOrgName] = useState('');
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/sign-in');
			return;
		}

		if (user) {
			loadOrganizations();
		}
	}, [user, authLoading, router]);

	const loadOrganizations = async () => {
		try {
			const orgs = await getUserOrganizations();
			setOrganizations(orgs);

			// If user has exactly one org, auto-select it
			if (orgs.length === 1) {
				selectOrganization(orgs[0]);
			}
		} catch (err) {
			console.error('Failed to load organizations:', err);
			setError('Failed to load organizations');
		} finally {
			setLoading(false);
		}
	};

	const selectOrganization = (org: Organization) => {
		// Save selected organization to localStorage
		localStorage.setItem('currentOrgId', org.id);
		localStorage.setItem('currentOrgName', org.name);
		router.push('/dashboard');
	};

	const handleCreateOrganization = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setCreating(true);

		try {
			const org = await createOrganization(newOrgName);
			// Auto-select the new organization
			selectOrganization(org);
		} catch (err: any) {
			console.error('Failed to create organization:', err);
			setError(err?.message || 'Failed to create organization');
		} finally {
			setCreating(false);
		}
	};

	if (authLoading || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Loading...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader className="space-y-1">
					<div className="flex items-center justify-center mb-4">
						<Image
							src="/webappzo-logo.png"
							alt="WEBAPPZO"
							width={160}
							height={50}
						/>
					</div>
					<CardTitle className="text-2xl text-center">Select an organization</CardTitle>
					<CardDescription className="text-center">
						Choose an organization to continue or create a new one
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{error && (
						<div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
							{error}
						</div>
					)}

					{/* Existing Organizations */}
					{organizations.length > 0 && (
						<div className="space-y-3">
							<h3 className="font-semibold">Your Organizations</h3>
							<div className="grid gap-3">
								{organizations.map((org) => (
									<Button
										key={org.id}
										variant="outline"
										className="h-auto p-4 justify-start"
										onClick={() => selectOrganization(org)}
									>
										<div className="text-left">
											<p className="font-semibold">{org.name}</p>
											{org.description && (
												<p className="text-sm text-muted-foreground">{org.description}</p>
											)}
										</div>
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Create New Organization */}
					<div className="space-y-3">
						<h3 className="font-semibold flex items-center gap-2">
							<Plus className="size-4" />
							Create New Organization
						</h3>
						<form onSubmit={handleCreateOrganization} className="space-y-3">
							<div className="space-y-2">
								<Label htmlFor="orgName">Organization Name</Label>
								<Input
									id="orgName"
									type="text"
									placeholder="My Organization"
									value={newOrgName}
									onChange={(e) => setNewOrgName(e.target.value)}
									required
									disabled={creating}
								/>
							</div>
							<Button type="submit" className="w-full" disabled={creating}>
								{creating ? 'Creating...' : 'Create Organization'}
							</Button>
						</form>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
