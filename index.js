const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = new (require("socket.io").Server)();

const Discord = require("discord.js");
const client = new Discord.Client();

const path = require("path");

const config = require("./config.json");

app.use(express.static(path.resolve("./static")));


client.on("message", (msg) => {
  let json = {
    messageId: msg.id,
    messageContent: msg.content,
    authorTag: msg.author.tag,
    authorId: msg.author.id
  }
  io.sockets.emit("discord:message", json);
  console.log(json);
});

io.on("connection", (socket) => {
  socket.on("discord:send", (obj) => {
    let channel = client.guilds.cache.get(obj.guildId)?.channels?.cache?.get(obj.channelId);
    if (channel && obj.messageContent) {
      channel.send(obj.messageContent);
    }
  })
})





io.listen(httpServer);
httpServer.listen(process.env.PORT || config.PORT);
client.login(config.BOT_TOKEN).then(() => {
  console.log("Giriş yaptım!");
  console.log(`http://127.0.0.1:${process.env.PORT || config.PORT}`)
});



