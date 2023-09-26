import React from "react";
import { DataDisplay } from "./data-display";
import { DataDisplayHeader } from "./data-display-header";

export const DataDisplayContainer = () => {
  return (
    <div className="col-span-4 lg:border-l">
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="h-full space-y-6">
          <DataDisplayHeader />
          <DataDisplay />
        </div>
      </div>
    </div>
  );
};
