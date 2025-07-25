"use client";
import React, { useEffect, useRef, useState } from "react";

import "@pipecat-ai/voice-ui-kit/styles";

let cssContent: string | null = null;
let cssPromise: Promise<string> | null = null;
let uiKitModule: any = null;
let uiKitPromise: Promise<any> | null = null;

async function getCssContent(): Promise<string> {
  if (cssContent) return cssContent;
  if (cssPromise) return cssPromise;

  cssPromise = (async () => {
    try {
      const styleSheets = Array.from(document.styleSheets);
      const voiceKitSheet = styleSheets.find(
        (sheet) => sheet.href && sheet.href.includes("voice-ui-kit"),
      );

      if (voiceKitSheet) {
        const rules = Array.from(
          voiceKitSheet.cssRules || voiceKitSheet.rules || [],
        );
        return rules.map((rule) => rule.cssText).join("\n");
      }

      console.warn("Could not find voice-ui-kit CSS in document");
      return "";
    } catch (error) {
      console.error("Failed to extract CSS:", error);
      return "";
    }
  })();

  cssContent = await cssPromise;
  return cssContent;
}

async function getUiKitModule() {
  if (uiKitModule) return uiKitModule;
  if (uiKitPromise) return uiKitPromise;

  uiKitPromise = import("@pipecat-ai/voice-ui-kit");
  uiKitModule = await uiKitPromise;
  return uiKitModule;
}

export function Sandbox({
  componentName,
  props = {},
  children,
}: {
  componentName: string;
  props?: Record<string, any>;
  children?: React.ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !hostRef.current || shadowRoot) return;

    const shadow = hostRef.current.attachShadow({ mode: "open" });
    setShadowRoot(shadow);

    Promise.all([getCssContent(), getUiKitModule()])
      .then(([css, module]) => {
        const style = document.createElement("style");
        style.textContent = css;
        shadow.appendChild(style);

        const Component = module[componentName];
        if (!Component) {
          console.error(`Component '${componentName}' not found in UI kit.`);
          return;
        }

        const mountPoint = document.createElement("div");
        shadow.appendChild(mountPoint);

        import("react-dom/client").then((ReactDOM) => {
          ReactDOM.createRoot(mountPoint).render(
            <Component {...props}>{children}</Component>,
          );
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.error("Failed to load sandbox resources:", error);
      });
  }, [componentName, props, children, shadowRoot, isClient]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
        Loading component...
      </div>
    );
  }

  return (
    <div ref={hostRef}>
      {isLoading && (
        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
          Loading component...
        </div>
      )}
    </div>
  );
}
