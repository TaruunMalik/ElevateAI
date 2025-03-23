import React from "react";
import { industries } from "@/data/industries";
import Onboarding from "../_components/onboarding_form";
import { onboardingstatus } from "@/actions/user";
import { redirect } from "next/navigation";

async function Page() {
  const resu = await onboardingstatus();
  if (resu.isOnboarded) {
    redirect("/dashboard");
  }
  return (
    <div>
      <Onboarding industries={industries} />
    </div>
  );
}

export default Page;
