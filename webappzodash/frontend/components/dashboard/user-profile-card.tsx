'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePocketBaseAuth } from "@/hooks/use-pocketbase-auth";
import { User, Mail, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserProfileCard() {
    const { user } = usePocketBaseAuth();

    if (!user) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                    <CardDescription>Loading user information...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : user.email[0].toUpperCase();

    const joinedDate = new Date(user.created).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Profile
                </CardTitle>
                <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-lg">{user.name || 'User'}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {user.email}
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Member since {joinedDate}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
