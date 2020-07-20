import { cubicOut } from 'svelte/easing';

export function crossfade() {
  const receivers = new Map();
  const senders = new Map();

  function crossfade(from, node, params) {
    const { delay = 0, easing = cubicOut } = params;

    const duration = params.animate ? 200 : 0;

    const rect = node.getBoundingClientRect();

    if (!from.rect.width || !from.rect.height || !rect.width || !rect.height) {
      return {
        duration: 0,
      };
    }

    const a = params.toSVGPoint({ x: rect.left, y: rect.top });
    const b = params.toSVGPoint({ x: from.rect.left, y: from.rect.top });

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    if (!dx && !dy) {
      return {
        duration: 0,
      };
    }

    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;

    return {
      delay,
      duration,
      easing,
      tick: (t, u) => {
        const ux = u * dx;
        const uy = u * dy;
        const value = `${transform} translate(${ux}, ${uy})`;

        if (params.animate) {
          if (params.hand) {
            node.style.opacity = t < 1 ? 0 : 1;
          } else {
            node.setAttribute('transform', value);
          }
        }
      },
    };
  }

  function log(key, msg) {
    if (key === 'FpeQ11RIG') {
      console.log(msg);
    }
  }

  function transition(items, counterparts, type) {
    return (node, params) => {
      items.set(params.key, {
        rect: node.getBoundingClientRect(),
      });

      log(params.key, 'add ' + type);

      return () => {
        log(type, params.key);

        if (counterparts.has(params.key)) {
          const from = counterparts.get(params.key);
          counterparts.delete(params.key);
          log(params.key, 'del ' + type);
          log(params.key, 'crossfade ' + JSON.stringify(from));

          return crossfade(from, node, params);
        }

        log(params.key, 'del ' + type);
        items.delete(params.key);

        return {
          duration: 0,
        };
      };
    };
  }

  return [
    transition(senders, receivers, 'S'),
    transition(receivers, senders, 'R'),
  ];
}

const [send, receive] = crossfade();

export { send, receive };
