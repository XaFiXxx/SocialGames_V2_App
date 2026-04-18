import Echo from "laravel-echo";
import Pusher from "pusher-js";
import api from "./api";

window.Pusher = Pusher;
Pusher.logToConsole = false;

const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST || "127.0.0.1",
  wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
  forceTLS: false,
  enabledTransports: ["ws", "wss"],

  authorizer: (channel) => ({
    authorize: async (socketId, callback) => {
      try {
        const response = await api.post("/api/broadcasting/auth", {
          socket_id: socketId,
          channel_name: channel.name,
        });

        callback(false, response.data);
      } catch (error) {
        callback(true, error);
      }
    },
  }),
});

export default echo;
