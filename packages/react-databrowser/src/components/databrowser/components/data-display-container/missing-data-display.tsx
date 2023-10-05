export const MissingDataDisplay = () => {
  return (
    <div className="col-span-4 lg:border-l">
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="h-full space-y-6">
          <div className="flex h-full shrink-0 flex-col items-center justify-center gap-5 rounded-md border border-dashed p-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="60px" height="60px" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="#494F55"
                strokeWidth="1"
                d="M2.99787498,0.999999992 L17.4999998,0.999999992 L20.9999998,4.50000005 L21,23 L3,23 L2.99787498,0.999999992 Z M16,1 L16,6 L21,6 M9,12 L15,18 M15,12 L9,18"
              />
            </svg>
            <p className="text-muted-foreground text-lg font-medium">No data found</p>
            {/*TODO: Add CLI link here to easy navigation */}
            <p className="text-muted-foreground w-8/12 text-center" data-testid="missing-data">
              "Oops! Data&apos;s playing hide and seek and it&apos;s winning! Try adding some data from CLI?"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
