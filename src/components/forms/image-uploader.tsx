"use client";

import { Button } from "@events-lab/shared-components";
import { useRef, useState } from "react";
import { TrashIcon } from "@/components/icon-button";

const MAX_IMAGES = 8;
const MAX_EDGE = 960;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () =>
      reject(reader.error ?? new Error("Could not read image"));
    reader.onload = () => {
      const source = String(reader.result ?? "");
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(
          1,
          MAX_EDGE / Math.max(image.width, image.height),
        );
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
          resolve(source);
          return;
        }
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.onerror = () => reject(new Error("Could not read image"));
      image.src = source;
    };
    reader.readAsDataURL(file);
  });
}

const overlayButton =
  "grid size-9 cursor-pointer place-items-center rounded-full border-0 bg-white shadow-[0_6px_16px_rgba(15,23,42,0.18)] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true" fill="none">
      <path
        d={direction === "left" ? "M12.5 4.5 7 10l5.5 5.5" : "M7.5 4.5 13 10l-5.5 5.5"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type ImageUploaderProps = {
  images: string[];
  onChange: (images: string[]) => void;
};

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const atLimit = images.length >= MAX_IMAGES;

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setError(`You can add up to ${MAX_IMAGES} images.`);
      return;
    }

    setReading(true);
    setError(null);
    const files = Array.from(list);
    const accepted = files.slice(0, room);
    const next = [...images];
    const skipped: string[] = [];

    for (const file of accepted) {
      if (!file.type.startsWith("image/")) {
        skipped.push(file.name);
        continue;
      }
      try {
        next.push(await compressImage(file));
      } catch {
        skipped.push(file.name);
      }
    }

    onChange(next);
    if (files.length > room) {
      setError(
        `Added ${room} image${room === 1 ? "" : "s"}. The limit is ${MAX_IMAGES}.`,
      );
    } else if (skipped.length > 0) {
      setError(`Skipped ${skipped.join(", ")}.`);
    }
    setReading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length || from === to) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    if (!item) return;
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold">Images</span>
      <span className="text-xs text-secondary-500">
        Upload one or more photos. Use the arrows to set the order. The first
        photo is shown in the client.
      </span>
      {images.length > 0 ? (
        <div className="mt-1 flex flex-wrap gap-3">
          {images.map((src, index) => (
            <div key={`${index}-${src.slice(-24)}`} className="relative">
              <div className="size-36 overflow-hidden rounded-2xl border border-secondary-200 bg-secondary-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="size-full object-cover" />
              </div>
              <button
                type="button"
                aria-label={`Remove image ${index + 1}`}
                title="Remove image"
                className={`${overlayButton} absolute top-2 right-2 text-[#9b1c1c] hover:bg-[#fdeceb]`}
                onClick={() =>
                  onChange(images.filter((_, imageIndex) => imageIndex !== index))
                }
              >
                <TrashIcon />
              </button>
              {images.length > 1 ? (
                <div className="absolute inset-x-2 bottom-2 flex items-center justify-between">
                  <button
                    type="button"
                    aria-label={`Move image ${index + 1} earlier`}
                    title="Move earlier"
                    disabled={index === 0}
                    className={`${overlayButton} text-secondary-900 hover:bg-secondary-100`}
                    onClick={() => moveImage(index, index - 1)}
                  >
                    <ChevronIcon direction="left" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move image ${index + 1} later`}
                    title="Move later"
                    disabled={index === images.length - 1}
                    className={`${overlayButton} text-secondary-900 hover:bg-secondary-100`}
                    onClick={() => moveImage(index, index + 1)}
                  >
                    <ChevronIcon direction="right" />
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(event) => {
          void handleFiles(event.target.files);
        }}
      />
      <div className="mt-1">
        <Button
          type="button"
          variant="secondary"
          disabled={reading || atLimit}
          onClick={() => inputRef.current?.click()}
        >
          {reading ? "Reading images…" : "Upload images"}
        </Button>
      </div>
      {error ? (
        <span className="text-xs text-accent-700" role="status">
          {error}
        </span>
      ) : null}
    </div>
  );
}
