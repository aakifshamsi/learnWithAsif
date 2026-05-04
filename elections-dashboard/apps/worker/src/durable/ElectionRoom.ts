export class ElectionRoom {
  private sessions: Set<WebSocket> = new Set();
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Internal POST from scheduled ingest to broadcast a message
    if (url.pathname === '/notify' && request.method === 'POST') {
      const message = await request.json();
      this.broadcast(message);
      return new Response('OK');
    }

    // WebSocket upgrade from client
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 });
    }

    const { 0: client, 1: server } = new WebSocketPair();
    this.state.acceptWebSocket(server);
    this.sessions.add(server);

    server.addEventListener('close', () => this.sessions.delete(server));
    server.addEventListener('error', () => this.sessions.delete(server));

    server.send(JSON.stringify({ type: 'connected', sessionCount: this.sessions.size }));

    return new Response(null, { status: 101, webSocket: client });
  }

  private broadcast(message: unknown): void {
    const payload = JSON.stringify(message);
    const dead: WebSocket[] = [];
    for (const ws of this.sessions) {
      try {
        ws.send(payload);
      } catch {
        dead.push(ws);
      }
    }
    for (const ws of dead) this.sessions.delete(ws);
  }

  webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): void {
    if (message === 'ping') ws.send('pong');
  }

  webSocketClose(ws: WebSocket): void {
    this.sessions.delete(ws);
  }
}
