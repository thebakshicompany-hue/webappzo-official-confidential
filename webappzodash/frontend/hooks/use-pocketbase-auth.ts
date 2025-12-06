'use client';

import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';
import type { User } from '@/lib/pocketbase';
import { signIn, signUp, signOut, getCurrentUser } from '@/lib/api/pocketbase-client';

export function usePocketBaseAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                console.error('Failed to initialize auth:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Listen to auth state changes
        const unsubscribe = pb.authStore.onChange((token, model) => {
            setUser(model as unknown as User | null);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Login function
    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const authData = await signIn(email, password);
            setUser(authData.record as unknown as User);
            return authData;
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to login';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (email: string, password: string, name: string) => {
        setLoading(true);
        setError(null);
        try {
            const record = await signUp(email, password, name);
            // Auto-login after registration
            await login(email, password);
            return record;
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to register';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update profile function
    const updateProfile = async (data: { name?: string; email?: string }) => {
        if (!user) throw new Error('Not authenticated');
        setLoading(true);
        setError(null);
        try {
            const updatedUser = await pb.collection('users').update(user.id, data);
            setUser(updatedUser as unknown as User);
            return updatedUser;
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to update profile';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update password function
    const updatePassword = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
        if (!user) throw new Error('Not authenticated');
        setLoading(true);
        setError(null);
        try {
            await pb.collection('users').update(user.id, {
                oldPassword,
                password: newPassword,
                passwordConfirm: confirmPassword,
            });
            return true;
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to update password';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        setLoading(true);
        try {
            await signOut();
            setUser(null);
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to logout';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user && pb.authStore.isValid,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
    };
}
