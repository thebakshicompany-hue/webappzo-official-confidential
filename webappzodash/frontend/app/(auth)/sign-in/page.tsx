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

export default function SignInPage() {
    const router = useRouter();
    const { login, loginWithGoogle, loading } = usePocketBaseAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err?.message || 'Invalid email or password');
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        try {
            await loginWithGoogle();
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Google login error:', err);
            setError('Google login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
            <Card className="w-full max-w-[340px] sm:max-w-md auth-card-overlay border-white/20 shadow-2xl">
                <CardHeader className="space-y-1 p-4 sm:p-6 pb-2 sm:pb-4">
                    <div className="flex items-center justify-center mb-2 sm:mb-4">
                        <Image
                            src="/webappzo-logo.png"
                            alt="WEBAPPZO"
                            width={160}
                            height={48}
                            priority
                            className="w-32 sm:w-48 h-auto"
                        />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl text-center text-white">Welcome back</CardTitle>
                    <CardDescription className="text-center text-gray-300 text-xs sm:text-sm">
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-2 sm:pt-4">
                    {error && (
                        <div className="bg-red-500/10 text-red-400 px-3 py-2 sm:px-4 sm:py-3 rounded-md mb-3 sm:mb-4 border border-red-500/20 text-xs">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="email" className="text-white text-xs sm:text-sm">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                disabled={loading}
                                className="h-9 sm:h-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm"
                            />
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="password" className="text-white text-xs sm:text-sm">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                disabled={loading}
                                minLength={8}
                                className="h-9 sm:h-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm"
                            />
                        </div>

                        <div className="pt-1">
                            <Button
                                type="submit"
                                className="w-full h-10 sm:h-11 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white font-bold text-sm"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 my-1 sm:my-2">
                            <div className="flex-1 h-[1px] bg-white/10"></div>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">OR</span>
                            <div className="flex-1 h-[1px] bg-white/10"></div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full h-10 sm:h-11 bg-white/5 border-white/10 text-white hover:bg-white/10 flex items-center justify-center gap-3 text-sm font-bold"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.32-2.04 4.44-1.12 1.12-2.8 2.32-5.8 2.32-4.81 0-8.68-3.92-8.68-8.73s3.87-8.73 8.68-8.73c2.6 0 4.56 1.02 5.96 2.35l2.36-2.36C18.44 1.44 15.64 0 12.48 0 5.58 0 0 5.58 0 12.48s5.58 12.48 12.48 12.48c3.75 0 6.58-1.24 8.75-3.52 2.21-2.21 2.91-5.35 2.91-7.85 0-.54-.05-1.07-.15-1.58h-11.5z" />
                            </svg>
                            Continue with Google
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-xs text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/sign-up" className="text-pink-400 font-bold hover:text-pink-300 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
