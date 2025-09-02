import { useEffect, useState } from "react";
import {
  loadContent,
  saveContent,
  getContent,
  type ContentMap,
} from "@/lib/cms";

const FIELDS = [
  { key: "hero_title", label: "Hero Title", placeholder: "Luxury Abayas Crafted for Royal Elegance" },
  { key: "hero_subtitle", label: "Hero Subtitle", placeholder: "Discover exquisite abayas..." },
  { key: "hero_image", label: "Hero Image URL", placeholder: "https://..." },
  { key: "banner_title", label: "Banner Title", placeholder: "Crafted by Artisans" },
  { key: "banner_text", label: "Banner Text", placeholder: "Every piece is meticulously designed..." },
  { key: "banner_image", label: "Banner Image URL", placeholder: "https://..." },
  { key: "cat1_title", label: "Category 1 Title", placeholder: "Abayas" },
  { key: "cat1_image", label: "Category 1 Image URL", placeholder: "https://..." },
  { key: "cat2_title", label: "Category 2 Title", placeholder: "Kaftans" },
  { key: "cat2_image", label: "Category 2 Image URL", placeholder: "https://..." },
  { key: "cat3_title", label: "Category 3 Title", placeholder: "Modest Dresses" },
  { key: "cat3_image", label: "Category 3 Image URL", placeholder: "https://..." },
  { key: "cat4_title", label: "Category 4 Title", placeholder: "Prayer Sets" },
  { key: "cat4_image", label: "Category 4 Image URL", placeholder: "https://..." },
];

export default function ContentManager() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    setContent(loadContent());
  }, []);

  const onSave = () => {
    saveContent(content);
    alert("Content saved");
  };

  const onReset = () => {
    const next: ContentMap = {};
    setContent(next);
    saveContent(next);
  };

  return (
    <div className="rounded-xl border">
      <div className="border-b p-3 font-semibold">Site Content</div>
      <div className="grid gap-3 p-4 md:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="grid gap-1 text-sm">
            <span className="text-xs">{f.label}</span>
            <input
              className="h-10 rounded-md border px-2"
              placeholder={f.placeholder}
              value={content[f.key] ?? ""}
              onChange={(e) =>
                setContent({ ...content, [f.key]: e.target.value })
              }
            />
          </label>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t p-3">
        <button
          className="rounded-md border px-3 py-2 text-sm"
          onClick={onSave}
        >
          Save
        </button>
        <button
          className="rounded-md border px-3 py-2 text-sm"
          onClick={onReset}
        >
          Reset to Defaults
        </button>
      </div>
      <div className="border-t p-4 text-xs text-muted-foreground">
        Missing fields fall back to built-in defaults in the UI.
      </div>
    </div>
  );
}
