'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePocketBaseAuth } from '@/hooks/use-pocketbase-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import '../../animated-bg.css';

export default function SignUpPage() {
    const router = useRouter();
    const { register, loading } = usePocketBaseAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await register(email, password, name);
            router.push('/select-organization');
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md auth-card-overlay border-white/20">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <Image
                            src="/webappzo-logo.png"
                            alt="WEBAPPZO"
                            width={200}
                            height={60}
                            priority
                        />
                    </div>
                    <CardTitle className="text-2xl text-center text-white">Create an account</CardTitle>
                    <CardDescription className="text-center text-gray-300">
                        Enter your information to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-md mb-4 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="name"
                                disabled={loading}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                disabled={loading}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                disabled={loading}
                                minLength={8}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                            <p className="text-xs text-gray-400">
                                Must be at least 8 characters long
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white font-semibold"
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-gray-300">
                        Already have an account?{' '}
                        <Link href="/sign-in" className="text-pink-400 hover:text-pink-300 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
