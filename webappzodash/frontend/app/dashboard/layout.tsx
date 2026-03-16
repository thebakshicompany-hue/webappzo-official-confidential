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
		<SidebarProvider className="h-full">
			<AppSidebar collapsible="offcanvas" className="bg-transparent/50 backdrop-blur-sm" />

			<div className="w-full h-full flex flex-col bg-transparent">
				<header className="flex items-center px-2 py-2 gap-2 bg-background/40 backdrop-blur-md border-b border-white/10 shrink-0">
					<SidebarTrigger className="h-8 w-8" />
					<Separator orientation="vertical" className="h-4" />

					<div className="grow flex items-center justify-between min-w-0">
						<div className="flex items-center gap-2 min-w-0">
							<Image
								src="/webappzo-logo.png"
								alt="WEBAPPZO"
								width={100}
								height={32}
								className="h-5 w-auto block xs:hidden"
							/>
							<Image
								src="/webappzo-logo.png"
								alt="WEBAPPZO"
								width={100}
								height={32}
								className="h-6 w-auto hidden xs:block"
							/>
						</div>

						<div className="flex items-center gap-2">
							<ThemePicker />
							<ModeToggle />
							<UserMenu />
						</div>
					</div>
				</header>

				<div className="flex-1 overflow-hidden">{children}</div>
			</div>
		</SidebarProvider>
	);
}
