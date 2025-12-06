'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Building2, Calendar } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}

export function QuickStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Users"
                value="1"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                description="Active account"
            />
            <StatCard
                title="Organizations"
                value="0"
                icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                description="Create your first org"
            />
            <StatCard
                title="Status"
                value="Active"
                icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                description="Account is active"
            />
            <StatCard
                title="Member Since"
                value="Today"
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                description="Welcome!"
            />
        </div>
    );
}
