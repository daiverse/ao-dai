const { PayOS } = require("@payos/node");

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID || "b8d745c1-3a05-4f76-8802-99ca656f7091",
  process.env.PAYOS_API_KEY || "b10ed8b4-0c58-4523-8b77-cfc0a2a466a9",
  process.env.PAYOS_CHECKSUM_KEY || "71c69dbfb4e6c3fa11463e26bb5723b71bf088eb82c1615fbf0a0715d9cf9e54"
);

module.exports = payOS;
