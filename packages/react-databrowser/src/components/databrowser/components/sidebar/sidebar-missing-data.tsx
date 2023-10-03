export const SidebarMissingData = () => {
  return (
    <div className="flex items-center h-[436px] border border-dashed rounded-md">
      <div className="px-4 py-6">
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center gap-5 p-4">
            <p className="font-medium text-md text-muted-foreground">Data on a break</p>
            <p
              className="w-8/12 text-sm text-center text-muted-foreground"
              data-testid="missing-data-sidebar"
            >
              "Quick, lure it back with some CLI magic!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
