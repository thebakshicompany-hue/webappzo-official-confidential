import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/components/auth/user-menu";
import { ThemePicker } from "@/components/ui/theme-picker";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { AppSidebar } from "./app-sidebar";
import Image from "next/image";

export default function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<SidebarProvider>
			<AppSidebar collapsible="offcanvas" className="bg-transparent/50 backdrop-blur-sm" />

			<div className="w-full flex flex-col bg-transparent">
				<header className="flex items-center px-2 py-2 gap-2 bg-background/40 backdrop-blur-md border-b border-white/10">
					<SidebarTrigger />
					<Separator orientation="vertical" />

					<div className="grow flex items-center justify-between">
						<Image
							src="/webappzo-logo.png"
							alt="WEBAPPZO"
							width={100}
							height={32}
							className="h-6 w-auto"
						/>

						<div className="flex items-center gap-2">
							<ThemePicker />
							<ModeToggle />
							<UserMenu />
						</div>
					</div>
				</header>

				<div className="px-2 py-2">{children}</div>
			</div>
		</SidebarProvider>
	);
}
