# Alice AI Operator OS

A mobile-first AI operator workspace with department-based workflows and a secure server-side OpenAI integration.

## MVP departments
- General — all-purpose assistant
- Research — research planning and synthesis
- Strategy — plans and decisions
- Developer — coding and debugging support
- Business — business operations and growth
- Automation — workflow design
- QA — testing and review
- Launch — release planning

## Run locally
1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your OpenAI API key to `OPENAI_API_KEY`.
5. Run `npm run dev` and open http://localhost:3000.

## Environment variables
- `OPENAI_API_KEY` — required; keep it server-side and never expose it in browser code.
- `OPENAI_MODEL` — optional; defaults to `gpt-4.1-mini`.

## Deploy on Vercel
Import this repository into Vercel, add the environment variables above, then deploy. Redeploy after changing environment variables.

## Current MVP scope
The app includes a responsive operator dashboard, department selection, chat history for the current session, suggested prompts, and a server-side API route that calls OpenAI. It does not yet execute external actions, control a device, or connect third-party accounts. Those capabilities require separately implemented integrations, permissions, and user confirmations.

## Security notes
The API key is read only by the server route. Requests are limited in message count and per-message size. Add authentication, persistent storage, rate limiting, and usage monitoring before opening this app to public users.
