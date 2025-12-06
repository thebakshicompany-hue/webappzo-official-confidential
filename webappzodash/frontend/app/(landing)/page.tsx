import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<div className="container">
			<section className="py-12 md:py-20">
				<div className="container">
					<div className="flex flex-col items-center text-center gap-8">
						<div className="max-w-3xl">
							<div className="flex flex-col gap-4 lg:gap-8">
								<h1 className="text-4xl leading-tight font-semibold text-foreground lg:text-5xl xl:text-7xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
									WEBAPPZO Dashboard
								</h1>
								<p className="text-lg leading-relaxed text-muted-foreground xl:text-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-backwards">
									The ultimate dashboard solution for your business. Manage your organization, users, and settings with ease.
								</p>
							</div>

						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
