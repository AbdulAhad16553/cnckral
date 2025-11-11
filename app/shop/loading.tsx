import HeaderSkeleton from "@/common/Skeletons/Header";
import FooterSkeleton from "@/common/Skeletons/Footer";
import ProductSkeleton from "@/common/Skeletons/Products";
import AnimatedSkeleton from "@/common/Skeletons/segments/AnimatedSkeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ShopLoading() {
	return (
		<div className="min-h-screen flex flex-col bg-white">
			<HeaderSkeleton />

			<main className="flex-1">
				<div className="container mx-auto px-4 py-8">
					{/* Page header */}
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
						<div className="space-y-2">
							<AnimatedSkeleton className="h-8 w-40" />
							<AnimatedSkeleton className="h-4 w-72" />
						</div>
						<div className="flex items-center gap-4 w-full md:w-auto">
							{/* Search */}
							<AnimatedSkeleton className="h-10 w-64 rounded-md" />
							{/* View mode toggle */}
							<div className="flex">
								<AnimatedSkeleton className="h-9 w-9 rounded-l-md" />
								<AnimatedSkeleton className="h-9 w-9 rounded-r-md" />
							</div>
							{/* Settings */}
							<AnimatedSkeleton className="h-9 w-24 rounded-md" />
							{/* Refresh */}
							<AnimatedSkeleton className="h-9 w-24 rounded-md" />
						</div>
					</div>

					{/* Main grid */}
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
						{/* Sidebar filters card */}
						<Card className="lg:col-span-1">
							<CardHeader>
								<AnimatedSkeleton className="h-5 w-28" />
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Categories group */}
								<div>
									<AnimatedSkeleton className="h-4 w-24 mb-3" />
									<div className="space-y-2">
										{Array.from({ length: 8 }).map((_, idx) => (
											<AnimatedSkeleton key={idx} className="h-8 w-full rounded-md" />
										))}
									</div>
								</div>
								{/* Separator mimic */}
								<AnimatedSkeleton className="h-px w-full" />
								{/* Quick stats */}
								<div className="space-y-2">
									<AnimatedSkeleton className="h-4 w-24" />
									<AnimatedSkeleton className="h-3 w-40" />
									<AnimatedSkeleton className="h-3 w-36" />
									<AnimatedSkeleton className="h-3 w-32" />
								</div>
							</CardContent>
						</Card>

						{/* Products grid */}
						<div className="lg:col-span-3">
							<ProductSkeleton />
						</div>
					</div>
				</div>
			</main>

			<FooterSkeleton />
		</div>
	);
}


