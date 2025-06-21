import { useRTVIClientTransportState } from "@pipecat-ai/client-react";
import { Fragment, useCallback, useEffect, useRef } from "react";
import useConversation from "@/hooks/useConversation";
import { cn } from "@/lib/utils";
import Thinking from "@/components/elements/Thinking";

export const Conversation: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottom = useRef(true);

  const transportState = useRTVIClientTransportState();

  const maybeScrollToBottom = useCallback(() => {
    if (!scrollRef.current) return;
    if (isScrolledToBottom.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Check scroll position before messages update
  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    isScrolledToBottom.current =
      Math.ceil(scrollRef.current.scrollHeight - scrollRef.current.scrollTop) <=
      Math.ceil(scrollRef.current.clientHeight);
  }, []);

  const { messages } = useConversation({
    onMessageAdded: () => {
      maybeScrollToBottom();
    },
  });

  useEffect(() => {
    // Scroll to bottom when messages change
    maybeScrollToBottom();
  }, [messages, maybeScrollToBottom]);

  // Update scroll state when user scrolls
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => updateScrollState();
    scrollElement.addEventListener("scroll", handleScroll);

    // Initial check
    updateScrollState();

    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [updateScrollState]);

  const isConnecting =
    transportState === "authenticating" || transportState === "connecting";
  const isConnected =
    transportState === "connected" || transportState === "ready";

  if (messages.length > 0) {
    return (
      <div ref={scrollRef} className="h-full overflow-y-auto p-4">
        <div className="grid grid-cols-[min-content_1fr] gap-x-4 gap-y-2">
          {messages.map((message, index) => (
            <Fragment key={index}>
              <div
                className={cn("font-semibold font-mono text-xs leading-6", {
                  "text-blue-500": message.role === "user",
                  "text-purple-500": message.role === "assistant",
                })}
              >
                {message.role}
              </div>
              <div className="flex flex-col gap-2">
                {message.content || <Thinking />}
                <div className="self-end text-xs text-gray-500 mb-1">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground text-sm">
          Connecting to agent...
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-4">
          <div className="text-muted-foreground mb-2">
            Not connected to agent
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Connect to an agent to see conversation messages in real-time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-muted-foreground text-sm">
        Waiting for messages...
      </div>
    </div>
  );
};
export default Conversation;
