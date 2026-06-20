export default function ConfigureLoading() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
      <div className="lg:w-3/5 bg-[#F7F7F7] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#111111]/20 border-t-[#111111] rounded-full animate-spin" />
      </div>
      <div className="lg:w-2/5 bg-white border-l border-[#E5E5E5] p-6 flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-[#F7F7F7] animate-pulse" />
        ))}
      </div>
    </div>
  )
}