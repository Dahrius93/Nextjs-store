import { z, ZodSchema } from "zod";

// export const productSchema = z.object({
//   name: z.string().min(4),
//   company: z.string().min(4),
//   price: z.coerce.number().int().min(0),
//   description: z.string(),
//   featured: z.coerce.boolean(),
// });

export const productSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(100, {
      message: "name must be less than 100 characters.",
    }),
  company: z.string(),
  featured: z.coerce.boolean(),
  price: z.coerce.number().int().min(0, {
    message: "price must be a positive number.",
  }),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(" ").length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    {
      message: "description must be between 10 and 1000 words.",
    },
  ),
});

export function validateWithZodSchema<T>(
  schema: ZodSchema<T>,
  data: unknown,
): T {
  // parse lancia direttamente new Error uscendo subito dal try
  // const result = schema.parse(data);

  // safeParse invece non lancia l'errore e in questo modo siamo in grado
  // di fare un map per tutti gli errori presenti
  // e mostrarli tutti sul toast in modo che l'utente possa correggerli
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);
    throw new Error(errors.join(", "));
  }
  return result.data;
}
