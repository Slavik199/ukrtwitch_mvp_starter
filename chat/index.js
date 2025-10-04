const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const PORT = 5000;
const server = http.createServer();
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  const { streamId, token, username } = socket.handshake.query;
  if(!streamId) { socket.disconnect(); return; }
  const room = 'stream:' + streamId;
  socket.join(room);
  console.log('socket joined', room);
  socket.on('msg', async (payload) => {
    // payload: { user_id, username, content }
    const message = {
      id: uuidv4(),
      stream_id: streamId,
      user_id: payload.user_id || null,
      content: payload.content || ''
    };
    // emit to room
    io.to(room).emit('msg', message);
    // persist via API
    try{
      await axios.post((process.env.API_URL||'http://backend:4000') + '/api/v1/messages', message, { timeout: 2000 });
    }catch(e){
      // ignore
    }
  });
  socket.on('disconnect', ()=>{
    // left
  });
});

server.listen(PORT, ()=>console.log('Chat server listening',PORT));
