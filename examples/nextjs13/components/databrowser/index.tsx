import React from "react";
import { DataDisplayContainer } from "./data-display/data-display-container";
import { Sidebar } from "./sidebar";

export const Databrowser = () => {
  return (
    <div className="overflow-hidden rounded-[0.5rem] border shadow">
      <div className="grid lg:grid-cols-[1.5fr,1.2fr,1fr,1fr,1fr]">
        <Sidebar />
        <DataDisplayContainer />
      </div>
    </div>
  );
};
