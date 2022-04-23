<script context="module">
	import { browser, dev } from '$app/env';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<div class="content">
	<h1>About this app</h1>

	<p>
		This project is an attempt at providing a solution to the three programming projects assigned by Dr. Garuba in CSCI 680-01: Advanced Operating Systems.
  </p>

  <p>
    The project assignment for each of these requires the use of C/C++, but Dr. Garuba lifted that requirement in class.
    He also said we could combine the projects as long as each requirement is met.
  </p>

  <p>
    That is exactly what this project attempts to do entirely with <a href="https://kit.svelte.dev/">SvelteKit</a>, <a href="https://www.typescriptlang.org/">TypeScript</a>, and JavaScript with the aid of <a href="https://socket.io/">socket.io</a> and a JavaScript implementation of POSIX <a href="https://www.npmjs.com/package/semaphore">semaphores</a>.
  </p>

  <h2>Programming Project 1: Process Scheduling</h2>

  <p class="objective">
    The objective is to write a program that simulates the execution fo a stream of interactive processes by a laptop with a very large memory, a quad-core processor and one hard drive.
  </p>

  <p>
    To meet this objective, the project simulates jobs of variable length (as specified by the user) and executes four of them at a time.
    Since the problem statement says the laptop has a very large memory and a single harddrive of unspecified size, the assumption is that memory is not a consideration and this is a scheduling problem only.
    The set of four that are being executed rotates through the queue of jobs so no one job will sit idle forever.
  </p>

  <h2>Programming Project 2: Synchronization</h2>

  <p class="objective">
    The objective is to write a program that implements a distributed application for managing queues.
  </p>

  <p>
    To meet this objective, the project is a modern web app that multiple users can connect and interact with.
    Each client runs code that synchronizes with each other through the service, managing a queue of jobs, using WebSockets or polling (depending on the browser) with socket.io.
    Job names can be repeated because a uuid is generated for each submission, ensuring proper handling of duplicate names.
    This also makes it easier to test because the text field does not clear after submission.
    Just type something in the "Name" box and supply a time and click "Submit job" as many times as you want to submit multiple jobs with the same name.
  </p>

  <h2>Programming Project 3: Concurrency Management</h2>

  <p class="objective">
    The objective is to write a program that uses POSIX semaphores to provide mutual exclusion and UNIX shared memory segments to store shared variables.
  </p>

  <p>
    To meet this objective, the server intentionally leaves the list of processes in a global location and employs a semaphore to lock that variable.
    Although not advertised as such, the semaphore does meet the POSIX specifications.
    The semaphore protects the global variable against the corruption that may occur from the various activities that may modify the process list.
  </p>

  <h2>
    References
  </h2>

  <ul>
    <li>
      <a href="https://linu.us/live-chat-with-sveltekit-and-socketio">Live-Chat with SvelteKit and SocketIO by Linus Benkner</a><br />
    </li>
    <li>
      <a href="https://github.com/sveltejs/kit/issues/1491">GitHub issue #1491: Native support for web sockets</a>
    </li>
  </ul>
</div>

<style>
  h2 {
    font-size: large;
    font-weight: bold;
  }

  .content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}

  .objective {
    font-style: italic;
  }
</style>
