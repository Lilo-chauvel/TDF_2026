#!/usr/bin/env bash

set -euo pipefail

BASE_URL="https://www.letour.fr/fr"
OUT_DIR="$HOME/detail-etapes"

mkdir -p "$OUT_DIR"

for i in $(seq 1 21); do
  url="$BASE_URL/etape-$i"
  out="/home/chauvel/Documents/dev/Titre_pro_CCP1/TDF2026/detail-etapes/etape-$i.html"

  echo "Téléchargement de $url vers $out"
  curl -sL "$url" -o "$out"
  ls -lh "$out"
done 
