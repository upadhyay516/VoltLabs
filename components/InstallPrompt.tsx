"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "voltlab_install_prompt_dismissed";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(true); // default hidden until we check storage

  useEffect(() => {
    // If the person already dismissed or installed it before, don't wire up
    // the listener at all — this persists across reloads and new tabs,
    // unlike component state which resets every time the page loads.
    const alreadyHandled = localStorage.getItem(STORAGE_KEY);
    if (alreadyHandled) return;

    setDismissed(false);

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e);
    }
    window.addEventListener("beforeinstallprompt", handler);

    // Also stop showing it forever once the app actually gets installed,
    // even if they installed via the browser's own icon instead of our button.
    function onInstalled() {
      localStorage.setItem(STORAGE_KEY, "installed");
      setDeferredPrompt(null);
      setDismissed(true);
    }
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismissForGood() {
    localStorage.setItem(STORAGE_KEY, "dismissed");
    setDismissed(true);
  }

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 glass-elevated p-4 flex items-center gap-3">
      <div className="flex-1">
        <p className="font-terminal text-lg">Install VoltLab Builds</p>
        <p className="font-data text-xs text-[var(--text-dim)]">
          Add to your home screen for quick access
        </p>
      </div>
      <button
        onClick={async () => {
          deferredPrompt.prompt();
          await deferredPrompt.userChoice;
          localStorage.setItem(STORAGE_KEY, "prompted");
          setDeferredPrompt(null);
        }}
        className="btn-pixel-outline text-xs whitespace-nowrap"
      >
        Install
      </button>
      <button
        onClick={dismissForGood}
        className="text-[var(--text-dim)] text-lg leading-none"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
