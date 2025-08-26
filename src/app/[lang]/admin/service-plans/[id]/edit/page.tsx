// src/app/[lang]/admin/service-plans/[id]/edit/page.tsx
export const runtime = 'nodejs';

import { use } from 'react';
import EditServicePlanClient from './EditServicePlanClient';

type Lang = 'en' | 'es' | 'el';
type Params = { lang: Lang; id: string };

export default function Page({ params }: { params: Promise<Params> }) {
  const { lang, id } = use(params); // Next 15: unwrap Promise
  return <EditServicePlanClient lang={lang} id={id} />;
}
