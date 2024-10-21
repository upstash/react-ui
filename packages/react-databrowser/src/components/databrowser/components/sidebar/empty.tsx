export const Empty = () => {
  return (
    <div className="flex h-[436px] items-center rounded-md border border-dashed">
      <div className="px-4 py-6">
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center gap-5 p-4">
            <p className="text-md text-muted-foreground font-medium">Data on a break</p>
            <p
              className="text-muted-foreground w-8/12 text-center text-sm"
              data-testid="missing-data-sidebar"
            >
              "Quick, lure it back with some CLI magic!"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
