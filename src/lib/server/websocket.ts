import type { Server } from 'socket.io';
import semaphore from 'semaphore';
import { v4 as uuidV4 } from 'uuid';
import type { Process } from '$lib/state';

let io:Server;
let loop: NodeJS.Timeout|undefined;
const globalProcessList:Process[] = [];
//const globalRunningProcesses = Array(4); // four cpus each running nothing right now.
const globalSemaphoreLock = semaphore(1);

function wakeUp() {
  globalSemaphoreLock.take( () => {
    if (typeof loop === 'undefined') {
      loop = setInterval(() => {
        // We'll schedule every second
        console.log('Iterating scheduler',globalProcessList);
        globalSemaphoreLock.take( () => {
          let workingCount = 0;
          const shortList = globalProcessList.filter(p => p && p.workRemaining > 0);
          if (shortList.length <= 0) {
            // No need to loop if there's no work to do.
            if (typeof loop !== 'undefined') {
              clearInterval(loop);
              loop = undefined;
            }
            globalSemaphoreLock.leave();
            return;
          }
          let worker = -1;
          for (let i = 0; i < shortList.length; i++) {
            // find first work
            const process = shortList[i];
            if (process.recentWork) {
              worker = i;
              break;
            }
          }
          if (worker >= 0) {
            for (let i = worker; i < shortList.length; i++) {
              // find last work of group
              const process = shortList[i];
              if (process.recentWork) {
                worker = i;
              } else {
                break;
              }
            }
          }
          for (let i = 0; i < shortList.length; i++) {
            const process = shortList[(i+worker+1)%shortList.length];
            if (workingCount < 4) {
              process.recentWork = true;
              process.workRemaining--;
              workingCount++;
            } else {
              process.recentWork = false;
            }
          }
          io.emit("status", globalProcessList);
          globalSemaphoreLock.leave();
        })
      }, 1000);
    }
    globalSemaphoreLock.leave();
  });
}

export function websocket(socket: Server) {
//  io = new Server(server.httpServer);
  io = socket;


  io.on('connection', (socket) => {
    console.log('New connection');
    socket.on("submit", (data) => {
      console.log(`Got new job: ${data.name}`);
      globalSemaphoreLock.take(() => {
        console.log("Processing for global process list", data);
        const name = `${data.name}`;
        const workRemaining = parseInt(data.workRemaining);
        if ( name.length > 0 && workRemaining > 0 ) {
          globalProcessList.push({
            name,
            workRemaining,
            recentWork: false,
            uuid: uuidV4()
          });
        }
        io.emit("status", globalProcessList);
        wakeUp();
        globalSemaphoreLock.leave();
      })
    })
    socket.on("remove", (data) => {
      console.log("Removing job", data);
      globalSemaphoreLock.take(() => {
        const uuid = `${data.uuid}`;
        if ( uuid.length > 0 ) {
          for (let i = 0; i < globalProcessList.length; i++) {
            const process = globalProcessList[i];
            if (process.uuid === uuid) {
              globalProcessList.splice(i,1);
              break;
            }
          }
        }
        io.emit("status", globalProcessList);
        globalSemaphoreLock.leave();
      })
    })
    socket.on("message", (data) => {
      console.log(`Got message: ${data}`);
      socket.send(data);
    });
    io.emit("status", globalProcessList);
  });
}
