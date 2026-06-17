#!/usr/bin/env python3
"""
Script pour récupérer les données de toutes les étapes du Tour de France 2026
et les enregistrer en JSON dans /home/chauvel/Documents/dev/Titre_pro_CCP1/TDF2026/detail-etapes/
"""

import json
import os
import re
import urllib.request
import urllib.error

BASE_URL = "https://www.letour.fr/fr"
OUT_DIR = "/home/chauvel/Documents/dev/Titre_pro_CCP1/TDF2026/detail-etapes"

# Créer le dossier s'il n'existe pas
os.makedirs(OUT_DIR, exist_ok=True)

def fetch_html(url):
    """Renvoie le contenu HTML d'une URL"""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.read().decode("utf-8")
    except urllib.error.URLError as e:
        print(f"Erreur pour {url}: {e}")
        return None

def parse_etape(html):
    """Parse le HTML d'une étape et retourne un dictionnaire des données"""
    if not html:
        return None
    
    data = {}
    
    # Titre de l'h1 (format: "É¡ape N - Départ > Arrivée")
    h1_match = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.DOTALL)
    if h1_match:
        h1_text = h1_match.group(1).strip()
        h1_text = re.sub(r"<[^>]+>", "", h1_text).strip()
        data["titre_h1"] = h1_text
        
        # Extraire départ et arrivée
        partes_arr = re.search(r"É¡ape\s*(\d+)\s*-\s*(.*?)\s*>\s*(.*?)$", h1_text)
        if partes_arr:
            data["etape"] = int(partes_arr.group(1))
            data["depart"] = partes_arr.group(2).strip()
            data["arrivee"] = partes_arr.group(3).strip()
    
    # Date (format: 04/07/2026 ou 04/07)
    date_match = re.search(r"(\d{2}/\d{2}/\d{4}|\d{2}/\d{2})", html)
    if date_match:
        data["date"] = date_match.group(1)
    
    # Longueur (format: 19.6 km)
    long_match = re.search(r"Longueur[:\s]*(\d+\.?\d*)\s*km", html, re.IGNORECASE)
    if long_match:
        data["longueur_km"] = float(long_match.group(1))
    
    # Type d'Ã©tape
    type_match = re.search(r"Type[:\s]*([^<]+)", html, re.IGNORECASE)
    if type_match:
        data["type"] = type_match.group(1).strip()
    
    # D+ (dÃ©nivelÃ© positif)
    dplus_match = re.search(r"D\+[:\s]*(\d+)\s*m", html, re.IGNORECASE)
    if dplus_match:
        data["denivele_positif_m"] = int(dplus_match.group(1))
    
    # Horaires
    depart_match = re.search(r"Premier\s*dÃ©part[:\s]*(\d{2}:\d{2})", html, re.IGNORECASE)
    if depart_match:
        data["premier_depart"] = depart_match.group(1)
    
    arrivee_match = re.search(r"DerniÃ©re\s*arrivÃ©e[:\s]*(\d{2}:\d{2})", html, re.IGNORECASE)
    if arrivee_match:
        data["derniere_arrivee"] = arrivee_match.group(1)
    
    # Profil
    profil_match = re.search(r"Profil[:\s]*([^<]+)", html, re.IGNORECASE)
    if profil_match:
        data["profil"] = profil_match.group(1).strip()
    
    return data

def main():
    print(f"Dossier de sortie: {OUT_DIR}")
    print("-" * 50)
    
    for i in range(1, 22):  # 1 ÃÂ© 21
        url = f"{BASE_URL}/etape-{i}"
        out_file = os.path.join(OUT_DIR, f"etape-{i}.json")
        
        print(f"Ã¡tape {i}: {url}")
        
        html = fetch_html(url)
        data = parse_etape(html)
        
        if data:
            with open(out_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"  OK -> {out_file}")
        else:
            print(f"  ERROR: Impossible de parser l'Ã¡tape {i}")
    
    print("-" * 50)
    print("TerminÃ©!")

if __name__ == "__main__":
    main()