'use client';

import { useState } from 'react';
import { usePocketBaseAuth } from '@/hooks/use-pocketbase-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import pb from '@/lib/pocketbase';

export default function TestPocketBasePage() {
    const { user, loading, error, isAuthenticated, login, register, logout } = usePocketBaseAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setActionError(null);
        try {
            await login(email, password);
        } catch (err: any) {
            setActionError(err.message || 'Login failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setActionError(null);
        try {
            await register(email, password, name);
        } catch (err: any) {
            setActionError(err.message || 'Registration failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleLogout = async () => {
        setActionLoading(true);
        try {
            await logout();
        } catch (err: any) {
            setActionError(err.message || 'Logout failed');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">PocketBase Integration Test</h1>

            {/* Connection Status */}
            <Card className="p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Connection Status</h2>
                <div className="space-y-2">
                    <p>
                        <strong>PocketBase URL:</strong>{' '}
                        <code className="bg-muted px-2 py-1 rounded">
                            {process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'}
                        </code>
                    </p>
                    <p>
                        <strong>Auth Store Valid:</strong>{' '}
                        <span className={pb.authStore.isValid ? 'text-green-600' : 'text-red-600'}>
                            {pb.authStore.isValid ? '✓ Yes' : '✗ No'}
                        </span>
                    </p>
                    <p>
                        <strong>Status:</strong>{' '}
                        {loading ? (
                            <span className="text-yellow-600">Loading...</span>
                        ) : isAuthenticated ? (
                            <span className="text-green-600">✓ Authenticated</span>
                        ) : (
                            <span className="text-gray-600">Not authenticated</span>
                        )}
                    </p>
                </div>
            </Card>

            {/* User Info */}
            {isAuthenticated && user && (
                <Card className="p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Current User</h2>
                    <div className="space-y-2">
                        <p>
                            <strong>ID:</strong> <code className="bg-muted px-2 py-1 rounded">{user.id}</code>
                        </p>
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                            <strong>Name:</strong> {user.name}
                        </p>
                        <p>
                            <strong>Verified:</strong>{' '}
                            <span className={user.verified ? 'text-green-600' : 'text-yellow-600'}>
                                {user.verified ? '✓ Yes' : '✗ No'}
                            </span>
                        </p>
                    </div>
                    <Button onClick={handleLogout} disabled={actionLoading} className="mt-4">
                        {actionLoading ? 'Logging out...' : 'Logout'}
                    </Button>
                </Card>
            )}

            {/* Auth Forms */}
            {!isAuthenticated && (
                <Card className="p-6">
                    <div className="flex gap-4 mb-6">
                        <Button
                            variant={!isRegistering ? 'default' : 'outline'}
                            onClick={() => setIsRegistering(false)}
                        >
                            Login
                        </Button>
                        <Button
                            variant={isRegistering ? 'default' : 'outline'}
                            onClick={() => setIsRegistering(true)}
                        >
                            Register
                        </Button>
                    </div>

                    {actionError && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{actionError}</div>
                    )}

                    {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                    <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                        {isRegistering && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                        </div>

                        <Button type="submit" disabled={actionLoading || loading} className="w-full">
                            {actionLoading ? 'Please wait...' : isRegistering ? 'Register' : 'Login'}
                        </Button>
                    </form>
                </Card>
            )}

            {/* Instructions */}
            <Card className="p-6 mt-6 bg-muted">
                <h3 className="text-xl font-semibold mb-3">Setup Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Make sure PocketBase is running: <code className="bg-background px-2 py-1 rounded">cd pocketbase && .\start-pocketbase.ps1</code></li>
                    <li>Access admin UI: <a href="http://localhost:8090/_/" target="_blank" className="text-blue-600 hover:underline">http://localhost:8090/_/</a></li>
                    <li>Create the required collections in PocketBase admin UI</li>
                    <li>Test registration and login on this page</li>
                </ol>
            </Card>
        </div>
    );
}
