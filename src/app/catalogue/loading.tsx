export default function CatalogueLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="h-8 bg-[#F7F7F7] w-48 mb-4 animate-pulse" />
      <div className="h-14 bg-[#F7F7F7] w-64 mb-12 animate-pulse" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E5E5]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white p-5 flex flex-col gap-4">
            <div className="w-full aspect-square bg-[#F7F7F7] animate-pulse" />
            <div className="h-4 bg-[#F7F7F7] w-3/4 animate-pulse" />
            <div className="h-3 bg-[#F7F7F7] w-full animate-pulse" />
            <div className="h-3 bg-[#F7F7F7] w-2/3 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}