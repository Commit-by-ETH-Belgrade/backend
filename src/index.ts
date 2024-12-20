import createClient from "openapi-fetch";
import { components, paths } from "./schema";
import { fromHex, toHex } from 'viem'

// Importing and initializing DB
const { Database } = require("node-sqlite3-wasm");

import { Event, EventPayload } from './interfaces';

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;

console.log('Will start SQLITE Database');

// Instatiate Database
const db = new Database('/tmp/database.db');
try {
  db.run('CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, title TEXT, description TEXT, image TEXT, date_event TEXT, start_time TEXT, end_time TEXT, location TEXT, address TEXT, city TEXT, organiser TEXT, amount TEXT, guests TEXT, status TEXT, dummy_1 TEXT)');
} catch (e) {
  console.log('ERROR initializing databas: ', e)
}
console.log('Backend Database initialized');

type AdvanceRequestData = components["schemas"]["Advance"];
type InspectRequestData = components["schemas"]["Inspect"];
type RequestHandlerResult = components["schemas"]["Finish"]["status"];
type RollupsRequest = components["schemas"]["RollupRequest"];
type InspectRequestHandler = (data: InspectRequestData) => Promise<string>;
type AdvanceRequestHandler = (
    data: AdvanceRequestData
) => Promise<RequestHandlerResult>;

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

const handleAdvance: AdvanceRequestHandler = async (data) => {
  console.log("Received advance request data " + JSON.stringify(data));
  const payload = data.payload;
  try {
    const eventPayload = JSON.parse(fromHex(payload, 'string')) as EventPayload;
    console.log(
        `Managing event ${eventPayload.id}/${eventPayload.title || ''} - ${eventPayload.action}`
    );    if (!eventPayload.action) throw new Error('No action provided');
    if (eventPayload.action === 'add')
      db.run('INSERT INTO events VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [eventPayload.id, eventPayload.title, eventPayload.description, eventPayload.image, eventPayload.date_event, eventPayload.start_time, eventPayload.end_time, eventPayload.location, eventPayload.address, eventPayload.city, eventPayload.organiser, eventPayload.amount, eventPayload.guests, eventPayload.status, eventPayload.dummy_1]);
    if (eventPayload.action === 'delete')
      db.run('DELETE FROM events WHERE id = ?', [eventPayload.id]);

    const advance_req = await fetch(rollup_server + '/notice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ payload })
    });
    console.log("Received notice status ", await advance_req.text())
    return "accept";
  } catch (e) {
    console.log(`Error executing parameters: "${payload}"`);
    return "reject";
  }
};

const handleInspect: InspectRequestHandler = async (data) => {
  console.log("Received inspect request data " + JSON.stringify(data));
  try {
    const listOfEvents = await db.all(`SELECT * FROM events`);
    const payload = toHex(JSON.stringify(listOfEvents));
    const inspect_req = await fetch(rollup_server + '/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ payload })
    });
    console.log("Received report status " + inspect_req.status);
    return "accept";
  } catch (e) {
    console.log(`Error generating report with binary value "${data.payload}"`);
    return "reject";
  }
};

const main = async () => {
  const { POST } = createClient<paths>({ baseUrl: rollupServer });
  let status: RequestHandlerResult = "accept";
  while (true) {
    const { response } = await POST("/finish", {
      body: { status },
      parseAs: "text",
    });

    if (response.status === 200) {
      const data = (await response.json()) as RollupsRequest;
      switch (data.request_type) {
        case "advance_state":
          status = await handleAdvance(data.data as AdvanceRequestData);
          break;
        case "inspect_state":
          await handleInspect(data.data as InspectRequestData);
          break;
      }
    } else if (response.status === 202) {
      console.log(await response.text());
    }
  }
};

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
