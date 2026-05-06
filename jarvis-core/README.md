# Jarvis Core — Home AI Infrastructure

Personal sovereign AI stack for the Tuxedo InfinityBook 16 (AMD Ryzen AI 9, 128 GB RAM).

---

## Before the laptop arrives — do this now (from any browser)

These steps require zero hardware. Do them now so day-1 is clean.

### 1. DNS records (Cloudflare dashboard → your domain)

| Type | Name | Target | Proxy |
|---|---|---|---|
| CNAME | `aakif.sham.si` | `aakif-portfolio.pages.dev` | ✅ Proxied |
| CNAME | `sham.si` | `shamsi-root.pages.dev` | ✅ Proxied |
| A | `jarvis.sham.si` | `<your home IP>` | ❌ DNS only |
| A | `cloud.sham.si` | `<your home IP>` | ❌ DNS only |
| A | `git.sham.si` | `<your home IP>` | ❌ DNS only |
| A | `ai.sham.si` | `<your home IP>` | ❌ DNS only |

> Get your home IP: visit `https://icanhazip.com` from home Wi-Fi.
> Set these up after the laptop is running and port-forwarded.

### 2. Create CF Pages projects (one-click in CF dashboard)

| Project name | Domain |
|---|---|
| `aakif-portfolio` | `aakif.sham.si` |
| `shamsi-root` | `sham.si` |

### 3. Generate SSH key pair (from any Linux device or Termux on Android)

```bash
ssh-keygen -t ed25519 -C "aakif@sham.si" -f ~/.ssh/shamsi_ed25519
# Add public key to GitHub → Settings → SSH keys
cat ~/.ssh/shamsi_ed25519.pub
```

### 4. Download Ubuntu Server 24.04 LTS ISO (when on Wi-Fi)

URL: `https://releases.ubuntu.com/24.04/ubuntu-24.04.1-live-server-amd64.iso`

Flash to USB with balenaEtcher (Android) or Ventoy (USB multi-boot).
- Tuxedo ships with Tuxedo OS (Ubuntu-based) — you can keep it or install Ubuntu Server for the cloud stack
- **Recommended:** Keep Tuxedo OS as desktop, install the Jarvis stack in a KVM VM

### 5. Order / confirm these are available

- [ ] USB-C hub with Ethernet port (for initial server setup)
- [ ] External USB drive 1TB+ (for R2/RSync cold backup)
- [ ] Static home IP from ISP (or use Cloudflare Tunnel — see below)

---

## Day-1 Install (run on Tuxedo after Tuxedo OS boots)

```bash
# Clone this repo first
git clone https://github.com/aakifshamsi/learnWithAsif ~/learnWithAsif
cd ~/learnWithAsif/jarvis-core

# Run the bootstrap script
chmod +x scripts/bootstrap.sh
./scripts/bootstrap.sh
```

See `scripts/bootstrap.sh` for what it installs.

---

## Stack Overview

```
Tuxedo InfinityBook 16
├── Tuxedo OS (host desktop)
│   ├── KVM/QEMU hypervisor
│   ├── Ollama (direct GPU/NPU access via ROCm)
│   └── Cloudflare Tunnel (cloudflared)
│
├── VM: jarvis-server (Ubuntu Server 24.04)
│   ├── Docker Compose stack
│   │   ├── Open WebUI          → ai.sham.si
│   │   ├── Nextcloud           → cloud.sham.si
│   │   ├── Gitea               → git.sham.si
│   │   ├── Nginx Proxy Manager → :81 (internal)
│   │   ├── Portainer           → :9000 (internal)
│   │   ├── Qdrant (vector DB)  → :6333 (internal)
│   │   ├── Uptime Kuma         → status.sham.si
│   │   └── Whisper API server  → :9090 (internal)
│   └── Piper TTS               → :9091 (internal)
│
└── Ollama models (on host, GPU direct)
    ├── llama3:8b              (fast, general)
    ├── llama3:70b             (deep reasoning, 128GB fits it)
    ├── mistral:7b             (fast instruction following)
    ├── nomic-embed-text       (embeddings for Qdrant)
    ├── whisper.cpp            (STT — voice input)
    └── kokoro / piper         (TTS — voice output)
```

---

## Voice AI ("Primary Claw") — Best Open-Source Options 2025

| Component | Winner | Why |
|---|---|---|
| LLM runner | **Ollama** | Easiest, best model library, AMD ROCm support |
| LLM frontend | **Open WebUI** | Full-featured, voice mode, RAG, tools |
| Speech-to-text | **Whisper.cpp** | Fastest on CPU+GPU, streaming support |
| Text-to-speech | **Kokoro TTS** | Best quality, MIT license, runs locally |
| Voice pipeline | **Open WebUI voice mode** | STT→LLM→TTS in one UI |
| Memory layer | **Qdrant + mem0** | Vector search + structured memory |
| Phone integration | **Linphone / SIPml5** | SIP softphone → VoIP call bot |
| Context engine | **Qdrant** | Semantic search over all past conversations |

### Voice call support (Jarvis answers calls)

Use **Asterisk PBX** in Docker + SIPml5 WebRTC:
- Register a SIP number (VoIP.ms, Twilio SIP, or self-hosted)
- Asterisk routes inbound call → Python bridge → Whisper (STT) → Ollama → TTS → back to caller
- Works as a phone AI assistant for invited family/friends

---

## Context Sharing Engine (Memory)

Every conversation Jarvis has gets indexed:

```
User message → Whisper (STT) → Ollama (LLM)
                                    ↓
                             mem0 (structured memory extraction)
                                    ↓
                             Qdrant (vector index)
                                    ↓
                             next conversation: semantic search → context injected
```

This means Jarvis remembers: your preferences, past projects, family names, ongoing tasks — across restarts, across models.

---

## RSync / Unified Storage Concept

```
sham.si cloud storage = Nextcloud + rclone remotes

Local:      ~/shamsi-cloud/          (primary, on Tuxedo SSD)
Remote 1:   Backblaze B2             (cold backup, cheap)
Remote 2:   Cloudflare R2            (hot cache, free 10GB)
Remote 3:   User's own Google Drive  (optional — liberate their storage)

Sync:       rclone bisync (bidirectional, conflict resolution)
Schedule:   systemd timer every 30 min
```

Users connecting to `cloud.sham.si` (your Nextcloud) can optionally add their Google/Yandex accounts as external storage — Nextcloud shows it all unified under one folder tree. Their storage stays theirs; you provide the interface and AI layer.

---

## Cloudflare Tunnel (no port forwarding needed)

If your ISP blocks inbound ports or gives dynamic IP, use Cloudflare Tunnel:

```bash
# Install cloudflared on Tuxedo
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb

# Authenticate (opens browser)
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create jarvis-home

# Configure (see scripts/cloudflared-config.yml)
# Run as systemd service
cloudflared service install
```

This gives you `ai.sham.si`, `cloud.sham.si`, `git.sham.si` — all HTTPS, no port forwarding, no static IP required.

---

## Model Download Queue (run on Tuxedo day-1, takes 30–60 min on fast Wi-Fi)

```bash
# After Ollama is installed
ollama pull llama3:8b            # 4.7 GB — general assistant
ollama pull llama3:70b           # 40 GB — deep reasoning (you have 128GB!)
ollama pull mistral:7b           # 4.1 GB — fast instruction following
ollama pull nomic-embed-text     # 274 MB — embeddings
ollama pull llava:13b            # 8 GB  — vision (look at images)
ollama pull deepseek-coder:6.7b  # 3.8 GB — code assistant
```

---

## What Jarvis Can Do (target feature set)

- [x] Chat via browser (Open WebUI)
- [x] Voice chat (Whisper STT + TTS)
- [x] Remember past conversations (Qdrant + mem0)
- [x] Browse files (Nextcloud integration)
- [x] Write and run code (Open Interpreter in Docker)
- [ ] Answer voice calls (Asterisk PBX + SIP bridge)
- [ ] Send WhatsApp messages (whatsapp-web.js VM)
- [ ] Help family build websites (agentic tool use)
- [ ] Summarize documents and emails
- [ ] Manage calendar and tasks (Nextcloud CalDAV)

---

## WhatsApp Bot ("Shamsi Bot") — Dedicated VM plan

```
VM: shamsi-bot (Ubuntu 22.04, 4 vCPU, 8 GB RAM)
Stack:
  - whatsapp-web.js (Node.js, Puppeteer)
  - Express API bridge
  - → Ollama (on host) via http://host-ip:11434
  - → Qdrant (for per-contact memory)

Flow:
  Invited contact sends WhatsApp message
    → whatsapp-web.js receives
    → Express bridge calls Ollama
    → Ollama generates response (with contact memory from Qdrant)
    → whatsapp-web.js sends reply

Capabilities per contact (configurable):
  - Build a simple website (HTML/CSS generated, pushed to CF Pages)
  - Create marketing copy
  - Answer questions
  - Book calendar slots (via CalDAV)
```

> Note: whatsapp-web.js uses WhatsApp Web protocol — keep one phone number logged in on the VM. Use a dedicated SIM/number for the bot.
