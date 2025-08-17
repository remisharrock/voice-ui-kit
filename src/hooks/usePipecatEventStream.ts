import { RTVIEvent } from "@pipecat-ai/client-js";
import {
  usePipecatClient,
  usePipecatClientTransportState,
} from "@pipecat-ai/client-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface PipecatEventLog {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
}

export interface UsePipecatEventStreamOptions {
  maxEvents?: number;
  ignoreEvents?: string[];
  /** When true, also compute and return consecutive groups */
  groupConsecutive?: boolean;
  /** Optional grouping key selector; defaults to event.type */
  groupKey?: (event: PipecatEventLog) => string;
  /** When provided, only these events will be captured (takes precedence over ignoreEvents) */
  includeEvents?: string[];
  /** Pause capturing without tearing down subscriptions */
  paused?: boolean;
  /** Optional transform to sanitize/shape event data before storing */
  mapEventData?: (data: unknown, eventType: string) => unknown;
  /** Throttle notifications; 0 uses requestAnimationFrame, otherwise uses setTimeout(ms) */
  throttleMs?: number;
  /** Optional callback invoked for each captured event (after stored) */
  onEvent?: (event: PipecatEventLog) => void;
}

export interface PipecatEventGroup {
  id: string;
  type: string;
  events: ReadonlyArray<PipecatEventLog>;
}

/**
 * Subscribes to all RTVI events and returns a throttled, memoized list of recent events.
 * Designed to minimize re-renders when events are very frequent.
 */
export function usePipecatEventStream(options?: UsePipecatEventStreamOptions) {
  const client = usePipecatClient();
  const transportState = usePipecatClientTransportState();

  const maxEvents = options?.maxEvents ?? 500;
  const allEventNames = useMemo(() => {
    // Guard against numeric enum reverse mappings by filtering strings only
    return (
      Object.values(RTVIEvent).filter((v) => typeof v === "string") as string[]
    ).slice();
  }, []);
  const ignoredEventsSet = useMemo(() => {
    const defaults = new Set<string>([RTVIEvent.LocalAudioLevel]);
    if (!options?.ignoreEvents) return defaults;
    for (const e of options.ignoreEvents) defaults.add(e);
    return defaults;
  }, [options?.ignoreEvents]);
  const includedEventsSet = useMemo(() => {
    if (!options?.includeEvents || options.includeEvents.length === 0)
      return null as Set<string> | null;
    return new Set(options.includeEvents);
  }, [options?.includeEvents]);
  const pausedRef = useRef<boolean>(!!options?.paused);
  useEffect(() => {
    pausedRef.current = !!options?.paused;
  }, [options?.paused]);

  // Keep the actual event list in a ref to avoid forcing re-renders on every push
  const eventsRef = useRef<PipecatEventLog[]>([]);
  const versionRef = useRef(0);
  const [version, setVersion] = useState(0);
  const rafIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idCounterRef = useRef(0);
  const previousTransportState = useRef(transportState);

  const scheduleNotify = useCallback(() => {
    const throttle = options?.throttleMs ?? 0;
    if (throttle > 0) {
      if (timeoutIdRef.current != null) return;
      timeoutIdRef.current = setTimeout(() => {
        versionRef.current += 1;
        setVersion(versionRef.current);
        timeoutIdRef.current = null;
      }, throttle);
      return;
    }
    if (rafIdRef.current != null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      versionRef.current += 1;
      setVersion(versionRef.current);
      rafIdRef.current = null;
    });
  }, [options?.throttleMs]);

  const clearEvents = useCallback(() => {
    eventsRef.current = [];
    scheduleNotify();
  }, [scheduleNotify]);

  // Clear when a new connection is starting (disconnected -> initializing)
  useEffect(() => {
    if (
      previousTransportState.current === "disconnected" &&
      transportState === "initializing"
    ) {
      clearEvents();
    }
    previousTransportState.current = transportState;
  }, [transportState, clearEvents]);

  // Single event handler reused for all event names
  const handleRTVIEvent = useCallback(
    (eventType: string, data: any) => {
      if (pausedRef.current) return;
      if (includedEventsSet) {
        if (!includedEventsSet.has(eventType)) return;
      } else if (ignoredEventsSet.has(eventType)) {
        return;
      }

      idCounterRef.current += 1;
      const newEvent: PipecatEventLog = {
        id: `${Date.now()}-${idCounterRef.current}`,
        type: eventType,
        data: options?.mapEventData
          ? options.mapEventData(data, eventType)
          : data,
        timestamp: new Date(),
      };

      const next =
        eventsRef.current.length >= maxEvents
          ? [...eventsRef.current.slice(-maxEvents + 1), newEvent]
          : [...eventsRef.current, newEvent];
      // Freeze to preserve immutability guarantees without copying on read
      eventsRef.current = Object.freeze(next) as unknown as PipecatEventLog[];
      scheduleNotify();
      if (options?.onEvent) options.onEvent(newEvent);
    },
    [
      ignoredEventsSet,
      includedEventsSet,
      maxEvents,
      scheduleNotify,
      options?.mapEventData,
      options?.onEvent,
    ],
  );

  // Subscribe to all events in the RTVIEvent enum
  useEffect(() => {
    if (!client) return;

    const handlers: Record<string, (data: any) => void> = {};
    for (const eventName of allEventNames) {
      if (includedEventsSet && !includedEventsSet.has(eventName)) continue;
      if (!includedEventsSet && ignoredEventsSet.has(eventName)) continue;
      handlers[eventName] = (data: any) => handleRTVIEvent(eventName, data);
      try {
        client.on(eventName as any, handlers[eventName]);
      } catch {
        // Some events may not be supported; ignore
      }
    }

    return () => {
      for (const [eventName, handler] of Object.entries(handlers)) {
        try {
          client.off(eventName as any, handler);
        } catch {
          // ignore
        }
      }
    };
  }, [
    client,
    handleRTVIEvent,
    allEventNames,
    ignoredEventsSet,
    includedEventsSet,
  ]);

  // Expose a stable, memoized snapshot that only changes when version increments
  const events = useMemo(() => {
    // Return frozen snapshot reference to avoid allocations on read
    return eventsRef.current;
  }, [version]);

  const groups: ReadonlyArray<PipecatEventGroup> = useMemo(() => {
    if (!options?.groupConsecutive) return [];
    const keySelector = options.groupKey ?? ((e: PipecatEventLog) => e.type);
    const grouped: PipecatEventGroup[] = [] as PipecatEventGroup[];
    let current: {
      id: string;
      type: string;
      events: PipecatEventLog[];
    } | null = null;
    for (const e of events) {
      const key = keySelector(e);
      if (!current || current.type !== key) {
        current = { id: e.id, type: key, events: [e] };
        grouped.push({
          id: current.id,
          type: current.type,
          events: current.events,
        });
      } else {
        current.events.push(e);
      }
    }
    return grouped;
  }, [events, options?.groupConsecutive, options?.groupKey]);

  // Cleanup any scheduled rAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (timeoutIdRef.current != null) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, []);

  return {
    events: events as ReadonlyArray<PipecatEventLog>,
    groups,
    clear: clearEvents,
  } as const;
}
