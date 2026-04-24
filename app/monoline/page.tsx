"use client";

import {
  ChangeEvent,
  DragEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactCrop, {
  centerCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { DEFAULT_STYLE_PROMPT } from "./lib/prompts";
import type { SupportedMediaType } from "./lib/gemini";

type Phase = "idle" | "cropping" | "generating" | "result" | "error";

type UploadedImage = {
  dataUrl: string;
  mediaType: SupportedMediaType;
};

type GenerationResult = {
  svg: string;
};

const STYLE_PROMPT_STORAGE_KEY = "monoline:stylePrompt";
const MAX_CROP_DIMENSION = 2048;

const MEDIA_BY_EXT: Record<string, SupportedMediaType> = {
  "image/png": "image/png",
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/webp": "image/webp",
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function cropToPng(
  img: HTMLImageElement,
  crop: PixelCrop,
): { base64: string; dataUrl: string } {
  const scaleX = img.naturalWidth / img.width;
  const scaleY = img.naturalHeight / img.height;

  const sourceW = Math.round(crop.width * scaleX);
  const sourceH = Math.round(crop.height * scaleY);
  const sourceX = Math.round(crop.x * scaleX);
  const sourceY = Math.round(crop.y * scaleY);

  const maxSide = Math.max(sourceW, sourceH);
  const scale = maxSide > MAX_CROP_DIMENSION ? MAX_CROP_DIMENSION / maxSide : 1;
  const targetW = Math.max(1, Math.round(sourceW * scale));
  const targetH = Math.max(1, Math.round(sourceH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    img,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    0,
    0,
    targetW,
    targetH,
  );

  const dataUrl = canvas.toDataURL("image/png");
  const base64 = dataUrl.split(",", 2)[1] ?? "";
  return { base64, dataUrl };
}

export default function MonolinePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [upload, setUpload] = useState<UploadedImage | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(
    null,
  );
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stylePrompt, setStylePrompt] = useState<string>(DEFAULT_STYLE_PROMPT);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STYLE_PROMPT_STORAGE_KEY);
    if (stored && stored.trim().length > 0) {
      setStylePrompt(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STYLE_PROMPT_STORAGE_KEY, stylePrompt);
  }, [stylePrompt]);

  useEffect(() => {
    if (phase !== "generating") {
      setProgressStep(0);
      return;
    }
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setProgressStep(1), 8000));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [phase]);

  const runGeneration = useCallback(
    async (base64: string, mediaType: SupportedMediaType, prompt: string) => {
      setPhase("generating");
      setErrorMessage(null);
      try {
        const res = await fetch("/monoline/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64,
            mediaType,
            stylePrompt: prompt,
          }),
        });
        if (!res.ok) {
          const payload = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(payload.error || `Request failed: ${res.status}`);
        }
        const data = (await res.json()) as GenerationResult;
        setResult(data);
        setPhase("result");
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Unknown error");
        setPhase("error");
      }
    },
    [],
  );

  const handleFile = useCallback(async (file: File) => {
    const mediaType = MEDIA_BY_EXT[file.type];
    if (!mediaType) {
      setErrorMessage(`Unsupported file type: ${file.type}`);
      setPhase("error");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUpload({ dataUrl, mediaType });
      setCrop(undefined);
      setCompletedCrop(null);
      setCroppedPreviewUrl(null);
      setResult(null);
      setErrorMessage(null);
      setPhase("cropping");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      setPhase("error");
    }
  }, []);

  const onImageLoad = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initial = centerCrop(
      { unit: "%", width: 100, height: 100, x: 0, y: 0 },
      width,
      height,
    );
    setCrop(initial);
    setCompletedCrop({
      unit: "px",
      x: 0,
      y: 0,
      width,
      height,
    });
  }, []);

  const handleGenerateFromCrop = useCallback(() => {
    if (!cropImgRef.current || !completedCrop || !upload) return;
    if (completedCrop.width < 2 || completedCrop.height < 2) {
      setErrorMessage("Crop area is too small.");
      setPhase("error");
      return;
    }
    try {
      const { base64, dataUrl } = cropToPng(cropImgRef.current, completedCrop);
      setCroppedPreviewUrl(dataUrl);
      void runGeneration(base64, "image/png", stylePrompt);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      setPhase("error");
    }
  }, [completedCrop, runGeneration, stylePrompt, upload]);

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) void handleFile(file);
      e.target.value = "";
    },
    [handleFile],
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile],
  );

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setDragOver(false), []);

  const downloadSvg = useCallback(() => {
    if (!result) return;
    const blob = new Blob([result.svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    a.href = url;
    a.download = `monoline-${stamp}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result]);

  const copySvg = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.svg);
  }, [result]);

  const reset = useCallback(() => {
    setUpload(null);
    setResult(null);
    setErrorMessage(null);
    setCrop(undefined);
    setCompletedCrop(null);
    setCroppedPreviewUrl(null);
    setPhase("idle");
  }, []);

  const backToCrop = useCallback(() => {
    if (!upload) return;
    setResult(null);
    setErrorMessage(null);
    setPhase("cropping");
  }, [upload]);

  const regenerate = useCallback(() => {
    if (!cropImgRef.current || !completedCrop) {
      backToCrop();
      return;
    }
    handleGenerateFromCrop();
  }, [backToCrop, completedCrop, handleGenerateFromCrop]);

  const canAct = phase !== "generating";
  const showGrid = phase !== "idle";

  const progressLabels = useMemo(
    () =>
      [
        { label: "Generating illustration" },
        { label: "Vectorizing" },
      ] as const,
    [],
  );

  return (
    <>
      <header className="ml-topbar">
        <span className="ml-brand">Monoline Illustrator</span>
        <div className="ml-topbar-actions">
          {phase === "cropping" && (
            <>
              <button
                className="ml-btn primary"
                onClick={handleGenerateFromCrop}
                disabled={!completedCrop}
              >
                Generate
              </button>
              <button className="ml-btn ghost" onClick={reset}>
                New
              </button>
            </>
          )}
          {phase === "result" && (
            <>
              <button
                className="ml-btn"
                onClick={copySvg}
                disabled={!canAct}
              >
                Copy SVG
              </button>
              <button
                className="ml-btn"
                onClick={downloadSvg}
                disabled={!canAct}
              >
                Download
              </button>
              <button
                className="ml-btn"
                onClick={backToCrop}
                disabled={!canAct}
              >
                Adjust crop
              </button>
              <button
                className="ml-btn"
                onClick={regenerate}
                disabled={!canAct}
              >
                Regenerate
              </button>
              <button className="ml-btn ghost" onClick={reset}>
                New
              </button>
            </>
          )}
          {phase === "error" && (
            <>
              {upload && (
                <button className="ml-btn" onClick={backToCrop}>
                  Back to crop
                </button>
              )}
              <button className="ml-btn ghost" onClick={reset}>
                New
              </button>
            </>
          )}
          <button
            className="ml-btn ghost"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
          >
            Settings
          </button>
        </div>
      </header>

      <main className="ml-stage">
        {!showGrid && (
          <div
            className={`ml-drop${dragOver ? " drag-over" : ""}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <div className="ml-drop-title">Drop a screenshot</div>
            <div className="ml-drop-hint">PNG, JPG, or WebP</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={onInputChange}
            />
          </div>
        )}

        {showGrid && (
          <div className="ml-grid">
            <section className="ml-panel">
              <div className="ml-panel-label">
                {phase === "cropping"
                  ? "Source — drag to crop"
                  : "Source (cropped)"}
              </div>
              <div className="ml-image-wrap">
                {phase === "cropping" && upload && (
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    keepSelection
                    className="ml-crop"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={cropImgRef}
                      src={upload.dataUrl}
                      alt="Uploaded screenshot"
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                )}
                {phase !== "cropping" && croppedPreviewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={croppedPreviewUrl} alt="Cropped source" />
                )}
                {phase !== "cropping" && !croppedPreviewUrl && upload && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={upload.dataUrl} alt="Uploaded screenshot" />
                )}
              </div>
            </section>

            <section className="ml-panel">
              <div className="ml-panel-label">Output</div>
              {phase === "cropping" && (
                <div className="ml-progress">
                  <div className="ml-progress-step">
                    <span>Adjust crop, then press Generate</span>
                  </div>
                </div>
              )}
              {phase === "generating" && (
                <div className="ml-progress">
                  {progressLabels.map((step, i) => (
                    <div
                      key={step.label}
                      className={`ml-progress-step${
                        i === progressStep
                          ? " active"
                          : i < progressStep
                            ? " done"
                            : ""
                      }`}
                    >
                      <span>{step.label}</span>
                      <span>
                        {i < progressStep
                          ? "✓"
                          : i === progressStep
                            ? "…"
                            : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {phase === "error" && (
                <div className="ml-error">{errorMessage}</div>
              )}
              {phase === "result" && result && (
                <div
                  className="ml-svg-host"
                  dangerouslySetInnerHTML={{ __html: result.svg }}
                />
              )}
            </section>
          </div>
        )}
      </main>

      {settingsOpen && (
        <>
          <div
            className="ml-drawer-backdrop"
            onClick={() => setSettingsOpen(false)}
          />
          <aside className="ml-drawer">
            <div className="ml-drawer-header">
              <span className="ml-drawer-title">Settings</span>
              <button
                className="ml-btn ghost"
                onClick={() => setSettingsOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="ml-drawer-body">
              <div className="ml-field">
                <label className="ml-field-label">
                  <span>Style prompt</span>
                  <button
                    className="ml-reset-link"
                    onClick={() => setStylePrompt(DEFAULT_STYLE_PROMPT)}
                  >
                    Reset
                  </button>
                </label>
                <textarea
                  className="ml-textarea"
                  value={stylePrompt}
                  onChange={(e) => setStylePrompt(e.target.value)}
                  spellCheck={false}
                />
                <div className="ml-drop-hint">
                  Applied to the next generation. Edits persist locally.
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
