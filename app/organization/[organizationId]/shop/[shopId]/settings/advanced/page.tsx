import { redirect } from "next/navigation";

interface AdvancedSettingsPageProps {
  params: Promise<{ organizationId: string; shopId: string }>;
}

export default async function AdvancedSettingsPage({ params }: AdvancedSettingsPageProps) {
  const { organizationId, shopId } = await params;
  redirect(`/organization/${organizationId}/shop/${shopId}/settings?tab=advanced`);
}
