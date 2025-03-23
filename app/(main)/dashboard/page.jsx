import React from "react";
import { onboardingstatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_components/dashboard-view";
async function Page() {
  const resu = await onboardingstatus();
  const insights = await getIndustryInsights();
  if (!resu.isOnboarded) {
    redirect("/onboarding");
  }
  return (
    <div className=" container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
}

export default Page;
