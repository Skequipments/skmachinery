
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Image Skeleton */}
          <div className="relative">
            <div className="bg-white p-8 rounded-lg flex flex-col gap-4 border shadow-sm">
              <div className="relative">
                <Skeleton className="aspect-square w-full rounded-lg" />
                {/* Loading indicator overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-gray-600">Loading product...</p>
                  </div>
                </div>
              </div>

              {/* Additional Images Skeleton */}
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 flex-shrink-0 rounded-md" />
                ))}
              </div>
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-4 rounded-sm" />
                ))}
              </div>
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            {/* WhatsApp Button */}
            <Skeleton className="h-12 w-48 rounded-md" />

            {/* Category */}
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        {/* Related Products Section Skeleton */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
