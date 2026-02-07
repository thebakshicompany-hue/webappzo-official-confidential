'use client';

import { UserProfileCard } from "@/components/dashboard/user-profile-card";
import { OrganizationCard } from "@/components/dashboard/organization-card";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { ClockWidget } from "@/components/widgets/clock-widget";
import { WeatherWidget } from "@/components/widgets/weather-widget";
import { NotesWidget } from "@/components/widgets/notes-widget";
import { AppWidget } from "@/components/widgets/app-widget";
import { WidgetGrid, WidgetConfig } from "@/components/widgets/widget-grid";
import { Circle, AppWindow, PenTool, Video, FileText, BarChart3, Cog, Rocket, Globe, Edit, Columns, Calculator } from "lucide-react";

const availableWidgets: WidgetConfig[] = [
	{ id: 'clock', name: 'Clock', component: <ClockWidget /> },
	{ id: 'weather', name: 'Weather', component: <WeatherWidget /> },
	{ id: 'notes', name: 'Notes', component: <NotesWidget />, size: 'medium' },
	{ id: 'recorder', name: 'Recorder', component: <AppWidget name="Recorder" href="/dashboard/recorder" icon={Circle} color="text-red-500" description="Screen & audio recording" /> },
	{ id: 'browser', name: 'Browser', component: <AppWidget name="Browser" href="/dashboard/browser" icon={AppWindow} color="text-blue-500" description="Web browser" /> },
	{ id: 'whiteboard', name: 'Whiteboard', component: <AppWidget name="Whiteboard" href="/dashboard/whiteboard" icon={PenTool} color="text-green-500" description="Digital whiteboard" /> },
	{ id: 'meetings', name: 'Meetings', component: <AppWidget name="Meetings" href="/dashboard/meetings" icon={Video} color="text-purple-500" description="Video meetings" /> },
	{ id: 'pdf-viewer', name: 'PDF Viewer', component: <AppWidget name="PDF Viewer" href="/dashboard/pdf-viewer" icon={FileText} color="text-orange-500" description="View PDF files" /> },
	{ id: 'tracking', name: 'Tracking', component: <AppWidget name="Tracking" href="/dashboard/tracking" icon={BarChart3} color="text-teal-500" description="Analytics & tracking" /> },
	{ id: 'settings', name: 'Settings', component: <AppWidget name="Settings" href="/dashboard/settings" icon={Cog} color="text-gray-500" description="App settings" /> },
	{ id: 'create-app', name: 'Create App', component: <AppWidget name="Create App" href="/dashboard/create-app" icon={Rocket} color="text-pink-500" description="Build your app" /> },
	{ id: 'create-website', name: 'Create Website', component: <AppWidget name="Create Website" href="/dashboard/create-website" icon={Globe} color="text-cyan-500" description="Build your website" /> },
	{ id: 'edit-app', name: 'Edit App/Website', component: <AppWidget name="Edit App/Website" href="/dashboard/apps/edit-app-website" icon={Edit} color="text-yellow-500" description="Modify your projects" /> },
	{ id: 'split-view', name: 'Split View', component: <AppWidget name="Split View" href="/dashboard/split" icon={Columns} color="text-indigo-500" description="Multi-app view" /> },
	{ id: 'calculator', name: 'Calculator', component: <AppWidget name="Calculator" href="/dashboard/apps/calculator" icon={Calculator} color="text-amber-500" description="Calculator app" /> },
];

const defaultWidgets = ['clock', 'weather', 'notes', 'recorder', 'browser', 'whiteboard', 'meetings'];

export default function DashboardPage() {
	return (
		<div className="container py-8">
			<div className="flex flex-col gap-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome back! Customize your dashboard by dragging widgets or adding new ones.
					</p>
				</div>

				<WidgetGrid availableWidgets={availableWidgets} defaultWidgets={defaultWidgets} />

				<QuickStats />

				<div className="grid gap-4 md:grid-cols-2">
					<UserProfileCard />
					<OrganizationCard />
				</div>
			</div>
		</div>
	);
}
