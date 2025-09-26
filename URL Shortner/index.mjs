import * as http from "http";
const port = 3000;
const urlMap = {};
const generateId = () => {
  return Math.random().toString(36).slice(2, 8);
};
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/shortener" && req.method === "POST") {
    let body = "";
    req.on("data", (chunks) => {
      body += chunks.toString();
    });
    req.on("end", () => {
      try {
        const { url } = JSON.parse(body);
        if (
          !url ||
          (!url.startsWith("http://") && !url.startsWith("https://"))
        ) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: "User not found" }));
        }

        let id;
        do {
          id = generateId();
        } while (urlMap[id]);
        urlMap[id] = url;
        const shortUrl = `http://localhost:3000/${id}`;
        res.statusCode = 201;
        res.end(JSON.stringify({ shortUrl }));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invali request" }));
      }
    });
  }else if(req.url === '/all-links' && req.method === 'GET'){
    res.statusCode = 200
    res.end(JSON.stringify(urlMap))
  }
   else if (req.url.startsWith("/") && req.method === "GET") {
    const id = req.url.slice(1);
    const longUrl = urlMap[id];
    if (longUrl) {
      res.statusCode = 302;
      res.setHeader("Location", longUrl);
      res.end();
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "URL not found" }));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Invalid Operation" }));
  }
});

server.listen(port, () => {
  console.log(`The server is running on PORT ${port}`);
});
