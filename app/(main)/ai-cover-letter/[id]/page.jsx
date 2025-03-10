import React from "react";

export default async function page({ params }) {
  const ids = await params.id;
  return <div>{ids}</div>;
}
