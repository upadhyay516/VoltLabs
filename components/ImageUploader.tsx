"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

const BUCKET = "product-images";
const MAX_SIZE_MB = 5;

export default function ImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
    toast.success("Image uploaded");
    setUploading(false);
  }

  return (
    <div className="sm:col-span-2">
      <label className="block font-data text-xs text-[var(--text-dim)] mb-1.5">
        Product image
      </label>

      <div className="flex items-start gap-3 flex-wrap">
        <div className="w-24 h-24 bg-[var(--panel)] pixel-grid flex items-center justify-center overflow-hidden shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="object-cover w-full h-full" />
          ) : (
            <span className="font-display text-[7px] text-[var(--accent)] text-center px-1">
              no image
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 min-w-[180px]">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = ""; // allow re-selecting the same file later
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-pixel-outline text-xs"
          >
            {uploading ? "Uploading…" : "Choose photo from PC"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs font-data text-[var(--accent-2)]"
            >
              Remove image
            </button>
          )}
          <p className="font-data text-[10px] text-[var(--text-dim)]">
            JPG/PNG, up to {MAX_SIZE_MB}MB
          </p>
        </div>
      </div>
    </div>
  );
}
