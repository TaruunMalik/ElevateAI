import { getAssessments } from "@/actions/interview";
import Link from "next/link";
import React from "react";
import StatsCards from "./_components/statscards";
import PerformanceChart from "./_components/performance-chart";
import { Button } from "@/components/ui/button";
import QuizList from "./_components/quiz-list";
async function MockInterview() {
  const assessments = await getAssessments();

  return (
    <div>
      <div className=" flex flex-row justify-between items-center">
        <h1 className=" text-4xl font-bold gradient-title mb-5">
          Interview Preparation
        </h1>
        <Link href="/interview/mock">
          <Button>Take Quiz</Button>
        </Link>
      </div>
      <div className=" mt-2 mb-3">
        <StatsCards assessments={assessments} />
      </div>
      <div className=" mt-2 mb-3">
        <PerformanceChart assessments={assessments} />
      </div>
      <div className=" mt-2 mb-3">
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}

export default MockInterview;
