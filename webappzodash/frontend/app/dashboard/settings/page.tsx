'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePocketBaseAuth } from "@/hooks/use-pocketbase-auth";
import { useTheme as useAnimatedTheme, themes } from "@/contexts/theme-context";
import { useTheme } from "next-themes";
import { LogOut, Sun, Moon, Monitor, Palette, User, Lock, Save, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
	const { user, logout, updateProfile, updatePassword, loading } = usePocketBaseAuth();
	const router = useRouter();
	const { theme: animatedTheme, setTheme: setAnimatedTheme } = useAnimatedTheme();
	const { theme: mode, setTheme: setMode, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	// Profile state
	const [name, setName] = useState(user?.name || '');
	const [email, setEmail] = useState(user?.email || '');
	const [profileSuccess, setProfileSuccess] = useState(false);
	const [profileError, setProfileError] = useState<string | null>(null);

	// Password state
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordSuccess, setPasswordSuccess] = useState(false);
	const [passwordError, setPasswordError] = useState<string | null>(null);

	const handleLogout = async () => {
		await logout();
		router.push('/');
	};

	const handleProfileUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setProfileError(null);
		setProfileSuccess(false);
		try {
			await updateProfile({ name, email });
			setProfileSuccess(true);
			setTimeout(() => setProfileSuccess(false), 3000);
		} catch (err: any) {
			setProfileError(err?.message || 'Failed to update profile');
		}
	};

	const handlePasswordUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordError(null);
		setPasswordSuccess(false);

		if (newPassword !== confirmPassword) {
			setPasswordError('Passwords do not match');
			return;
		}

		if (newPassword.length < 8) {
			setPasswordError('Password must be at least 8 characters');
			return;
		}

		try {
			await updatePassword(oldPassword, newPassword, confirmPassword);
			setPasswordSuccess(true);
			setOldPassword('');
			setNewPassword('');
			setConfirmPassword('');
			setTimeout(() => setPasswordSuccess(false), 3000);
		} catch (err: any) {
			setPasswordError(err?.message || 'Failed to update password');
		}
	};

	return (
		<main className="container max-w-4xl py-6 space-y-6">
			<h1 className="text-3xl font-semibold">Settings</h1>

			{/* Profile Settings */}
			<Card className="bg-background/60 backdrop-blur-sm border-white/10">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="h-5 w-5" />
						Profile
					</CardTitle>
					<CardDescription>
						Update your personal information
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleProfileUpdate} className="space-y-4">
						{profileError && (
							<div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
								{profileError}
							</div>
						)}
						{profileSuccess && (
							<div className="bg-green-500/10 text-green-500 px-4 py-3 rounded-md text-sm flex items-center gap-2">
								<Check className="h-4 w-4" /> Profile updated successfully!
							</div>
						)}
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Your name"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="your@email.com"
								/>
							</div>
						</div>
						<Button type="submit" disabled={loading}>
							<Save className="mr-2 h-4 w-4" />
							Save Changes
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Password Settings */}
			<Card className="bg-background/60 backdrop-blur-sm border-white/10">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Lock className="h-5 w-5" />
						Change Password
					</CardTitle>
					<CardDescription>
						Update your password to keep your account secure
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handlePasswordUpdate} className="space-y-4">
						{passwordError && (
							<div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
								{passwordError}
							</div>
						)}
						{passwordSuccess && (
							<div className="bg-green-500/10 text-green-500 px-4 py-3 rounded-md text-sm flex items-center gap-2">
								<Check className="h-4 w-4" /> Password updated successfully!
							</div>
						)}
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="oldPassword">Current Password</Label>
								<Input
									id="oldPassword"
									type="password"
									value={oldPassword}
									onChange={(e) => setOldPassword(e.target.value)}
									placeholder="••••••••"
								/>
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="newPassword">New Password</Label>
									<Input
										id="newPassword"
										type="password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										placeholder="••••••••"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm New Password</Label>
									<Input
										id="confirmPassword"
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										placeholder="••••••••"
									/>
								</div>
							</div>
						</div>
						<Button type="submit" disabled={loading}>
							<Lock className="mr-2 h-4 w-4" />
							Update Password
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Appearance Settings */}
			<Card className="bg-background/60 backdrop-blur-sm border-white/10">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Palette className="h-5 w-5" />
						Appearance
					</CardTitle>
					<CardDescription>
						Customize the look and feel of your dashboard
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Mode Selection */}
					<div className="space-y-3">
						<Label className="text-base font-medium">Color Mode</Label>
						<div className="grid grid-cols-3 gap-3">
							<Button
								variant={mounted && mode === 'light' ? 'default' : 'outline'}
								className="flex flex-col h-auto py-4 gap-2"
								onClick={() => setMode('light')}
							>
								<Sun className="h-6 w-6" />
								<span>Light</span>
							</Button>
							<Button
								variant={mounted && mode === 'dark' ? 'default' : 'outline'}
								className="flex flex-col h-auto py-4 gap-2"
								onClick={() => setMode('dark')}
							>
								<Moon className="h-6 w-6" />
								<span>Dark</span>
							</Button>
							<Button
								variant={mounted && mode === 'system' ? 'default' : 'outline'}
								className="flex flex-col h-auto py-4 gap-2"
								onClick={() => setMode('system')}
							>
								<Monitor className="h-6 w-6" />
								<span>System</span>
							</Button>
						</div>
					</div>

					{/* Animated Theme Selection */}
					<div className="space-y-3">
						<Label className="text-base font-medium">Animation Theme</Label>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
							{themes.map((t) => (
								<Button
									key={t.name}
									variant={animatedTheme === t.name ? 'default' : 'outline'}
									className="flex flex-col h-auto py-4 gap-2"
									onClick={() => setAnimatedTheme(t.name)}
								>
									<div className="flex gap-1">
										{t.colors.map((color, i) => (
											<div
												key={i}
												className="w-4 h-4 rounded-full"
												style={{ backgroundColor: color }}
											/>
										))}
									</div>
									<span>{t.label}</span>
								</Button>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Account Settings */}
			<Card className="bg-background/60 backdrop-blur-sm border-white/10">
				<CardHeader>
					<CardTitle>Account</CardTitle>
					<CardDescription>
						Manage your account settings
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button variant="destructive" onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						Sign out
					</Button>
				</CardContent>
			</Card>
		</main>
	);
}
