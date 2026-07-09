#!/usr/bin/env bash
set -euo pipefail

npm run build
npx gh-pages -d build -b gh-pages -m "Deploy Docusaurus site"
