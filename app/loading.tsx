import HeaderSkeleton from "@/common/Skeletons/Header";
import CategoriesSkeleton from "@/common/Skeletons/Categories";
import ProductSkeleton from "@/common/Skeletons/Products";
import FooterSkeleton from "@/common/Skeletons/Footer";
import AnimatedSkeleton from "@/common/Skeletons/segments/AnimatedSkeleton";

export default function Loading() {
	return (
		<div className="min-h-screen flex flex-col bg-white">
			{/* Header */}
			<HeaderSkeleton />

			{/* Main content */}
			<main className="flex-1">
				<div className="container mx-auto px-4 py-6">
					{/* Hero - Left text, right product preview */}
					<section className="mb-12">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
							{/* Left: text content skeletons */}
							<div className="space-y-4">
								<AnimatedSkeleton className="h-10 w-3/4" />
								<AnimatedSkeleton className="h-10 w-2/3" />
								<div className="space-y-2 pt-2">
									<AnimatedSkeleton className="h-4 w-full" />
									<AnimatedSkeleton className="h-4 w-11/12" />
									<AnimatedSkeleton className="h-4 w-10/12" />
								</div>
								<div className="flex gap-4 pt-4">
									<AnimatedSkeleton className="h-12 w-40 rounded-lg" />
									<AnimatedSkeleton className="h-12 w-48 rounded-lg" />
								</div>
								{/* Stats row */}
								<div className="grid grid-cols-4 gap-6 pt-6">
									{Array.from({ length: 4 }).map((_, i) => (
										<div key={i} className="space-y-2">
											<AnimatedSkeleton className="h-5 w-10" />
											<AnimatedSkeleton className="h-3 w-20" />
										</div>
									))}
								</div>
							</div>

							{/* Right: product card preview skeleton */}
							<div className="rounded-2xl border border-gray-200 p-4 shadow-sm">
								<div className="relative overflow-hidden rounded-xl bg-gray-100">
									<AnimatedSkeleton className="aspect-video w-full" />
									<div className="absolute top-3 right-3">
										<AnimatedSkeleton className="h-6 w-28 rounded-full" />
									</div>
								</div>
								<div className="p-4 space-y-3">
									<AnimatedSkeleton className="h-5 w-3/4" />
									<AnimatedSkeleton className="h-4 w-2/3" />
									<div className="flex items-center gap-2">
										{Array.from({ length: 5 }).map((_, i) => (
											<AnimatedSkeleton key={i} className="h-3 w-3" />
										))}
									</div>
									<div className="flex items-center justify-between pt-2">
										<AnimatedSkeleton className="h-6 w-32" />
										<AnimatedSkeleton className="h-10 w-36 rounded-md" />
									</div>
								</div>
							</div>
						</div>
					</section>
					{/* Categories */}
					<CategoriesSkeleton />
					{/* Products grid */}
					<ProductSkeleton />
				</div>
			</main>

			{/* Footer */}
			<FooterSkeleton />
		</div>
	);
}
