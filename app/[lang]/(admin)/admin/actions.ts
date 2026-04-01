"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * LOGOUT ACTION
 */
export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  // Next.js 15 requires awaiting cookies
  const cookieStore = await cookies();
  const lang = cookieStore.get("locale")?.value || "en";

  redirect(`/${lang}/admin/login`);
}

/**
 * DELETE ACTION
 */
export async function deleteService(serviceId: string, lang: string) {
  const supabase = await createSupabaseServerClient();

  // Manual cleanup of children (if Cascade Delete isn't set in DB)
  await supabase
    .from("service_features_current")
    .delete()
    .eq("service_id", serviceId);
  await supabase
    .from("service_translations_current")
    .delete()
    .eq("service_id", serviceId);

  const { error } = await supabase
    .from("services_current")
    .delete()
    .eq("id", serviceId);

  if (error) throw new Error(`Delete Error: ${error.message}`);

  revalidatePath(`/${lang}/admin/services`);
}

/**
 * CREATE ACTION
 */
export async function createService(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  // 1. Image Upload
  const imageFile = formData.get("image") as File;
  let imageUrl = "";

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("service-images")
      .upload(filePath, imageFile);

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("service-images")
        .getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }
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

  // 3. Insert Translations & Features
  const locales = ["en", "el", "es"];
  for (const locale of locales) {
    await supabase.from("service_translations_current").insert({
      service_id: service.id,
      language_code: locale,
      title: formData.get(`title_${locale}`),
      summary: formData.get(`summary_${locale}`),
      description: formData.get(`description_${locale}`),
    });

    const featuresJson = formData.get(`features_${locale}`) as string;
    if (featuresJson) {
      const featuresArray = JSON.parse(featuresJson) as string[];
      if (featuresArray.length > 0) {
        const featureRows = featuresArray.map((text, index) => ({
          service_id: service.id,
          language_code: locale,
          feature_text: text,
          order_index: index,
        }));
        await supabase.from("service_features_current").insert(featureRows);
      }
    }
  }

  revalidatePath("/admin/services");
  redirect("/en/admin/services");
}

/**
 * UPDATE ACTION
 */
export async function updateService(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = formData.get("id") as string;
  const lang = formData.get("current_lang") as string;

  // 1. Image Logic
  const imageFile = formData.get("image") as File;
  let imageUrl = formData.get("existing_image_url") as string;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `covers/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from("service-images")
      .upload(filePath, imageFile);
    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("service-images")
        .getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }
  }

  // 2. Update Master
  const { error: sError } = await supabase
    .from("services_current")
    .update({
      slug: formData.get("slug"),
      price: parseFloat(formData.get("price") as string),
      service_type: formData.get("service_type"),
      is_active: formData.get("is_active") === "true",
      image_url: imageUrl,
    })
    .eq("id", id);

  if (sError) throw new Error(sError.message);

  // 3. Update Translations & Features
  const locales = ["en", "el", "es"];
  for (const locale of locales) {
    await supabase.from("service_translations_current").upsert(
      {
        service_id: id,
        language_code: locale,
        title: formData.get(`title_${locale}`),
        summary: formData.get(`summary_${locale}`),
        description: formData.get(`description_${locale}`),
      },
      { onConflict: "service_id,language_code" },
    );

    const featuresJson = formData.get(`features_${locale}`) as string;
    if (featuresJson) {
      await supabase
        .from("service_features_current")
        .delete()
        .eq("service_id", id)
        .eq("language_code", locale);
      const featuresArray = JSON.parse(featuresJson) as string[];
      if (featuresArray.length > 0) {
        const featureRows = featuresArray.map((text, index) => ({
          service_id: id,
          language_code: locale,
          feature_text: text,
          order_index: index,
        }));
        await supabase.from("service_features_current").insert(featureRows);
      }
    }
  }

  revalidatePath("/admin/services");
  revalidatePath(`/${lang}/admin/services/edit/${id}`);
  redirect(`/${lang}/admin/services`);
}
