import http from "http";

const server = http.createServer((req, res) => {
  console.log("Headers received:", req.headers);

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Headers logged to console");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
