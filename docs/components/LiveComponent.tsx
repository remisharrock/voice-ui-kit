"use client";

import * as VoiceUIKit from "@pipecat-ai/voice-ui-kit";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { useTheme } from "next-themes";
import React, { useEffect, useMemo, useState } from "react";
import { LiveError, LivePreview, LiveProvider } from "react-live";

import { CodeBlock, Pre as CodePre } from "fumadocs-ui/components/codeblock";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Loader2 } from "lucide-react";

type LiveComponentProps = {
  code?: string;
  children?: string;
  scope?: Record<string, unknown>;
  noInline?: boolean;
  language?: string;
  className?: string;
  editorClassName?: string;
  previewClassName?: string;
  height?: number | string;
  initialTab?: "preview" | "code";
  imports?: string | string[];
  previewOrientation?: "horizontal" | "vertical";
};

function normalizeCodeIndentation(snippet: string): string {
  let s = snippet.replace(/\r\n?/g, "\n");
  s = s.replace(/^\n+/, "").replace(/\n+$/, "");
  const lines = s.split("\n");
  let minIndent: number | null = null;
  for (const line of lines) {
    if (line.trim().length === 0) continue;
    const match = line.match(/^[ \t]+/);
    const indent = match ? match[0].length : 0;
    if (minIndent === null || indent < minIndent) minIndent = indent;
  }
  if (!minIndent) return s;
  return lines
    .map((line) =>
      line.startsWith(" ".repeat(minIndent)) ? line.slice(minIndent) : line,
    )
    .join("\n");
}

function stripImportsExportsRequires(snippet: string): string {
  const lines = snippet.split("\n");
  const kept: string[] = [];
  let skippingImport = false;
  for (const line of lines) {
    const trimmed = line.trim();
    // Start skipping on import line (handles multi-line named imports)
    if (!skippingImport && /^import\s/.test(trimmed)) {
      skippingImport = !/(;| from\s+['"]).*$/.test(trimmed);
      continue;
    }
    if (skippingImport) {
      // end when we hit `from "..."` or a semicolon-terminated line
      if (/(;| from\s+['"]).*$/.test(trimmed)) {
        skippingImport = false;
      }
      continue;
    }
    kept.push(line);
  }
  return kept.join("\n");
}

const defaultPreviewClassName = `flex items-center justify-center gap-4 text-base @max-lg:flex-col text-foreground`;

export function LiveComponent({
  code,
  children,
  scope,
  noInline,
  language = "tsx",
  className,
  editorClassName,
  previewClassName = "vkui-root",
  previewOrientation = "horizontal",
  initialTab = "preview",
  height = "h-fit",
}: LiveComponentProps) {
  const { theme: themeFromProvider, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rawSource = useMemo(() => {
    if (typeof code === "string") return code;
    if (typeof children === "string") return children;
    return "";
  }, [code, children]);
  const displaySource = useMemo(
    () => normalizeCodeIndentation(rawSource),
    [rawSource],
  );
  const execSource = useMemo(
    () => stripImportsExportsRequires(displaySource),
    [displaySource],
  );
  const mergedScope = useMemo(
    () => ({ React, ...VoiceUIKit, ...(scope ?? {}) }),
    [scope],
  );

  const h = typeof height === "number" ? `h-[${height}px]` : height;
  const previewOrientationClass =
    previewOrientation === "horizontal" ? "flex-row" : "flex-col";

  return (
    <div className={className}>
      <LiveProvider
        code={execSource}
        scope={mergedScope}
        noInline={noInline}
        enableTypeScript={true}
      >
        <Tabs defaultValue={initialTab} items={["Preview", "Code"]}>
          <Tab value="Preview" className="@container">
            <div className={`${previewClassName} relative w-full`}>
              {mounted ? (
                <LivePreview
                  className={`${defaultPreviewClassName} ${h} ${previewOrientationClass} ${themeFromProvider === "dark" ? "dark" : ""}`}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Loader2
                    className="animate-spin text-muted-foreground"
                    size={24}
                  />
                </div>
              )}
            </div>
          </Tab>
          <Tab value="Code" className={`${h} ${editorClassName}`}>
            <DynamicCodeBlock
              code={displaySource}
              lang={language}
              options={{
                themes: {
                  light: "github-light",
                  dark: "github-dark",
                },
                components: {
                  pre: (props) => (
                    <CodeBlock
                      data-line-numbers
                      data-line-numbers-start={1}
                      {...props}
                    >
                      <CodePre>{props.children}</CodePre>
                    </CodeBlock>
                  ),
                },
              }}
            />
          </Tab>
        </Tabs>
        <div style={{ color: "#dc2626", padding: 12 }}>
          <LiveError />
        </div>
      </LiveProvider>
      {/* Hardcoded portal structure that matches .vkui-root .dark CSS selector */}
      <div className="vkui-root">
        <div className="voice-ui-kit dark" />
      </div>
    </div>
  );
}
