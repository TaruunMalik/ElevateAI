import React, { Suspense } from "react";

const Layout = ({ children }) => {
  return (
    <div className=" px-5 ">
      <div className=" flex items-center justify-center mb-4  p-4">
        <h1 className=" text-5xl font-bold ">Industry Insights</h1>
      </div>
      <Suspense fallback={"loading..."}>{children}</Suspense>
    </div>
  );
};

export default Layout;
