// import { Server } from "socket.io";
// import { realTimeEr } from "../data/emergency.js";
// import { getAllPharmacy } from "../data/pharmacy.js";

// class Socket {
//   constructor(server) {
//     this.io = new Server(server, {
//       cors: {
//         origin: '*',
//       },
//     });

//     this.io.on('connection', (socket) => {
//       console.log('클라이언트 접속!');
//       socket.on('getErWithRealTime', ({ latitude, longitude }) => {
//         console.log('getErWithRealTime 실행');
//         realTimeEr(latitude, longitude, socket);
//       });
//       socket.on('getNearPharmacy', ({ latitude, longitude }) => {
//         console.log('getNearPharmacy 실행');
//         getAllPharmacy(latitude, longitude, socket);
//       });
//     });
//   }
// }

// let socket;

// export function initSocket(server) {
//   if(!socket) {
//     socket = new Socket(server);
//   }
// }

// export function getSocketIO() {
//   if(!socket) {
//     throw new Error('먼저 init를 실행해야 함!');
//   }
//   return socket.io;
// }