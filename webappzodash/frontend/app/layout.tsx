import { cn } from "@/lib/cn";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClientProvider } from "./query-client-provider";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { ThemeProvider } from "@/contexts/theme-context";
import Script from "next/script";

import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		template: "%s | Dashboard",
		default: "Dashboard",
	},
	description: "Your application dashboard",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn("antialiased theme-neon", geistSans.variable, geistMono.variable)}
			>
				<NextThemesProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<QueryClientProvider>
						<ThemeProvider>
							<AnimatedBackground />
							<div className="relative z-10 min-h-screen">
								{children}
							</div>
						</ThemeProvider>
					</QueryClientProvider>
				</NextThemesProvider>

				{/* Chatling Chatbot */}
				<Script id="chatling-config" strategy="afterInteractive">
					{`window.chtlConfig = { chatbotId: "4891525889" }`}
				</Script>
				<Script
					id="chtl-script"
					src="https://chatling.ai/js/embed.js"
					data-id="4891525889"
					strategy="afterInteractive"
				/>
			</body>
		</html>
	);
}
