"use client";
import React, { useEffect, useState } from "react";

import "@pipecat-ai/voice-ui-kit/styles.scoped";

let uiKitModule: any = null;
let uiKitPromise: Promise<any> | null = null;

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
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    getUiKitModule()
      .then((module) => {
        const ComponentFromModule = module[componentName];
        if (!ComponentFromModule) {
          console.error(`Component '${componentName}' not found in UI kit.`);
          return;
        }

        setComponent(() => ComponentFromModule);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load sandbox resources:", error);
      });
  }, [componentName, isClient]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
        Loading component...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
        Loading component...
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
        Component not found
      </div>
    );
  }

  return (
    <div className="vkui-root">
      <Component {...props}>{children}</Component>
    </div>
  );
}
