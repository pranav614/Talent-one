import { randomBytes, scryptSync } from "node:crypto";

if (!process.stdin.isTTY) {
  console.error("Run this command in an interactive terminal.");
  process.exit(1);
}

process.stdout.write("Enter the admin PIN (hidden): ");
process.stdin.setRawMode(true);
process.stdin.resume();

let pin = "";
process.stdin.on("data", (chunk) => {
  for (const character of chunk.toString("utf8")) {
    if (character === "\u0003") {
      process.stdout.write("\n");
      process.exit(130);
    }
    if (character === "\r" || character === "\n") {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");

      if (!/^[0-9]{4,16}$/.test(pin)) {
        console.error("PIN must be 4 to 16 digits.");
        process.exit(1);
      }

      const salt = randomBytes(16);
      const derived = scryptSync(pin, salt, 64, {
        N: 16384,
        maxmem: 64 * 1024 * 1024,
        p: 1,
        r: 8,
      });
      console.log("Copy this value into public.admin_pincode.pin_hash:");
      console.log(
        ["scrypt", "16384", "8", "1", salt.toString("base64url"), derived.toString("base64url")].join("$"),
      );
      pin = "";
      process.exit(0);
    }
    if (character === "\u007f" || character === "\b") {
      pin = pin.slice(0, -1);
      continue;
    }
    if (/^[0-9]$/.test(character)) pin += character;
  }
});
