'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export function OrganizationCard() {
    const [orgName, setOrgName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get organization from localStorage
        const name = localStorage.getItem('current_organization_name');
        setOrgName(name);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Organization</CardTitle>
                    <CardDescription>Loading organization...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (!orgName) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Organization
                    </CardTitle>
                    <CardDescription>No organization selected</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/select-organization">
                        <Button>Select Organization</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Current Organization
                </CardTitle>
                <CardDescription>Your active workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">{orgName}</h3>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                    <Link href="/select-organization">
                        <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-2" />
                            Switch Org
                        </Button>
                    </Link>
                    <Button variant="outline" size="sm" disabled>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
