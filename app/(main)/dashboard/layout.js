import React, { Suspense } from "react";
import { ClipLoader } from "react-spinners";
const Layout = ({ children }) => {
  return (
    <div className=" px-5 ">
      <div className=" flex items-center justify-center mb-4  p-4">
        <h1 className=" text-5xl font-bold ">Industry Insights</h1>
      </div>
      <div className=" flex items-center justify-center mb-4  p-4">
        <Suspense
          fallback={
            <ClipLoader color="#3aa9c2" size={50} speedMultiplier={2} />
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  );
};

export default Layout;
