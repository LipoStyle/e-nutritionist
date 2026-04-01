import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditServiceForm from "./EditServiceForm";

interface EditPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export default async function EditServicePage({ params }: EditPageProps) {
  const { lang, id } = await params;
  const supabase = await createSupabaseServerClient();

  // Fetch Master Record, Translations, and Features in one go
  const { data: service, error } = await supabase
    .from("services_current")
    .select(
      `
      *,
      translations:service_translations_current(*),
      features:service_features_current(*)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !service) return notFound();

  return (
    <div className="services-admin-container">
      <EditServiceForm service={service} lang={lang} />
    </div>
  );
}
