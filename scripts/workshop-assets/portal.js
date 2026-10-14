'use strict';

document.querySelectorAll('button[data-copy]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const id = button.dataset.copy;
    const text = document.getElementById(id).textContent;
    const status = document.getElementById(id + '-status');
    const manual = document.getElementById(id + '-manual');
    button.disabled = true;
    status.textContent = 'Kopírujem…';
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(text);
      manual.hidden = true;
      status.textContent = 'Skopírované do schránky. Doplňte údaje v hranatých zátvorkách, ak ich text obsahuje.';
    } catch {
      // This fallback never claims clipboard success. Exact text remains visible and selected.
      manual.value = text;
      manual.hidden = false;
      manual.focus();
      manual.select();
      status.textContent = 'Schránka nie je dostupná. Text je označený v poli nižšie: stlačte Ctrl+C / Cmd+C. Ak označenie nevidíte, označte celý text ručne.';
    } finally {
      button.disabled = false;
    }
  });
});
