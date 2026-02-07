import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { OrganizationSelector } from "@/components/auth/organization-selector";
import { Cog, LayoutDashboard, Video, PenTool, Circle, BarChart3, Rocket, Globe, Calculator, AppWindow, Edit, Columns, FileText } from "lucide-react";
import Link from "next/link";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const { ...rest } = props;

	return (
		<Sidebar {...rest}>
			<SidebarHeader>
				<OrganizationSelector />
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/dashboard">
									<LayoutDashboard /> Dashboard
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/dashboard/create-app">
									<Rocket /> Create your app
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/dashboard/create-website">
									<Globe /> Create your website
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/dashboard/apps/edit-app-website">
									<Edit /> Edit your app / website
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/dashboard/meetings">
									<Video /> Meetings
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/dashboard/whiteboard">
									<PenTool /> Whiteboard
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/dashboard/recorder">
									<Circle className="text-red-500" /> Recorder
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/dashboard/browser">
									<AppWindow /> Browser
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/dashboard/split">
									<Columns /> Split View
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/dashboard/pdf-viewer">
									<FileText /> PDF Viewer
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/dashboard/tracking">
									<BarChart3 /> Tracking
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/dashboard/settings">
									<Cog /> Settings
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/dashboard/apps/calculator">
									<Calculator /> Calculator
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
