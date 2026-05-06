#!/usr/bin/env bash
# Pull all Ollama models for Jarvis Core
# Run after bootstrap.sh and on first boot
# Usage: ./scripts/pull-models.sh [--all]

set -euo pipefail

ALL="${1:-}"

echo "Pulling base models..."
ollama pull llama3:8b
ollama pull nomic-embed-text
ollama pull mistral:7b
echo "Base models ready."

if [ "$ALL" = "--all" ]; then
  echo "Pulling extended models (slow, needs good Wi-Fi)..."
  ollama pull llama3:70b          # 40 GB — fits in 128 GB RAM
  ollama pull llava:13b           # 8 GB — vision (look at images/screenshots)
  ollama pull deepseek-coder:6.7b # 3.8 GB — code
  ollama pull phi3:mini           # 2.3 GB — ultra-fast for simple tasks
  echo "All models ready."
else
  echo ""
  echo "Extended models not pulled. Run with --all to pull:"
  echo "  llama3:70b (40 GB)  — deep reasoning"
  echo "  llava:13b  (8 GB)   — vision"
  echo "  deepseek-coder:6.7b — code"
fi

echo ""
echo "Installed models:"
ollama list
