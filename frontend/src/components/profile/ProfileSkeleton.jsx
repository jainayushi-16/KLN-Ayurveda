"use client";

export default function ProfileSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="w-full bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-white h-48 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-gray-200" />
          <div className="space-y-3">
            <div className="w-48 h-6 bg-gray-200 rounded-lg" />
            <div className="w-64 h-4 bg-gray-200 rounded-lg" />
            <div className="w-40 h-4 bg-gray-200 rounded-lg" />
          </div>
        </div>
        <div className="hidden lg:flex gap-4">
          <div className="w-24 h-20 bg-gray-200 rounded-2xl" />
          <div className="w-24 h-20 bg-gray-200 rounded-2xl" />
          <div className="w-24 h-20 bg-gray-200 rounded-2xl" />
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-72 h-96 bg-white/70 rounded-3xl p-6 border border-white space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full h-10 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="flex-1 w-full h-[500px] bg-white/70 rounded-3xl p-8 border border-white space-y-6">
          <div className="w-64 h-8 bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
          <div className="w-32 h-10 bg-gray-200 rounded-full ml-auto" />
        </div>
      </div>
    </div>
  );
}
