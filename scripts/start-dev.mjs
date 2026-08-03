import net from "node:net";
import http from "node:http";
import { execSync, spawn } from "node:child_process";

const HOST = "127.0.0.1";
const PORT = 5173;

function checkPort(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(800);
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

function isViteRunning(host, port) {
  return new Promise((resolve) => {
    const req = http.get(`http://${host}:${port}/`, { timeout: 1200 }, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        const isViteServer =
          res.statusCode === 200 ||
          body.includes("@vite/client") ||
          body.includes("index.html") ||
          body.includes("IntegralTech");
        resolve(isViteServer);
      });
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

function getProcessDetails(port) {
  try {
    if (process.platform === "win32") {
      const netstatOutput = execSync(`netstat -ano | findstr :${port}`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
      const lines = netstatOutput.trim().split("\n");
      for (const line of lines) {
        if (line.includes("LISTENING")) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid) {
            try {
              const tasklistOutput = execSync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, {
                encoding: "utf8",
                stdio: ["ignore", "pipe", "ignore"],
              });
              const nameMatch = tasklistOutput.match(/"([^"]+)"/);
              const processName = nameMatch ? nameMatch[1] : "Unknown Process";
              return { pid, name: processName };
            } catch {
              return { pid, name: "Unknown Process" };
            }
          }
        }
      }
    } else {
      const lsofOutput = execSync(`lsof -i:${port} -t`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
      const pid = lsofOutput.trim().split("\n")[0];
      if (pid) {
        const name = execSync(`ps -p ${pid} -o comm=`, {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        }).trim();
        return { pid, name };
      }
    }
  } catch {
    return null;
  }
  return null;
}

async function main() {
  const isListening = await checkPort(HOST, PORT);

  if (isListening) {
    const isVite = await isViteRunning(HOST, PORT);
    if (isVite) {
      console.log(`\n\x1b[32m✔ IntegralTech frontend is already running at http://${HOST}:${PORT}\x1b[0m\n`);
      process.exit(0);
    } else {
      const proc = getProcessDetails(PORT);
      if (proc) {
        console.error(
          `\n\x1b[31m✖ Port ${PORT} is occupied by ${proc.name} (PID: ${proc.pid}). Please stop this process first.\x1b[0m\n`
        );
      } else {
        console.error(`\n\x1b[31m✖ Port ${PORT} is occupied by another process. Please stop it first.\x1b[0m\n`);
      }
      process.exit(1);
    }
  }

  // Port is free -> Launch Vite
  const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const viteProcess = spawn(npxCmd, ["vite"], {
    stdio: "inherit",
    shell: true,
  });

  viteProcess.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

main();
