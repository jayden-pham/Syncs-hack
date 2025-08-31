Install dependencies:
1. Install things in requirements.txt by "pip install -r requirements"
2. Go to client/rumates-app "cd clients/rumates-app", then "npm install" (slow, not recommended), or first download pnpm using "sudo npm install -g pnpm" (not a virus promise lol) then "pnpm install"
3. Launching the webapp requires 2 terminal
3.1 Terminal 1 will launch the server: first be at the top level, then "python3 -m server.app"
3.2 Terminal 2 will launch the front end: go to clients/rumates-app then "npm run dev" or "pnpm dev". Then click on the Local link in the output e.g http://localhost:3000

Webapp:
- First need to signup with username and password (>8 characters, require at least 1 number)