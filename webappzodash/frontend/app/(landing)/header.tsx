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

                <nav className="hidden sm:flex items-center gap-4">
                    <Link href="https://bdpro.in" className="text-sm hover:underline">
                        Company
                    </Link>
                </nav>

                <div className="flex items-center gap-2 sm:gap-4">
                    {!loading && !isAuthenticated && (
                        <Button asChild size="sm" className="sm:h-9">
                            <Link href="/sign-in">
                                Sign in <ArrowRight className="h-4 w-4 ml-1 hidden xs:inline" />
                            </Link>
                        </Button>
                    )}

                    {!loading && isAuthenticated && (
                        <>
                            <Button asChild variant="outline" size="sm" className="sm:h-9">
                                <Link href="/dashboard">
                                    <span className="hidden xs:inline">Dashboard</span>
                                    <ArrowRight className="h-4 w-4 xs:ml-1" />
                                </Link>
                            </Button>
                            <UserMenu />
                        </>
                    )}
                </div>
			</div>
		</header>
	);
}
