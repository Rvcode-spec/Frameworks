const express = require("express");
const server = express();
const EmailService = require("./controller/EmailService");
const queue = require("./utils/queue");

server.use(express.json());


server.get('/', (req, resp) => {
    resp.send("Welcome to Email-Service");
})

server.post("/send-email", async (req, resp) => {
    const result = await EmailService.send(req.body);
    queue.addJob(req.body);
    resp.json(result);
});

server.get("/:id", (req, resp) => {
    const { id } = req.params;
    const status = EmailService.getStatus(id);

    if (status === "unknown") {
        return resp.status(404).json({ id, status: "not_found" });
    }

    resp.json({ id, status });
});

const PORT = process.env.PORT||5000;
server.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
