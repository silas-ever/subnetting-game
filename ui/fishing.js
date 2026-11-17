export function bindFishing(lake, onReel) {
  if (!lake) return () => {};
  const line = lake.querySelector('.fishing-line');
  const bobber = lake.querySelector('.bobber');
  let hookedFish = null;
  let wasBelowTop = false;

  const move = (event) => {
    const bounds = lake.getBoundingClientRect();
    const x = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
    const y = Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
    line.style.left = `${x}px`;
    line.style.height = `${Math.max(0, y)}px`;
    bobber.style.left = `${x}px`;
    bobber.style.top = `${y}px`;
    line.classList.add('visible');
    bobber.classList.add('visible');

    if (y > bounds.height * 0.16) wasBelowTop = true;
    if (!hookedFish && wasBelowTop) {
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-fish]');
      if (target && lake.contains(target)) {
        hookedFish = target.dataset.fish;
        target.classList.add('hooked');
      }
    }
    if (hookedFish && wasBelowTop && y < bounds.height * 0.16) {
      const id = hookedFish;
      hookedFish = null;
      wasBelowTop = false;
      line.classList.remove('visible');
      bobber.classList.remove('visible');
      onReel(id);
    }
  };
  lake.addEventListener('pointermove', move);
  return () => lake.removeEventListener('pointermove', move);
}
