# Deployment & Operations Guide

## Containerization & Hosting
- **Frontend & Admin**: Deployable to Vercel, AWS Amplify, or Docker containers.
- **Backend (Node/Express)**: Deployable to AWS ECS / DigitalOcean / Render / Linux VPS with Node 20 runtime.
- **AI/ML (FastAPI)**: Deployable to Uvicorn / Gunicorn on GPU/CPU container instances.
- **Database**: MongoDB Atlas cluster with automated backups and replica sets.

## Environment Variables
Ensure all values from `.env.example` are securely provisioned in the production environment's secrets vault.
