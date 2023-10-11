"use client";
import NavBar from "./NavBar";

const LayOut = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <NavBar />
      <div className="w-full h-full p-4 m-8 overflow-y-scroll">
        <div className="flex p-5 border-2 border-dotted">{children}</div>
      </div>
    </div>
  );
};

export default LayOut;
