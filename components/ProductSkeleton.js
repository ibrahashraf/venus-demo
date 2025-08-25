
export default function ProductSkeleton() {
  return (
    <div className="bg-neutral-50 rounded overflow-hidden shadow-sm border border-neutral-100">
        <div className="skeleton aspect-[3/4]" />
        <div className="flex justify-between p-3">
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-4 w-1/4" />
        </div>
    </div>
  )
}
