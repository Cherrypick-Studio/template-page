"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

interface Props {
  id: string;
  title: string;
}

export default function TemplateActions({ id, title }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("templates").delete().eq("id", id);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50 flex items-center gap-1"
    >
      {loading && <Loader2 className="size-3 animate-spin" />}
      Delete
    </button>
  );
}
