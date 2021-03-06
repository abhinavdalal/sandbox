<script>
  export let id;
  export let obj;
  export let droppable = true;
  export let isDragging = false;
  export let active = false;
  export let forceFaceUp = false;
  export let forceFaceDown = false;
  export let forceRotation;
  export let selectable = true;

  import { getContext } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { fade } from 'svelte/transition';
  import { selectionColor } from '../../../defaults.ts';
  import Back from './Back.svelte';

  const schema = getContext('schema');
  const renderer = getContext('renderer');
  const highlight = getContext('highlight');

  let width = 0;
  let height = 0;

  const template = obj.template;

  if (template) {
    width = template.geometry.width;
    height = template.geometry.height;
  }

  const fill = '#fff';
  const stroke = '#111';
  let faceDown = false;
  let rotation = tweened(0, { duration: 100 });

  $: {
    const card = obj.stateVal;

    faceDown = false;
    if (card.faceDown) {
      faceDown = true;
    }
    if (card.rotation !== undefined) {
      rotation.set(card.rotation);
    } else {
      rotation.set(0);
    }

    if (forceRotation !== undefined) {
      rotation.set(forceRotation);
    }
  }
</script>

<g
  data-id={id}
  data-selectable={selectable}
  data-droppable={droppable}
  transform="rotate({$rotation}
  {width / 2}
  {height / 2})">

  <rect data-id={id} {width} {height} {fill} {stroke} />

  {#if forceFaceDown || (faceDown && !forceFaceUp)}
    {#if !template.back || !template.back.parts || !Object.values(template.back.parts).length}
      <Back {id} {width} {height} />
    {:else if renderer && id in $schema.objects}
      <svelte:component
        this={renderer}
        {width}
        {height}
        faceDown={true}
        templates={$schema.templates}
        object={$schema.objects[id]} />
    {/if}
  {:else if renderer && id in $schema.objects}
    <svelte:component
      this={renderer}
      {width}
      {height}
      templates={$schema.templates}
      object={$schema.objects[id]} />
  {/if}

  {#if id in $highlight || active}
    <rect
      in:fade|local={{ duration: 150 }}
      x={-10}
      y={-10}
      width={width + 20}
      height={height + 20}
      fill="none"
      stroke-width="10"
      stroke={selectionColor} />
  {/if}
</g>
