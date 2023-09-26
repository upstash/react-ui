import React from "react";
import { DataDisplayContainer } from "./data-display/data-display-container";
import { Sidebar } from "./sidebar";

export const Databrowser = () => {
  return (
    <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
      <div className="hidden md:block">
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-[1.5fr,1.2fr,1fr,1fr,1fr]">
              <Sidebar />
              <DataDisplayContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
