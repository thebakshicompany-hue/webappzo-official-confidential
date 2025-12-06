'use client';

import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/user-menu";
import { usePocketBaseAuth } from "@/hooks/use-pocketbase-auth";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
	const { isAuthenticated, loading } = usePocketBaseAuth();

	return (
		<header className="border-b">
			<div className="container flex items-center justify-between py-2">
				<Link href="/" className="flex items-center">
					<Image
						src="/webappzo-logo.png"
						alt="WEBAPPZO"
						width={120}
						height={40}
						className="h-8 w-auto"
					/>
				</Link>

				<nav className="flex items-center gap-4">
					<Link href="https://bdpro.in" className="text-sm hover:underline">
						Company
					</Link>
				</nav>

				{!loading && !isAuthenticated && (
					<Button asChild>
						<Link href="/sign-in">
							Sign in <ArrowRight />
						</Link>
					</Button>
				)}

				{!loading && isAuthenticated && (
					<div className="flex items-center gap-4">
						<Button asChild variant="outline">
							<Link href="/dashboard">
								Dashboard <ArrowRight />
							</Link>
						</Button>
						<UserMenu />
					</div>
				)}
			</div>
		</header>
	);
}
