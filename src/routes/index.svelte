<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
	import Counter from '$lib/Counter.svelte';
  import { onMount } from 'svelte';
  import { state } from '$lib/state';
  import type { Process } from '$lib/state';

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;
      
      return  {
        duration: 600,
        easing: quintOut,
        css: t => `
          transform: ${transform} scale(${t});
          opacity: ${t}
        `
      };
    }
  });

  let name:string;
  let workRemaining:number;

  function submit() {
    state.submit({
      name,
      workRemaining
    });
  }
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>
		Multiprocessor simulator
	</h1>
</section>

<section>
  <div class='form'>
    <label>
      Name
      <input
        class="wide-input"
        placeholder="Job name"
        bind:value={name}
      />
    </label>
    <label>
      Time
      <input
        class="narrow-input"
        placeholder="1-120"
        bind:value={workRemaining}
        type="number"
      />
    </label>
    <button class="submit" on:click="{() => submit()}">Submit job</button>
  </div>

  <div class='board'>
    <div class='left'>
      <h2>Busy</h2>
      {#each $state.processes.filter(t => t.workRemaining > 0) as busy (busy.uuid)}
        <label
          class={busy.recentWork?"recent-work":""}
          in:receive|local="{{key: busy.uuid}}"
          out:send|local="{{key: busy.uuid}}"
        >
          {busy.workRemaining}<sub>s</sub>
          {busy.name}
          <button class="trash" on:click="{() => state.remove(busy)}">remove</button>
        </label>
      {/each}
    </div>
  
    <div class='right'>
      <h2>Completed</h2>
      {#each $state.processes.filter(t => t.workRemaining <= 0) as done (done.uuid)}
        <label
          class="done"
          in:receive|local="{{key: done.uuid}}"
          out:send|local="{{key: done.uuid}}"
        >
          {done.name}
          <button class="trash" on:click="{() => state.remove(done)}">remove</button>
        </label>
      {/each}
    </div>
  </div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

  .form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .form input {
    font-size: 1.4em;
  }

  input.narrow-input {
    width: 4em;
  }

  input.wide-input {
    width: 10em;
  }

  .submit {
    display: block;
		line-height: 1.2;
		padding: 0.5em 2.5em 0.5em 2em;
		margin: 0 0 0.5em 1em;
		border-radius: 2px;
		border: 1px solid hsl(240, 8%, 70%);
		background-color:hsl(240, 8%, 93%);
		color: #333;
  }

  .submit:hover {
    color: #AAA;
		background-color:hsl(240, 8%, 20%);
  }

  .board {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 1em;
		max-width: 36em;
		margin: 0 auto;
	}

	h2 {
		font-size: 2em;
		font-weight: 200;
		user-select: none;
		margin: 0 0 0.5em 0;
	}

	label {
    display: block;
		position: relative;
		line-height: 1.2;
		padding: 0.5em 2.5em 0.5em 2em;
		margin: 0 0 0.5em 0;
		border-radius: 2px;
		user-select: none;
		border: 1px solid hsl(240, 8%, 70%);
		background-color:hsl(240, 8%, 93%);
		color: #333;
	}

  .recent-work {
		background-color:hsl(347, 100%, 70%);
  }

	.done {
		border: 1px solid hsl(240, 8%, 90%);
		background-color:hsl(240, 8%, 98%);
	}

	.trash {
		position: absolute;
		top: 0;
		right: 0.2em;
		width: 2em;
		height: 100%;
		background: no-repeat 50% 50% url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23676778' d='M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M17,7H14.5L13.5,6H10.5L9.5,7H7V9H17V7M9,18H15A1,1 0 0,0 16,17V10H8V17A1,1 0 0,0 9,18Z'%3E%3C/path%3E%3C/svg%3E");
		background-size: 1.4em 1.4em;
		border: none;
		opacity: 0;
		transition: opacity 0.2s;
		text-indent: -9999px;
		cursor: pointer;
	}

	label:hover button {
		opacity: 1;
	}
</style>
