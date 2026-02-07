import { UserProfileCard } from "@/components/dashboard/user-profile-card";
import { OrganizationCard } from "@/components/dashboard/organization-card";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { ClockWidget } from "@/components/widgets/clock-widget";
import { WeatherWidget } from "@/components/widgets/weather-widget";
import { NotesWidget } from "@/components/widgets/notes-widget";
import { AppsWidget } from "@/components/widgets/apps-widget";

export default function DashboardPage() {
	return (
		<div className="container py-8">
			<div className="flex flex-col gap-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome back! Here's an overview of your account.
					</p>
				</div>

				{/* Widgets Section */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<ClockWidget />
					<WeatherWidget />
					<AppsWidget />
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<NotesWidget />
					<QuickStats />
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<UserProfileCard />
					<OrganizationCard />
				</div>
			</div>
		</div>
	);
}
