const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const { ChannelType } = require("discord.js");

function stub(path, exports) {
  const id = require.resolve(path);
  require.cache[id] = { id, filename: id, loaded: true, exports };
}

let recorded, channels, sends, records, crossposts, renderCount;
let sendFailure, recordFailure, crosspostFailure, pauseSend;
const event = (id = "race-1", eventType = "Race") => ({
  eventType, currentEvent: { data: { id }, metaData: {} }, previousEvents: [],
});
const key = (id, type, guild) => JSON.stringify([guild, type, id]);

stub("../src/app/index.ts", {
  discordClient: { client: { channels: { fetch: async id => channels.get(id) } } },
});
stub("../src/discord/index.ts", {
  registry: { get: () => ({ buildAnnouncement: data => ({
    eventBody: data.data, profiles: [{ cacheKey: "image", profile: {} }],
  }) }) },
});
stub("../src/ui/index.ts", {
  imageBufferCache: { getOrSet: async () => { renderCount++; return Buffer.from("image"); } },
  render: async () => Buffer.from("image"),
});
stub("../src/database/index.ts", {
  guildTable: {
    hasEvent: async (id, type, guild) => recorded.has(key(id, type, guild)),
    appendEvent: async (id, type, guild) => {
      records++;
      if (recordFailure) throw new Error("record failed");
      recorded.add(key(id, type, guild));
    },
    fetchRegisteredChannel: async (_type, guild) => guild,
    fetchAllRegisteredChannels: async () => [...channels.keys()],
  },
});

const { EventAnnouncer } = require("../src/btd6/services/services.event-announcer.ts");
let announcer;

function addChannel(guild, type = ChannelType.GuildText) {
  const channel = {
    guildId: guild, type,
    send: async () => {
      sends++;
      if (pauseSend) await pauseSend;
      if (sendFailure) throw new Error("send failed");
      return {
        channel, channelId: guild,
        crosspost: async () => {
          crossposts++;
          assert.ok(recorded.size > 0, "record before crossposting");
          if (crosspostFailure) throw new Error("crosspost failed");
        },
      };
    },
  };
  channels.set(guild, channel);
}

beforeEach(() => {
  recorded = new Set(); channels = new Map();
  sends = records = crossposts = renderCount = 0;
  sendFailure = recordFailure = crosspostFailure = false;
  pauseSend = undefined;
  announcer = new EventAnnouncer();
  addChannel("guild-1");
});

test("overlapping broadcast and direct send deliver once", async () => {
  let release;
  pauseSend = new Promise(resolve => { release = resolve; });
  const first = announcer.send(event(), "guild-1");
  // Let the first call reach its pending Discord send.
  await new Promise(resolve => setImmediate(resolve));
  await announcer.sendAll(event());
  release();
  await first;
  assert.equal(sends, 1);
  assert.equal(records, 1);
});

test("overlapping broadcasts and duplicate channel registrations deliver once", async () => {
  channels.set("alias", channels.get("guild-1"));
  await Promise.all([announcer.sendAll(event()), announcer.sendAll(event())]);
  assert.equal(sends, 1);
});

test("already recorded events are skipped but explicit force still sends", async () => {
  await announcer.send(event(), "guild-1");
  assert.equal(await announcer.send(event(), "guild-1"), null);
  await announcer.send(event(), "guild-1", true);
  assert.equal(sends, 2);
});

test("a failed Discord send can be retried", async () => {
  sendFailure = true;
  await assert.rejects(announcer.send(event(), "guild-1"), /send failed/);
  assert.equal(records, 0);
  sendFailure = false;
  await announcer.send(event(), "guild-1");
  assert.equal(sends, 2);
  assert.equal(records, 1);
});

test("failed recording retries persistence without resending", async () => {
  recordFailure = true;
  await assert.rejects(announcer.send(event(), "guild-1"), /record failed/);
  await assert.rejects(announcer.send(event(), "guild-1"), /record failed/);
  recordFailure = false;
  await announcer.sendAll(event());
  assert.equal(sends, 1);
  assert.equal(records, 3);
  assert.equal(recorded.size, 1);
});

test("crosspost failure cannot cause a duplicate, including after restart", async () => {
  addChannel("guild-1", ChannelType.GuildAnnouncement);
  crosspostFailure = true;
  await assert.rejects(announcer.send(event(), "guild-1"), /crosspost failed/);
  announcer = new EventAnnouncer();
  await announcer.sendAll(event());
  assert.equal(sends, 1);
  assert.equal(crossposts, 1);
  assert.equal(records, 1);
});

test("different guilds, events and types still deliver, broadcast renders once", async () => {
  addChannel("guild-2");
  await announcer.sendAll(event());
  assert.equal(sends, 2);
  assert.equal(renderCount, 1);
  await announcer.send(event("race-2"), "guild-1");
  await announcer.send(event("race-1", "Boss"), "guild-1");
  assert.equal(sends, 4);
});

test("missing channels do not mark an event delivered", async () => {
  assert.equal(await announcer.send(event(), "missing"), null);
  assert.equal(records, 0);
  addChannel("missing");
  await announcer.send(event(), "missing");
  assert.equal(sends, 1);
});
