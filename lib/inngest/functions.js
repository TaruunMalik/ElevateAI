import { inngest } from "./client";
import { db } from "../prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genai = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const model = genai.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Inngest function to run weekly
export const generateIndustryInsights = inngest.createFunction(
  {
    name: "Generate Industry Insights",
  },
  {
    cron: "0 0 * * 0", // Runs every Sunday at midnight
  },
  async ({ step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: {
          industry: true,
        },
      });
    });

    for (const { industry } of industries) {
      const prompt = `
        Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
        {
          "salaryRanges": [
            { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
          ],
          "growthRate": number,
          "demandLevel": "HIGH" | "MEDIUM" | "LOW",
          "topSkills": ["skill1", "skill2"],
          "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
          "keyTrends": ["trend1", "trend2"],
          "recommendedSkills": ["skill1", "skill2"]
        }

        IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
        Include at least 5 common roles for salary ranges.
        Growth rate should be a percentage.
        Include at least 5 skills and trends.
      `;

      const res = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await model.generateContent(p); // ✅ Return the result
        },
        prompt
      );

      const text =
        res.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Clean up markdown code block (if any)
      const cleanedText = text.replace(/^```json\n?|\n?```$/g, "").trim();

      let insights;
      try {
        insights = JSON.parse(cleanedText);
      } catch (e) {
        console.error(`Failed to parse response for ${industry}:`, cleanedText);
        continue; // Skip this industry if response is bad
      }

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.create({
          data: {
            industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week later
          },
        });
      });
    }
  }
);
