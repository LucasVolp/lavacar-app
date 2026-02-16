import { redirect } from "next/navigation";

interface AdvancedSettingsPageProps {
  params: Promise<{ shopId: string }>;
}

export default async function AdvancedSettingsPage({ params }: AdvancedSettingsPageProps) {
  const { shopId } = await params;
  redirect(`/admin/shop/${shopId}/settings?tab=advanced`);
}
