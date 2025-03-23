import { useState } from "react";
import { toast } from "sonner";
const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setloading] = useState(null);
  const [error, seterror] = useState(null);

  const fn = async (...args) => {
    setloading(true);
    seterror(null);

    try {
      const response = await cb(...args);
      setData(response);
      seterror(null);
      console.log("response");
    } catch (err) {
      seterror(err);
      toast.error(err.message);
    } finally {
      setloading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
