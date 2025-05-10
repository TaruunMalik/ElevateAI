"use client";
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingschema } from "../lib/schemazod";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
function Onboarding({ industries }) {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const rou = useRouter();
  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingschema),
  });
  const watchIndustry = watch("industry");
  const onSubmit = async (values) => {
    try {
      const formindus = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;
      await updateUserFn({
        ...values,
        industry: formindus,
      });
      toast.success("Onboarded!");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Onboarded!");
      rou.push("/dashboard");
      rou.refresh;
    }
  }, [updateResult, updateLoading]);
  return (
    <div className=" w-full flex justify-center flex-col items-center">
      <Card className=" w-full max-w-lg">
        <CardHeader>
          <CardTitle className=" text-4xl font-bold">
            Complete your profile
          </CardTitle>
          <CardDescription>Select industry</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              {/* <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div> */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("industry", value);
                    setSelectedIndustry(
                      industries.find((ind) => ind.id === value)
                    );

                    setValue("subIndustry", "");
                  }}
                >
                  <SelectTrigger className="w-full" id="industry">
                    <SelectValue placeholder="Your Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((item) => {
                      return (
                        <SelectItem value={item.id} key={item.id}>
                          {item.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className=" text-sm text-red-500">
                    {errors.industry.message}
                  </p>
                )}
              </div>
              {watchIndustry && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="subIndustry">Specialisation</Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("subIndustry", value);
                    }}
                  >
                    <SelectTrigger className="w-full" id="subIndustry">
                      <SelectValue placeholder="Your specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Specializations</SelectLabel>
                        {selectedIndustry?.subIndustries.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p className=" text-sm text-red-500">
                      {errors.industry.message}
                    </p>
                  )}
                </div>
              )}
              <div className="grid w-full gap-1.5">
                <Label htmlFor="bio">Your Bio</Label>
                <Textarea
                  placeholder="Type your message here."
                  id="bio"
                  {...register("bio")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="experience">Experience</Label>
                <Input
                  type="number"
                  id="experience"
                  min="0"
                  max="50"
                  placeholder="Enter your experience"
                  {...register("experience")}
                />
                {errors.experience && (
                  <p className=" text-sm text-red-500">
                    {errors.experience.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="skills">Skills</Label>
                <Input
                  type="text"
                  id="skills"
                  placeholder="Enter your skills"
                  {...register("skills")}
                />
                <p className=" text-sm text-muted-foreground">
                  Separate skills by commas
                </p>
                {errors.skills && (
                  <p className=" text-sm text-red-500">
                    {errors.skills.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={updateLoading}>
                {updateLoading ? (
                  <>
                    <Loader2 /> Saving...
                  </>
                ) : (
                  <>Submit</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Onboarding;
