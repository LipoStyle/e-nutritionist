// src/app/[lang]/admin/service-plans/new/page.tsx
import { use } from 'react';
import NewServicePlanClient from './NewServicePlanClient';

type Lang = 'en' | 'es' | 'el';
type Params = { lang: Lang };

export default function Page({ params }: { params: Promise<Params> }) {
  const { lang } = use(params); // unwrap Promise in Next 15
  return <NewServicePlanClient lang={lang} />;
}
