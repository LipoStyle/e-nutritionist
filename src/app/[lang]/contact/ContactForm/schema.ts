import { z } from 'zod'

export type Locale = 'en' | 'es' | 'el'

/** i18n error messages */
const messages: Record<Locale, Record<string, string>> = {
  en: {
    name_required: 'Please enter your name.',
    name_min: 'Name should be at least 2 characters.',
    email_required: 'Please enter your email.',
    email_invalid: 'Please enter a valid email address.',
    phone_invalid: 'Please enter a valid phone number (numbers, +, spaces, -).',
    subject_required: 'Please enter a subject.',
    subject_min: 'Subject should be at least 3 characters.',
    message_max: 'Message is too long (max 2000 characters).',
  },
  es: {
    name_required: 'Por favor, introduce tu nombre.',
    name_min: 'El nombre debe tener al menos 2 caracteres.',
    email_required: 'Por favor, introduce tu correo.',
    email_invalid: 'Por favor, introduce un correo válido.',
    phone_invalid: 'Introduce un teléfono válido (números, +, espacios, -).',
    subject_required: 'Por favor, introduce un asunto.',
    subject_min: 'El asunto debe tener al menos 3 caracteres.',
    message_max: 'El mensaje es demasiado largo (máx. 2000 caracteres).',
  },
  el: {
    name_required: 'Παρακαλώ εισάγετε το όνομά σας.',
    name_min: 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες.',
    email_required: 'Παρακαλώ εισάγετε το email σας.',
    email_invalid: 'Παρακαλώ εισάγετε ένα έγκυρο email.',
    phone_invalid: 'Παρακαλώ εισάγετε έγκυρο τηλέφωνο (αριθμοί, +, κενά, -).',
    subject_required: 'Παρακαλώ εισάγετε θέμα.',
    subject_min: 'Το θέμα πρέπει να έχει τουλάχιστον 3 χαρακτήρες.',
    message_max: 'Το μήνυμα είναι πολύ μεγάλο (μέγ. 2000 χαρακτήρες).',
  },
}

/** Simple, permissive phone regex: digits, spaces, plus, hyphens, parentheses */
const phoneRegex = /^[+()\d][\d\s\-()+]{5,}$/

/** Build the schema with localized messages */
export const getContactFormSchema = (locale: Locale) => {
  const m = messages[locale]
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, { error: m.name_required })
      .min(2, { error: m.name_min }),

    email: z
      .string()
      .trim()
      .min(1, { error: m.email_required })
      .email({ error: m.email_invalid }),

    phone_number: z
      .string()
      .trim()
      .optional()
      .refine((val) => (val ? phoneRegex.test(val) : true), {
        error: m.phone_invalid,
      }),

    subject: z
      .string()
      .trim()
      .min(1, { error: m.subject_required })
      .min(3, { error: m.subject_min }),

    message: z
      .string()
      .trim()
      .max(2000, { error: m.message_max })
      .optional(),
  })
}

export type ContactFormValues = z.infer<ReturnType<typeof getContactFormSchema>>

/** Helper: parse a FormData (client or server) safely with locale-aware errors */
export const parseContactFormData = (formData: FormData, locale: Locale) => {
  const schema = getContactFormSchema(locale)
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone_number: formData.get('phone') ?? formData.get('phone_number'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  }

  // Normalize all to strings (or undefined) before validation
  const normalized = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, typeof v === 'string' ? v : undefined]),
  ) as Record<string, string | undefined>

  return schema.safeParse(normalized)
}

/** Optional: server-side sanitizer for storage */
export const sanitizeForStorage = (values: ContactFormValues) => ({
  ...values,
  name: values.name.trim(),
  email: values.email.trim().toLowerCase(),
  phone_number: values.phone_number?.trim() || null,
  subject: values.subject.trim(),
  message: values.message?.trim() || null,
})
