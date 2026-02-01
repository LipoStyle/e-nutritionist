import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { blogComingSoonUI } from "@/app/[lang]/(public)/blogs/blog.data";

type Lang = "en" | "es" | "el";

type Props = {
  params: Promise<{ lang: Lang }>;
};

export const metadata: Metadata = {
  title: "Blog",
};

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;

  return <ComingSoon lang={lang} ui={blogComingSoonUI[lang]} kind="blog" />;
}
