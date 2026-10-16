
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");
const pino = require("pino");

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) console.log("QR tersedia untuk menautkan WhatsApp.");
    if (connection === "open") console.log("MRYX BOT tersambung!");
    if (connection === "close" &&
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
      startBot();
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const jid = msg.key.remoteJid;
      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        "";

      if (!jid?.endsWith("@g.us")) continue;

      if (text.trim() === "!menu") {
        await sock.sendMessage(jid, {
          text: "MRYX BOT\n!menu\n!list\n!tebak"
        });
      } else if (text.trim() === "!list") {
        await sock.sendMessage(jid, {
          text: "Daftar MRYX masih kosong."
        });
      } else if (text.trim() === "!tebak") {
        await sock.sendMessage(jid, {
          text: "Tebak-tebakan: Apa yang punya jarum tapi tidak bisa menjahit? Jawab: jam."
        });
      }
    }
  });
}

startBot().catch(console.error);
