import { store } from "@/store/store";


export function connectWebSocket(uname: string | null): Promise<WebSocket | null> {

    return new Promise((resolve, reject) => {
      
      const url = process.env.EXPO_PUBLIC_WEBSOCKET_URL;

      if (uname) {
        const socket = new WebSocket(url + uname);
        store.getState().states.websocket = socket;
        console.log('connecting ...');
        socket.onopen = () => {
          console.log('WebSocket connected');

          resolve(socket);
        };
          socket.onerror = (error) => {
                        console.log('WebSocket error observed:', error);
                        reject(socket)
          }
       
      }

    })

  }



