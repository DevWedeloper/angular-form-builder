import { z } from 'zod';

const validatorsSchema = z
  .object({
    required: z.boolean().optional(),
    minLength: z.number().optional(),
    email: z.boolean().optional(),
    requiredTrue: z.boolean().optional(),
  })
  .strict();

const optionsSchema = z
  .object({
    label: z.string(),
    value: z.string(),
  })
  .strict();

const inputControlSchema = z
  .object({
    controlType: z.literal('input'),
    type: z.enum(['text', 'email', 'password']),
    label: z.string(),
    value: z.union([z.string(), z.null()]),
    order: z.number(),
    validators: validatorsSchema.optional(),
  })
  .strict();

const selectControlSchema = z
  .object({
    controlType: z.literal('select'),
    label: z.string(),
    value: z.string(),
    order: z.number(),
    options: z.array(optionsSchema),
  })
  .strict();

const checkboxControlSchema = z
  .object({
    controlType: z.literal('checkbox'),
    label: z.string(),
    value: z.boolean(),
    order: z.number(),
    validators: validatorsSchema.optional(),
  })
  .strict();

const groupControlSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      controlType: z.literal('group'),
      label: z.string(),
      order: z.number(),
      controls: z.record(z.string(), controlSchema),
    })
    .strict(),
);

const controlSchema = z.union([
  inputControlSchema,
  selectControlSchema,
  checkboxControlSchema,
  groupControlSchema,
]);

export const formConfigSchema = z
  .object({
    description: z.string(),
    controls: z.record(z.string(), controlSchema),
  })
  .strict();
