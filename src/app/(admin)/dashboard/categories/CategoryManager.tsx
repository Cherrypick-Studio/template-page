"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import type { Category } from "@/lib/supabase/types";

interface Props {
  initialCategories: Category[];
}

export default function CategoryManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newIconUrl, setNewIconUrl] = useState("");
  const [newComingSoon, setNewComingSoon] = useState(false);

  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editIconUrl, setEditIconUrl] = useState("");
  const [editComingSoon, setEditComingSoon] = useState(false);

  function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  }

  async function handleCreate() {
    if (!newName.trim() || !newSlug.trim()) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("categories")
      .insert({
        name: newName.trim(),
        slug: newSlug.trim(),
        icon_url: newIconUrl.trim() || null,
        is_coming_soon: newComingSoon,
        sort_order: categories.length + 1,
      })
      .select()
      .single();
    if (err) { setError(err.message); } else if (data) {
      setCategories([...categories, data as Category]);
      setNewName(""); setNewSlug(""); setNewIconUrl(""); setNewComingSoon(false);
      setCreating(false);
    }
    setLoading(false);
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditIconUrl(cat.icon_url ?? "");
    setEditComingSoon(cat.is_coming_soon);
  }

  async function handleUpdate(id: string) {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("categories")
      .update({
        name: editName.trim(),
        slug: editSlug.trim(),
        icon_url: editIconUrl.trim() || null,
        is_coming_soon: editComingSoon,
      })
      .eq("id", id)
      .select()
      .single();
    if (err) { setError(err.message); } else if (data) {
      setCategories(categories.map((c) => (c.id === id ? (data as Category) : c)));
      setEditingId(null);
    }
    setLoading(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? Templates in this category will lose their category assignment.`)) return;
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.from("categories").delete().eq("id", id);
    if (err) { setError(err.message); } else {
      setCategories(categories.filter((c) => c.id !== id));
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-[#EBEBEB] bg-white overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#EBEBEB] p-5">
          <span className="font-semibold text-[#1A1A1A]">
            {categories.length} categories
          </span>
          <Button size="sm" onClick={() => setCreating(true)} disabled={creating}>
            <Plus className="size-4" />
            Add Category
          </Button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EBEBEB] bg-[#FAFAFA] text-left">
              <th className="px-5 py-3 font-medium text-[#888888]">#</th>
              <th className="px-5 py-3 font-medium text-[#888888]">Name</th>
              <th className="px-5 py-3 font-medium text-[#888888]">Slug</th>
              <th className="px-5 py-3 font-medium text-[#888888]">Icon URL</th>
              <th className="px-5 py-3 font-medium text-[#888888]">Coming Soon</th>
              <th className="px-5 py-3 font-medium text-[#888888]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {creating && (
              <tr className="border-b border-[#EBEBEB] bg-[#FFFBF0]">
                <td className="px-5 py-3 text-[#888888]">New</td>
                <td className="px-5 py-3">
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => { setNewName(e.target.value); if (!newSlug) setNewSlug(slugify(e.target.value)); }}
                    placeholder="Category name"
                    className="h-8 w-full rounded-lg border border-[#DDDDDD] px-2 text-sm outline-none focus:border-[#1A1A1A]"
                  />
                </td>
                <td className="px-5 py-3">
                  <input
                    value={newSlug}
                    onChange={(e) => setNewSlug(slugify(e.target.value))}
                    placeholder="category-slug"
                    className="h-8 w-full rounded-lg border border-[#DDDDDD] px-2 text-sm outline-none focus:border-[#1A1A1A]"
                  />
                </td>
                <td className="px-5 py-3">
                  <input
                    value={newIconUrl}
                    onChange={(e) => setNewIconUrl(e.target.value)}
                    placeholder="/assets/ic-figma.svg"
                    className="h-8 w-full rounded-lg border border-[#DDDDDD] px-2 text-sm outline-none focus:border-[#1A1A1A]"
                  />
                </td>
                <td className="px-5 py-3">
                  <input type="checkbox" checked={newComingSoon} onChange={(e) => setNewComingSoon(e.target.checked)} className="w-4 h-4" />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={handleCreate} disabled={loading} className="text-green-600 hover:text-green-700">
                      {loading ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                    </button>
                    <button onClick={() => setCreating(false)} className="text-[#888888] hover:text-[#1A1A1A]">
                      <X className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {categories.length === 0 && !creating ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-[#888888]">
                  No categories yet.
                </td>
              </tr>
            ) : (
              categories.map((cat, idx) => (
                <tr key={cat.id} className="border-b border-[#EBEBEB] last:border-0 hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3 text-[#888888]">{idx + 1}</td>
                  {editingId === cat.id ? (
                    <>
                      <td className="px-5 py-3">
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 w-full rounded-lg border border-[#DDDDDD] px-2 text-sm outline-none focus:border-[#1A1A1A]" />
                      </td>
                      <td className="px-5 py-3">
                        <input value={editSlug} onChange={(e) => setEditSlug(slugify(e.target.value))} className="h-8 w-full rounded-lg border border-[#DDDDDD] px-2 text-sm outline-none focus:border-[#1A1A1A]" />
                      </td>
                      <td className="px-5 py-3">
                        <input value={editIconUrl} onChange={(e) => setEditIconUrl(e.target.value)} className="h-8 w-full rounded-lg border border-[#DDDDDD] px-2 text-sm outline-none focus:border-[#1A1A1A]" />
                      </td>
                      <td className="px-5 py-3">
                        <input type="checkbox" checked={editComingSoon} onChange={(e) => setEditComingSoon(e.target.checked)} className="w-4 h-4" />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleUpdate(cat.id)} disabled={loading} className="text-green-600 hover:text-green-700">
                            {loading ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-[#888888] hover:text-[#1A1A1A]">
                            <X className="size-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-3 font-medium text-[#1A1A1A]">{cat.name}</td>
                      <td className="px-5 py-3 text-[#666666]">{cat.slug}</td>
                      <td className="px-5 py-3 text-[#666666] text-xs truncate max-w-[160px]">{cat.icon_url ?? "—"}</td>
                      <td className="px-5 py-3">
                        {cat.is_coming_soon ? (
                          <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">Yes</span>
                        ) : (
                          <span className="text-xs text-[#888888]">No</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => startEdit(cat)} className="text-[#888888] hover:text-[#1A1A1A] transition-colors">
                            <Pencil className="size-4" />
                          </button>
                          <button onClick={() => handleDelete(cat.id, cat.name)} className="text-[#888888] hover:text-red-500 transition-colors">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
