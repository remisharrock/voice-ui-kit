import { FullScreenContainer } from "@/components/ui";
import type { StoryDefault } from "@ladle/react";
import { type ReactNode, useCallback, useRef, useState } from "react";
import { ConsoleTemplate } from "./index";

export default {
  title: "Templates / Console",
} satisfies StoryDefault;

export const Default = () => {
  const [injectMessage, setInjectMessage] = useState<
    | ((message: {
        role: "user" | "assistant" | "system";
        content: string | ReactNode;
      }) => void)
    | null
  >(null);
  const injectMessageRef = useRef<
    | ((message: {
        role: "user" | "assistant" | "system";
        content: string | ReactNode;
      }) => void)
    | null
  >(null);

  // Keep ref in sync with state
  injectMessageRef.current = injectMessage;

  const handleInjectUserMessage = useCallback(() => {
    injectMessage?.({
      role: "user",
      content: "Hello! This is a test message from the user.",
    });
  }, [injectMessage]);

  const handleInjectAssistantMessage = useCallback(() => {
    injectMessage?.({
      role: "assistant",
      content: "Hi there! This is a test response from the assistant.",
    });
  }, [injectMessage]);

  const handleInjectSystemMessage = useCallback(() => {
    injectMessage?.({
      role: "system",
      content: "This is a system message for testing purposes.",
    });
  }, [injectMessage]);

  const handleOnInjectMessage = useCallback(
    (
      injectFn: (message: {
        role: "user" | "assistant" | "system";
        content: string;
      }) => void,
    ) => {
      setInjectMessage(() => injectFn);
    },
    [],
  );

  const handleOnServerMessage = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any) => {
      setTimeout(() => {
        if (data.type === "links" && injectMessageRef.current) {
          const links = data.payload.map((link: string) => (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          ));
          injectMessageRef.current({
            role: "system",
            content: links,
          });
        }
      }, 3000);
    },
    [],
  );

  return (
    <FullScreenContainer>
      <div
        style={{
          padding: "10px",
          display: "flex",
          gap: "10px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <button
          onClick={handleInjectUserMessage}
          disabled={!injectMessage}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: injectMessage ? "pointer" : "not-allowed",
          }}
        >
          Inject User Message
        </button>
        <button
          onClick={handleInjectAssistantMessage}
          disabled={!injectMessage}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: injectMessage ? "pointer" : "not-allowed",
          }}
        >
          Inject Assistant Message
        </button>
        <button
          onClick={handleInjectSystemMessage}
          disabled={!injectMessage}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6f42c1",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: injectMessage ? "pointer" : "not-allowed",
          }}
        >
          Inject System Message
        </button>
        {!injectMessage && (
          <span
            style={{ color: "#666", fontSize: "14px", alignSelf: "center" }}
          >
            Waiting for conversation to be ready...
          </span>
        )}
      </div>
      <ConsoleTemplate
        transportType="smallwebrtc"
        connectParams={{
          connectionUrl: "http://localhost:7860/api/offer",
        }}
        noUserVideo={true}
        conversationElementProps={{
          assistantLabel: "my-assistant",
        }}
        onInjectMessage={handleOnInjectMessage}
        onServerMessage={handleOnServerMessage}
      />
    </FullScreenContainer>
  );
};
Default.meta = { iframed: false };
