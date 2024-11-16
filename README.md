# Cartesi Backend for Hackathon Project

This repository contains the backend implementation for our hackathon project using Cartesi Rollups. The project is fully functional and utilizes TypeScript and an internal SQLite database running on Cartesi nodes.

## Overview

The backend handles event management, allowing you to inspect, add, or remove events through actions. It interacts with a Cartesi NODE SQLite database that stores events with the following structure:

```typescript
export interface Event {
    id: number;
    title: string;
    description: string;
    image: string;
    date_event: string;
    start_time: string;
    end_time: string;
    location: string;
    address: string;
    city: string;
    organiser: string;
    amount: string;
    guests: string;
    status: string;
    dummy_1: string;
}
```
Each action is performed using the EventPayload interface:

```typescript
export interface EventPayload {
    id: number;
    title: string;
    description: string;
    image: string;
    date_event: string;
    start_time: string;
    end_time: string;
    location: string;
    address: string;
    city: string;
    organiser: string;
    amount: string;
    guests: string;
    status: string;
    dummy_1: string;
    action: 'add' | 'update' | 'delete';
}
```
## Deployment Details
•	Backend URL:
https://cartesi-backend-1.fly.dev/
•	GraphQL Endpoint:
https://cartesi-backend-1.fly.dev/graphql
•	Inspect State Endpoint:
https://cartesi-backend-1.fly.dev/inspect/
•	Application Contract Address:
0x61f35052e6d3aB5170cc949193B30Dba81127a95
•	Transaction Explorer:
View all transactions on CartesiScan: https://arbitrum-sepolia.cartesiscan.io/

The project is deployed and running on Fly.io as recommended in the Cartesi documentation.

## How to Use

### GraphQL Queries

You can interact with the backend using GraphQL queries at the provided endpoint.

### Inspecting State
Access the current state of the events through the inspect endpoint:
https://cartesi-backend-1.fly.dev/inspect/


### Actions

Perform actions to manage events by sending EventPayload objects with the desired action:
- Add an Event: Set action to 'add'
- Update an Event: Set action to 'update'
- Delete an Event: Set action to 'delete'

Example Payload:
```json
{
  "id": 1,
  "title": "Tech Conference 2023",
  "description": "An annual conference about the latest in technology.",
  "image": "https://example.com/images/tech-conference-2023.png",
  "date_event": "2023-10-15",
  "start_time": "09:00",
  "end_time": "17:00",
  "location": "Convention Center",
  "address": "123 Main Street",
  "city": "Techville",
  "organiser": "Tech Corp",
  "amount": "150",
  "guests": "500",
  "status": "Scheduled",
  "dummy_1": "",
  "action": "add"
}
```

## Project Structure

- TypeScript and SQLite: The backend is built with TypeScript and uses an internal SQLite database within the Cartesi node.
- Event Management: Provides interfaces and actions to manage events effectively.
- Deployment: Hosted on Fly.io, ensuring scalability and reliability.

## Resources

- Cartesi Documentation: https://cartesi.io/docs/
- Fly.io Hosting: https://fly.io/
- Cartesi Scan Explorer: https://arbitrum-sepolia.cartesiscan.io/

## Shortcuts

- Backend URL: cartesi-backend-1.fly.dev
- GraphQL API: cartesi-backend-1.fly.dev/graphql
- Inspect State: cartesi-backend-1.fly.dev/inspect/
- Contract Address: 0x61f35052e6d3aB5170cc949193B30Dba81127a95
- Transactions: CartesiScan Explorer