import React from "react";
import RecordRes from "./components/recordres";
function LiveInterview() {
  return (
    <div className=" flex flex-col justify-center items-center" >
      <span>Please start speaking by pressing the button...</span>
      <RecordRes />
    </div>
  );
}

export default LiveInterview;
