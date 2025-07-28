# 🧪 Data Alchemist

An intelligent data scheduling and visualization tool that empowers users to upload, validate, edit, and apply rules to structured datasets (clients, tasks, workers). Includes AI-powered rule suggestions and error handling.

## 🚀 Live Demo

👉 [https://data-alchemist-ashen.vercel.app](https://data-alchemist-ashen.vercel.app)

## 📁 Project Structure

├── public/samples/ # Sample CSV data: clients.csv, workers.csv, tasks.csv
├── src/
│ ├── components/ # UI components including FileUploadGrid, RuleBuilder, etc.
│ ├── lib/ # Parsers, schema validators, rule definitions
│ ├── app/api/ # API routes including OpenAI-based rule suggestion

markdown
Copy
Edit

## ✅ Features

- 📄 Upload CSV/XLSX data (clients, workers, tasks)
- 🧹 Normalize + validate data using Zod
- 🧠 Rule Builder UI with validation per rule type
- 💾 LocalStorage persistence + export to JSON
- 🤖 AI rule suggestions using OpenAI
- 📊 Editable data grid with inline edits
- 🔁 Reset to defaults with sample data preload

## 🧠 AI Capabilities (via OpenAI API)

- Suggest scheduling rules based on uploaded data
- Future-ready for:
  - Natural language to rules
  - Error correction
  - AI validators & recommendations

> ⚠️ Requires an `OPENAI_API_KEY` to enable AI suggestions.

## 🛠️ Setup

```bash
# Clone and install dependencies
git clone https://github.com/SHASWATprakash/DataAlchemist
cd DataAlchemist
npm install

# Run locally
npm run dev
🌍 Environment Variables
Create a .env.local:

env
Copy
Edit
OPENAI_API_KEY=your-key-here
🧪 Sample Data
Add sample files under /public/samples/:

clients.csv

workers.csv

tasks.csv

These auto-load on first mount.

📤 Deployment
This app is auto-deployed via Vercel:

https://data-alchemist-ashen.vercel.app

📜 License
SHASWATP