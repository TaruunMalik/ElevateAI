import { z } from "zod";

export const onboardingschema = z.object({
  industry: z.string({
    required_error: "Need an industry.",
  }),
  bio: z.string().max(500).optional(),
  subIndustry: z.string({
    required_error: "Need a subindustry.",
  }),
  experience: z
    .string({
      required_error: "Enter a numerical value",
    })
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(0).max(50)),
  skills: z
    .string()
    .transform((val) =>
      val ? val.split(",").map((skill) => skill.trim()) : undefined
    ),
});
