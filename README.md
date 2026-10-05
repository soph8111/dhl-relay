# DHL Relay

DHL Relay is a real-time tracking and leaderboard application developed as a bachelor project in Web Development at EK.

The application explores how a traditional result-tracking workflow can be transformed into an interactive live experience for a company relay event.

The solution consists of three main applications:

- **Client** – a live dashboard displaying runner positions, leaderboard results and event statistics.
- **Runner app** – a Capacitor-based application used by runners to start and finish their run and share their GPS position.
- **Server** – a Node.js, Express and Socket.IO server responsible for active runners, timing and real-time communication.

Sanity is used for permanent data storage and administration.

## Live demo

The deployed applications can be viewed here:

- **Live dashboard:** [Open live dashboard](https://dhl-relay.onrender.com/)
- **Runner app:** [Open runner app](https://dhl-relay-runner-app.onrender.com/)

> The runner app is designed for mobile use. The deployed web version is provided for demonstration purposes and is best viewed at a mobile screen size.
> The Capacitor-based iOS version has been tested separately through Xcode.

## Project structure

```text
dhl-relay/
├── client/          # Live dashboard
├── runner-app/      # Runner application
├── server/          # Socket.IO server
├── sanity/          # Sanity Studio and schemas
└── packages/
    ├── shared/      # Shared types, queries and business logic
    └── ui/          # Shared React components and hooks
```

## Getting started

### Installation

Clone the repository and install the dependencies from the project root:

```bash
git clone https://github.com/soph8111/dhl-relay.git
cd dhl-relay
npm install
```

The project uses npm workspaces, so dependencies for the applications and shared packages are installed from the root.

### Environment variables

Create `.env` files based on the included `.env.example` files:

```text
client/.env.example
runner-app/.env.example
server/.env.example
```

Add the required Sanity and server configuration before starting the applications.

### Development

Start all applications from the project root:

```bash
npm start
```

This starts the client, runner app, server and Sanity Studio.

## Known limitations

Background GPS tracking is not fully implemented. The current runner app uses the browser Geolocation API and requires the app to remain active for reliable position updates.

The project was developed as a bachelor project and is intended as a prototype rather than a production-ready system.
