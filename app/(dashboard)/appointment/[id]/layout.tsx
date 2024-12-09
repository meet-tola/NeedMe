import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return <div className="flex w-full flex-col flex-grow mx-auto p-4 md:px-6 lg:px-8 px-4">{children}</div>;
}

export default layout;