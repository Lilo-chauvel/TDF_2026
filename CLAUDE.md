# CLAUDE.md This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a static web application for the Tour de France 2026 (TDF2026) that demonstrates client-side routing and data-driven page generation. The project serves as a practical implementation for a academic project, with a corresponding written thesis.

## Architecture Overview
The application follows a client-side routing architecture:
- **index.html**: Main entry point with navigation links
- **pages/etape.html**: Dynamic page template for individual stage pages
- **data/detail-etapes.json**: JSON data source containing stage information
- **js/script-etape.js**: JavaScript that handles client-side routing and page population
- **css/styles.css**: Styles for both index and stage pages

The routing works by:
1. User clicks a link to `pages/etape.html?id=N` (where N is the stage number)
2. JavaScript in script-etape.js reads the URL parameter
3. JavaScript fetches the corresponding stage data from detail-etapes.json
4. The page content is dynamically populated with the stage information

## Development Workflow

### Running the Application
```bash
# Serve the application locally
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

### Testing
The project includes a shell script for testing the website functionality:
```bash
# Run the test suite
bash tests/test-site.sh
```

### Data Management
The stage data is fetched from an external API using a Python script:
```bash
# Fetch updated stage data
python3 scripts/fetch_etapes_json.py
```
This script uses the API key stored in `.env` (KEY_API_TAVILY).

### Code Quality
The project follows these conventions:
- CSS paths are standardized to `/css/styles.css` (not `/styles.css`)
- Stage pages are organized in the `/pages` directory
- All links to stage pages use the format `pages/etape.html?id=N`
- JavaScript files are in the `/js` directory
- JSON data files are in the `/data` directory

## Build and Deployment
This is a static site with no build process required. Simply serve the files directly. For deployment, upload the entire directory structure to any static hosting service.

## Key Files and Directories
- `index.html`: Main entry point with navigation
- `pages/etape.html`: Template for stage pages
- `js/script-etape.js`: Client-side routing logic
- `data/detail-etapes.json`: Stage data source
- `css/styles.css`: Shared styling
- `scripts/fetch_etapes_json.py`: Data fetching script
- `tests/test-site.sh`: Automated testing script
- `.env`: Environment variables (API key)

## Important Notes
- The project uses client-side routing with no server-side components
- All data is loaded dynamically from JSON, making it easy to update stage information
- The API key in `.env` should not be committed to version control in production
- The project is designed to be simple and educational, focusing on client-side JavaScript and static file servin
- You committed each change with an explicit message
- Never read .env
- If necessary, after adding code or refactoring, update the README