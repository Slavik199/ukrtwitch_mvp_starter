# UkrTwitch MVP Starter (minimal runnable)
This is a minimal, **runnable** MVP skeleton for a Ukrainian Twitch-like platform.
It is shipped as a simple demo that can be run locally via Docker Compose.

**What is included (minimal working):**
- backend/ — Node.js Express API (simple auth in sqlite, stream metadata)
- chat/ — Socket.IO chat server
- frontend/ — static frontend (vanilla JS) that lists streams and connects to chat
- docker-compose.yml — services: backend, chat, frontend (static)
- docs/openapi.yaml — small OpenAPI skeleton
- db/schema.sql — SQLite schema used by backend

**How to run (locally with Docker):**
1. Make sure Docker is installed.
2. From project root run:
   ```bash
   docker-compose up --build
   ```
3. Open the frontend: http://localhost:3000
4. API runs on http://localhost:4000 (endpoints under /api/v1)
5. Chat socket.io on ws://localhost:5000

Notes:
- This is a minimal demo. It uses SQLite for simplicity (no Postgres required).
- The stream functionality is mocked (no actual RTMP ingestion/transcoding in this iteration).
- For production: replace SQLite with Postgres, add RTMP ingest, FFmpeg, MinIO, and secure keys.

