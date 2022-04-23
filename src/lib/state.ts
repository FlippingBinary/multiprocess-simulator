import { writable } from 'svelte/store';
import { Socket, io } from 'socket.io-client';

export type Process = {
  name: string;
  workRemaining: number;
  uuid?: string;
  recentWork?: boolean;
}

type State = {
  socket?: Socket;
  processes: Array<Process>;
  error?: string;
};


function createState() {
  const socket = io();
  const { subscribe, set, update} = writable<State>({
    processes: [],
  });

  socket.on("connection_error", () => {
    state.update((s: State) => ({ ...s, error: "Unable to connect"} ));
  });
  socket.on("message", (data) => {
    console.log(`Received message from server: ${data}`);
    state.update((s: State) => ({ ...s, message: data }));
  });
  socket.on("status", (data) => {
    console.log(`Received status update from server`, data);
    state.update((s: State) => ({ ...s, processes: data}));
  })

  /*
  socket.on("processes", (data) => {
    const processes = JSON.parse(data);
    state.set({ processes });
  });
  */

  return {
    subscribe,
    update,
    set,
    submit: (job: Process) => {
      socket.emit("submit", job);
    },
    remove: (job: Process) => {
      socket.emit("remove", job);
    }
  }
}

export const state = createState();
