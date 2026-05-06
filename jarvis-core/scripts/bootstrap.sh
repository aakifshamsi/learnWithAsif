#!/usr/bin/env bash
# Jarvis Core — Day-1 bootstrap for Tuxedo InfinityBook 16 (Ubuntu/Tuxedo OS host)
# Run as regular user (will sudo when needed)
# Usage: ./scripts/bootstrap.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
LOG="${HOME}/jarvis-bootstrap.log"

log() { echo "[$(date +%H:%M:%S)] $*" | tee -a "$LOG"; }
section() { echo; log "════════════════════════════════════════"; log "  $*"; log "════════════════════════════════════════"; }

section "Jarvis Core bootstrap starting"
log "Logging to: $LOG"
log "Repo root:  $REPO_ROOT"

# ── 1. System update ────────────────────────────────────────────────────────
section "System update"
sudo apt-get update -qq
sudo apt-get upgrade -y -qq
sudo apt-get install -y -qq \
  curl wget git jq unzip rsync htop tmux \
  build-essential ca-certificates gnupg \
  lsb-release apt-transport-https \
  net-tools ufw fail2ban

# ── 2. Docker ───────────────────────────────────────────────────────────────
section "Docker"
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sudo bash
  sudo usermod -aG docker "$USER"
  log "Docker installed. NOTE: log out and back in for docker group to take effect."
else
  log "Docker already installed: $(docker --version)"
fi

# Docker Compose plugin
if ! docker compose version &>/dev/null 2>&1; then
  sudo apt-get install -y docker-compose-plugin
fi

# ── 3. Ollama (local LLM runner — native, GPU direct) ───────────────────────
section "Ollama"
if ! command -v ollama &>/dev/null; then
  curl -fsSL https://ollama.ai/install.sh | sh
  log "Ollama installed: $(ollama --version)"
else
  log "Ollama already installed: $(ollama --version)"
fi

# Start Ollama service
sudo systemctl enable --now ollama 2>/dev/null || true
log "Ollama service: $(sudo systemctl is-active ollama 2>/dev/null || echo 'check manually')"

# ── 4. Pull base models ─────────────────────────────────────────────────────
section "Pulling Ollama models (this takes time on first run)"
log "Pulling llama3:8b (fast assistant)..."
ollama pull llama3:8b

log "Pulling nomic-embed-text (embeddings)..."
ollama pull nomic-embed-text

log "Pulling mistral:7b (fast instruction)..."
ollama pull mistral:7b

log "Large models (70b, llava, deepseek) — pull separately:"
log "  ollama pull llama3:70b      # 40 GB"
log "  ollama pull llava:13b       # 8 GB (vision)"
log "  ollama pull deepseek-coder:6.7b"

# ── 5. KVM/QEMU (hypervisor) ────────────────────────────────────────────────
section "KVM / QEMU"
sudo apt-get install -y -qq \
  qemu-kvm libvirt-daemon-system libvirt-clients \
  bridge-utils virt-manager virtinst
sudo usermod -aG libvirt "$USER"
sudo usermod -aG kvm "$USER"
sudo systemctl enable --now libvirtd
log "KVM installed. Verify: kvm-ok"
kvm-ok 2>&1 | tee -a "$LOG" || true

# ── 6. cloudflared (Cloudflare Tunnel) ──────────────────────────────────────
section "Cloudflare Tunnel (cloudflared)"
if ! command -v cloudflared &>/dev/null; then
  ARCH=$(dpkg --print-architecture)
  curl -fsSL "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${ARCH}.deb" \
    -o /tmp/cloudflared.deb
  sudo dpkg -i /tmp/cloudflared.deb
  rm /tmp/cloudflared.deb
  log "cloudflared installed: $(cloudflared --version)"
else
  log "cloudflared already installed: $(cloudflared --version)"
fi

# ── 7. Node.js (LTS) ────────────────────────────────────────────────────────
section "Node.js LTS (via nvm)"
if ! command -v node &>/dev/null; then
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  # shellcheck source=/dev/null
  source "$NVM_DIR/nvm.sh"
  nvm install --lts
  nvm use --lts
  log "Node: $(node --version)"
else
  log "Node already installed: $(node --version)"
fi

# ── 8. pnpm ─────────────────────────────────────────────────────────────────
if ! command -v pnpm &>/dev/null; then
  npm install -g pnpm@9
  log "pnpm: $(pnpm --version)"
fi

# ── 9. Deploy the Jarvis Docker stack ───────────────────────────────────────
section "Starting Jarvis Docker stack"
cd "${REPO_ROOT}/compose"

if [ ! -f .env ]; then
  cp .env.example .env
  log "Created compose/.env — EDIT THIS FILE with your values before continuing!"
  log "Then re-run: cd ${REPO_ROOT}/compose && docker compose up -d"
else
  docker compose up -d
  log "Docker stack started."
fi

# ── 10. Firewall ────────────────────────────────────────────────────────────
section "Firewall (UFW)"
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp   # HTTP (nginx proxy manager)
sudo ufw allow 443/tcp  # HTTPS
# Internal ports (only reachable from LAN — not exposed publicly)
# Open WebUI, Portainer, Qdrant, etc. are accessed via reverse proxy
sudo ufw --force enable
log "UFW status:"
sudo ufw status | tee -a "$LOG"

# ── Done ────────────────────────────────────────────────────────────────────
section "Bootstrap complete"
log ""
log "Next steps:"
log "  1. REBOOT (for docker/kvm group changes to take effect)"
log "  2. Edit jarvis-core/compose/.env with your domain and passwords"
log "  3. Run: cd jarvis-core/compose && docker compose up -d"
log "  4. Authenticate Cloudflare Tunnel: cloudflared tunnel login"
log "  5. Pull large models: ollama pull llama3:70b"
log "  6. Open WebUI: http://localhost:3000"
log "  7. Portainer: http://localhost:9000"
log ""
log "Full guide: jarvis-core/README.md"
log "Log saved:  $LOG"
