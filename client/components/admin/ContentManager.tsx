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
    <div className="rounded-xl border bg-white overflow-hidden flex flex-col">
      <div className="border-b p-4 font-semibold text-foreground">Site Content</div>
      <div className="flex-1 overflow-y-auto grid gap-4 p-4 md:p-6 md:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="grid gap-2 text-sm">
            <span className="text-xs font-medium text-foreground">{f.label}</span>
            <input
              className="h-10 rounded-lg border px-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={f.placeholder}
              value={content[f.key] ?? ""}
              onChange={(e) =>
                setContent({ ...content, [f.key]: e.target.value })
              }
            />
          </label>
        ))}
      </div>
      <div className="border-t p-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
        <button
          className="h-10 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={onSave}
        >
          Save
        </button>
        <button
          className="h-10 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={onReset}
        >
          Reset
        </button>
        <div className="text-xs text-muted-foreground ml-auto hidden md:block">
          Missing fields fall back to built-in defaults.
        </div>
      </div>
      <div className="md:hidden border-t p-4 text-xs text-muted-foreground">
        Missing fields fall back to built-in defaults in the UI.
      </div>
    </div>
  );
}
