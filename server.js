const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 8080;

const rawData = fs.readFileSync("chat_data.json");
var database = JSON.parse(rawData);

app.use(express.json()); // 允許解析 JSON

// app.get("/", (req, res) => {
//     res.send("Hello, this is your Node.js backend!");
// });

app.get("/conversations", (req, res) => {
    console.log("Received data:", req.body);
    res.json(database.conversations);
});

app.get("/messages", (req, res) => {
    console.log(`Received data: ${req.body}, with query: ${req.query}`);
    try {
        let targetConvId = req.query.conversationId;
        if (targetConvId) {
            res.json(database.messages.filter((e) => e.conversationId == targetConvId));
        }else{
            res.send("Not found in database :(");
        }
    } catch (e) {
        res.send(e);
    }
});

app.post("/conversations/:id/messages/create", (req,res) => {
    console.log(`Received data: ${req.body}, with query: ${req.params}`);
    try {
        let participant = req.body['user'];
        if (req.params.id) {
            let message = {
                conversationId: msg.conversationId,
                userId: 3,
                user: "Charlie",
                avatar: "https://i.pravatar.cc/150?img=3",
                messageType: "system",
                message: "System message: A user has joined the conversation!",
                reactions: {
                    "like": 2,
                    "love": 3,
                    "laugh": 1
                },
                timestamp: msg.timestamp,
            }
            let convLastMessage = {
                id: msg.conversationId,
                participants: database.conversations[convIdx].participants,
                lastMessage: msg.message,
                timestamp: msg.timestamp,
            }
            
            // Push to 'DB'
            database.messages.push(message);
            database.conversations[convIdx] = convLastMessage;
            res.send('OK');
        }
        res.status(500).send();
    } catch (e) {
        res.send(e);
    }
});

app.post("/conversations/create", (req, res) =>{
	console.log(`Received data: ${req.body}, with query: ${req.params}`);
        res.status(200).send();
});

app.post("/conversations/:id/messages/create", (req, res) => {
    console.log(`Received data: ${req.body}, with query: ${req.params}`);
    try {
        let msg = req.body;
        if (req.params.id) {
            let convIdx = database.findIndex((e) => e.id == req.params.id);
            let message = {
                conversationId: msg.conversationId,
                userId: msg.userId,
                user: msg.user,
                avatar: msg.avatar,
                messageType: msg.messageType,
                message: msg.message,
                reactions: msg.reactions,
                timestamp: msg.timestamp,
            }
            let convLastMessage = {
                id: msg.conversationId,
                participants: database.conversations[convIdx].participants,
                lastMessage: msg.message,
                timestamp: msg.timestamp,
            }
            
            // Push to 'DB'
            database.messages.push(message);
            database.conversations[convIdx] = convLastMessage;
            res.send('OK');
        }
        res.status(500).send();
    } catch (e) {
        res.send(e);
    }
});

app.patch("/conversations/:id/messages/reaction", (req, res) => {
    console.log(`Received data: ${req.body}, with query: ${req.params}`);
    try {
        let msg = req.body;
        let targetConvId = req.params.id;
        if (targetConvId) {
            // Declare data.
          let reaction = msg.reaction;
          let operation = msg.operation;
          let identifier = msg.identifier;
          let msgIdx = database.findIndex((e) =>`${e.message}${e.user}${e.timestamp}` ==identifier);

          // modify message data
          let modifiedMessage = database.messages[msgIdx];
          if (operation == "add") {
            modifiedMessage.reactions[reaction] += 1;
          } else {
            modifiedMessage.reactions[reaction] -= 1;
            // This case should not happen but who knows.
            if (modifiedMessage.reactions[reaction] < 0) {
              modifiedMessage.reactions[reaction] = 0;
            }
          }

          // Push to 'DB'
          database.messages[msgIdx] = modifiedMessage;
          res.send('OK');
        }
    } catch (e) {
        res.send(e);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
