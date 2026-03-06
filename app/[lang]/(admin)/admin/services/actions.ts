"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Deletes a service master record.
 * Assumes Cascade Delete is enabled in Supabase to remove translations/features.
 */
export async function deleteService(serviceId: string, lang: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("services_current")
    .delete()
    .eq("id", serviceId);

  if (error) {
    throw new Error(`Failed to delete service: ${error.message}`);
  }

  // Refresh the inventory page to show the item has been removed
  revalidatePath(`/${lang}/admin/services`);
}

/**
 * Creates a new service with image upload, master record,
 * localized translations, and dynamic features.
 */
export async function createService(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  // 1. Image Upload to 'service-images' bucket
  const imageFile = formData.get("image") as File;
  let imageUrl = "";

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("service-images")
      .upload(filePath, imageFile);

    if (uploadError) throw new Error(`Upload Failed: ${uploadError.message}`);

    const { data: urlData } = supabase.storage
      .from("service-images")
      .getPublicUrl(filePath);

    imageUrl = urlData.publicUrl;
  }

  // 2. Insert Master Record
  const { data: service, error: sError } = await supabase
    .from("services_current")
    .insert([
      {
        slug: formData.get("slug"),
        price: parseFloat(formData.get("price") as string),
        service_type: formData.get("service_type"),
        is_active: formData.get("is_active") === "true",
        image_url: imageUrl,
      },
    ])
    .select()
    .single();

  if (sError) throw new Error(`Master Record Error: ${sError.message}`);

  // 3. Insert Translations & Features for all supported locales
  const locales = ["en", "el", "es"];

  for (const lang of locales) {
    // Insert Translation
    const { error: tError } = await supabase
      .from("service_translations_current")
      .insert({
        service_id: service.id,
        language_code: lang,
        title: formData.get(`title_${lang}`),
        summary: formData.get(`summary_${lang}`),
        description: formData.get(`description_${lang}`),
      });

    if (tError) console.error(`Translation Error (${lang}):`, tError.message);

    // 4. Handle Features (JSON from FeatureManager)
    const featuresJson = formData.get(`features_${lang}`) as string;

    if (featuresJson) {
      try {
        const featuresArray = JSON.parse(featuresJson) as string[];

        if (featuresArray.length > 0) {
          const featureRows = featuresArray.map((text, index) => ({
            service_id: service.id,
            language_code: lang,
            feature_text: text,
            order_index: index,
          }));

          const { error: fError } = await supabase
            .from("service_features_current")
            .insert(featureRows);

          if (fError)
            console.error(`Features Error (${lang}):`, fError.message);
        }
      } catch (e) {
        console.error("Failed to parse features JSON", e);
      }
    }
  }

  // Clear cache for the inventory and redirect home
  revalidatePath("/admin/services");
  redirect("/en/admin/services");
}
