import { create } from 'zustand';
import type { WebSocketMessage, SwingSeat, ECISnapshot } from '@elections/shared';

interface WSStore {
  connected: boolean;
  swingAlerts: SwingSeat[];
  latestSnapshots: Record<string, ECISnapshot>;
  connect: (url: string) => void;
  disconnect: () => void;
  clearAlerts: () => void;
}

let ws: WebSocket | null = null;
let pingInterval: ReturnType<typeof setInterval> | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let reconnectDelay = 2000;

function scheduleReconnect(url: string, store: WSStore) {
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  reconnectTimeout = setTimeout(() => {
    reconnectDelay = Math.min(reconnectDelay * 2, 30_000);
    store.connect(url);
  }, reconnectDelay);
}

export const useWSStore = create<WSStore>((set, get) => ({
  connected: false,
  swingAlerts: [],
  latestSnapshots: {},

  connect(url: string) {
    if (ws) ws.close();

    ws = new WebSocket(url);

    ws.onopen = () => {
      reconnectDelay = 2000;
      set({ connected: true });
      pingInterval = setInterval(() => ws?.send('ping'), 25_000);
    };

    ws.onclose = () => {
      set({ connected: false });
      if (pingInterval) clearInterval(pingInterval);
      scheduleReconnect(url, get());
    };

    ws.onerror = () => {
      ws?.close();
    };

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as WebSocketMessage;

        if (msg.type === 'snapshot_update') {
          set(state => ({
            latestSnapshots: {
              ...state.latestSnapshots,
              [msg.payload.constituencyId]: msg.payload,
            },
          }));
        }

        if (msg.type === 'swing_alert') {
          set(state => ({
            swingAlerts: [msg.payload, ...state.swingAlerts.slice(0, 49)],
          }));
        }
      } catch {
        // Ignore malformed messages
      }
    };
  },

  disconnect() {
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    if (pingInterval) clearInterval(pingInterval);
    ws?.close();
    ws = null;
    set({ connected: false });
  },

  clearAlerts() {
    set({ swingAlerts: [] });
  },
}));
