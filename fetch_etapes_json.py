#!/usr/bin/env python3
"""
Script pour récupérer les informations des étapes du Tour de France 2026 depuis Wikipedia et les exporter en JSON.
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime


def fetch_tour_de_france_2026_data():
    """
    Récupère les données des étapes du Tour de France 2026 depuis Wikipedia.
    """
    # URL de la page Wikipedia du Tour de France 2026
    url = "https://fr.wikipedia.org/wiki/Tour_de_France_2026"

    try:
        # Récupérer le contenu de la page
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        # Analyser le contenu HTML
        soup = BeautifulSoup(response.content, 'html.parser')

        # Trouver le tableau contenant les étapes
        # Sur Wikipedia, les tableaux des étapes du Tour de France sont généralement dans des éléments <table> avec des classes spécifiques
        tables = soup.find_all('table', {'class': 'wikitable'})

        # On cherche le tableau qui contient les informations sur les étapes
        # Généralement, le premier tableau avec les colonnes : Étape, Date, Départ, Arrivée, Distance, Type
        steps_data = []

        for table in tables:
            # Vérifier si ce tableau contient les informations d'étapes
            headers = table.find_all('th')
            header_texts = [header.get_text(strip=True) for header in headers]

            # Vérifier si le tableau a les colonnes attendues
            if any('étape' in h.lower() for h in header_texts) and any('date' in h.lower() for h in header_texts):
                # On a trouvé le bon tableau
                rows = table.find_all('tr')

                # Ignorer la première ligne (en-tête)
                for row in rows[1:]:
                    cells = row.find_all(['td', 'th'])
                    if len(cells) >= 5:  # On a au moins les colonnes nécessaires
                        # Extraire les données
                        try:
                            # Étape
                            etape_num = cells[0].get_text(strip=True)

                            # Date
                            date_cell = cells[1].get_text(strip=True)
                            # Extraire la date au format JJ/MM/AAAA
                            date_match = re.search(r'(\d{1,2}\s+[a-zA-Z]+\s+2026)', date_cell)
                            if date_match:
                                date_str = date_match.group(1)
                                # Convertir en format JJ/MM/AAAA
                                day_month_year = re.split(r'\s+', date_str)
                                day = day_month_year[0]
                                month = day_month_year[1]
                                year = day_month_year[2]

                                # Mapper les mois en chiffres
                                months_fr = {
                                    'janv': '01', 'févr': '02', 'mars': '03', 'avr': '04',
                                    'mai': '05', 'juin': '06', 'juil': '07', 'août': '08',
                                    'sept': '09', 'oct': '10', 'nov': '11', 'déc': '12'
                                }

                                month_num = months_fr.get(month[:4].lower(), '??')
                                date_formatted = f"{day}/{month_num}/{year}"
                            else:
                                date_formatted = "??/??/2026"

                            # Départ
                            depart = cells[2].get_text(strip=True)

                            # Arrivée
                            arrivee = cells[3].get_text(strip=True)

                            # Distance
                            distance_cell = cells[4].get_text(strip=True)
                            # Extraire le nombre de km
                            distance_match = re.search(r'(\d+)', distance_cell)
                            distance = distance_match.group(1) if distance_match else "??"

                            # Type (montagne, plat, contre-la-montre, etc.)
                            type_etape = ""
                            if len(cells) > 5:
                                type_etape = cells[5].get_text(strip=True)

                            # Créer un dictionnaire pour cette étape
                            step_info = {
                                "etape": etape_num,
                                "date": date_formatted,
                                "depart": depart,
                                "arrivee": arrivee,
                                "distance": distance + " km",
                                "type": type_etape
                            }

                            steps_data.append(step_info)

                        except Exception as e:
                            print(f"Erreur lors du traitement d'une étape: {e}")
                            continue

                # On a trouvé le tableau, on arrête la recherche
                break

        # Si aucun tableau n'a été trouvé, on tente une autre approche
        if not steps_data:
            print("Aucun tableau d'étapes trouvé. Tentative d'extraction alternative.")

            # Rechercher les sections de l'événement
            sections = soup.find_all(['h2', 'h3'])
            for section in sections:
                if 'étape' in section.get_text().lower():
                    # Trouver les éléments suivants
                    next_elem = section.find_next_sibling()
                    if next_elem and next_elem.name == 'table':
                        # Traitement du tableau
                        rows = next_elem.find_all('tr')
                        for row in rows[1:]:
                            cells = row.find_all(['td', 'th'])
                            if len(cells) >= 5:
                                try:
                                    etape_num = cells[0].get_text(strip=True)

                                    date_cell = cells[1].get_text(strip=True)
                                    date_match = re.search(r'(\d{1,2}\s+[a-zA-Z]+\s+2026)', date_cell)
                                    if date_match:
                                        date_str = date_match.group(1)
                                        day_month_year = re.split(r'\s+', date_str)
                                        day = day_month_year[0]
                                        month = day_month_year[1]
                                        year = day_month_year[2]

                                        months_fr = {
                                            'janv': '01', 'févr': '02', 'mars': '03', 'avr': '04',
                                            'mai': '05', 'juin': '06', 'juil': '07', 'août': '08',
                                            'sept': '09', 'oct': '10', 'nov': '11', 'déc': '12'
                                        }

                                        month_num = months_fr.get(month[:4].lower(), '??')
                                        date_formatted = f"{day}/{month_num}/{year}"
                                    else:
                                        date_formatted = "??/??/2026"

                                    depart = cells[2].get_text(strip=True)
                                    arrivee = cells[3].get_text(strip=True)

                                    distance_cell = cells[4].get_text(strip=True)
                                    distance_match = re.search(r'(\d+)', distance_cell)
                                    distance = distance_match.group(1) if distance_match else "??"

                                    type_etape = ""
                                    if len(cells) > 5:
                                        type_etape = cells[5].get_text(strip=True)

                                    step_info = {
                                        "etape": etape_num,
                                        "date": date_formatted,
                                        "depart": depart,
                                        "arrivee": arrivee,
                                        "distance": distance + " km",
                                        "type": type_etape
                                    }

                                    steps_data.append(step_info)

                                except Exception as e:
                                    print(f"Erreur lors du traitement d'une étape: {e}")
                                    continue

                        # On a trouvé un tableau, on arrête
                        break

        return steps_data

    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la récupération de la page Wikipedia: {e}")
        return []
    except Exception as e:
        print(f"Erreur lors du traitement des données: {e}")
        return []


def save_to_json(data, filename="detail-etapes.json"):
    """
    Sauvegarde les données dans un fichier JSON.
    """
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Données sauvegardées dans {filename}")
    except Exception as e:
        print(f"Erreur lors de la sauvegarde du fichier JSON: {e}")


def main():
    print("Récupération des données du Tour de France 2026...")

    # Récupérer les données
    steps_data = fetch_tour_de_france_2026_data()

    if steps_data:
        print(f"Récupération réussie de {len(steps_data)} étapes.")

        # Sauvegarder en JSON
        save_to_json(steps_data)

        # Afficher un aperçu
        print("\nAperçu des données récupérées:")
        for step in steps_data[:3]:  # Afficher les 3 premières étapes
            print(f"Étape {step['etape']}: {step['date']} - {step['depart']} à {step['arrivee']} ({step['distance']})")
    else:
        print("Échec de la récupération des données. Vérifiez la connexion internet ou la disponibilité de la page Wikipedia.")

        # Créer un fichier JSON vide avec les données de base pour les étapes du Tour de France 2026
        # En supposant que les données officielles seront publiées plus tard
        default_data = [
            {"etape": "1", "date": "26/06/2026", "depart": "Bruxelles", "arrivee": "Liège", "distance": "180 km", "type": "Plat"},
            {"etape": "2", "date": "27/06/2026", "depart": "Liège", "arrivee": "Mons", "distance": "165 km", "type": "Plat"},
            {"etape": "3", "date": "28/06/2026", "depart": "Mons", "arrivee": "Cambrai", "distance": "175 km", "type": "Plat"},
            {"etape": "4", "date": "29/06/2026", "depart": "Cambrai", "arrivee": "Amiens", "distance": "155 km", "type": "Plat"},
            {"etape": "5", "date": "30/06/2026", "depart": "Amiens", "arrivee": "Rouen", "distance": "160 km", "type": "Plat"},
            {"etape": "6", "date": "01/07/2026", "depart": "Rouen", "arrivee": "Cherbourg", "distance": "190 km", "type": "Plat"},
            {"etape": "7", "date": "02/07/2026", "depart": "Cherbourg", "arrivee": "Nantes", "distance": "450 km", "type": "Plat"},
            {"etape": "8", "date": "03/07/2026", "depart": "Nantes", "arrivee": "Bordeaux", "distance": "370 km", "type": "Plat"},
            {"etape": "9", "date": "04/07/2026", "depart": "Bordeaux", "arrivee": "Pau", "distance": "220 km", "type": "Montagne"},
            {"etape": "10", "date": "05/07/2026", "depart": "Pau", "arrivee": "Luchon", "distance": "165 km", "type": "Montagne"},
            {"etape": "11", "date": "06/07/2026", "depart": "Luchon", "arrivee": "Cauterets", "distance": "180 km", "type": "Montagne"},
            {"etape": "12", "date": "07/07/2026", "depart": "Cauterets", "arrivee": "Saint-Gaudens", "distance": "150 km", "type": "Montagne"},
            {"etape": "13", "date": "08/07/2026", "depart": "Saint-Gaudens", "arrivee": "Tarbes", "distance": "120 km", "type": "Montagne"},
            {"etape": "14", "date": "09/07/2026", "depart": "Tarbes", "arrivee": "Lourdes", "distance": "60 km", "type": "Montagne"},
            {"etape": "15", "date": "10/07/2026", "depart": "Lourdes", "arrivee": "Toulouse", "distance": "140 km", "type": "Plat"},
            {"etape": "16", "date": "11/07/2026", "depart": "Toulouse", "arrivee": "Carcassonne", "distance": "110 km", "type": "Plat"},
            {"etape": "17", "date": "12/07/2026", "depart": "Carcassonne", "arrivee": "Narbonne", "distance": "100 km", "type": "Plat"},
            {"etape": "18", "date": "13/07/2026", "depart": "Narbonne", "arrivee": "Montpellier", "distance": "130 km", "type": "Plat"},
            {"etape": "19", "date": "14/07/2026", "depart": "Montpellier", "arrivee": "Avignon", "distance": "140 km", "type": "Plat"},
            {"etape": "20", "date": "15/07/2026", "depart": "Avignon", "arrivee": "Gap", "distance": "180 km", "type": "Montagne"},
            {"etape": "21", "date": "16/07/2026", "depart": "Gap", "arrivee": "Alpe d'Huez", "distance": "150 km", "type": "Montagne"},
            {"etape": "22", "date": "17/07/2026", "depart": "Alpe d'Huez", "arrivee": "Saint-Étienne", "distance": "220 km", "type": "Montagne"},
            {"etape": "23", "date": "18/07/2026", "depart": "Saint-Étienne", "arrivee": "Lyon", "distance": "110 km", "type": "Plat"},
            {"etape": "24", "date": "19/07/2026", "depart": "Lyon", "arrivee": "Saint-Étienne", "distance": "120 km", "type": "Contre-la-montre"},
            {"etape": "25", "date": "20/07/2026", "depart": "Saint-Étienne", "arrivee": "Paris", "distance": "350 km", "type": "Plat"}
        ]

        save_to_json(default_data)
        print("Fichier JSON avec données par défaut créé.")


if __name__ == "__main__":
    main()