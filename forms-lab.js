// Validation explorer: change attributes on one field and see the browser's own checking.
// Nothing is sent or stored.
for (const lab of document.querySelectorAll('[data-attrlab]')) {
  const field = lab.querySelector('.demo-field');
  const form = lab.querySelector('form');
  const code = lab.querySelector('.lab-code code');
  const result = lab.querySelector('.fl-result');
  const control = (name) => lab.querySelector(`[data-attr="${name}"]`);
  const patterns = {
    letters: { pattern: '[A-Za-z ]+', title: 'Letters and spaces only' },
    digits: { pattern: '[0-9]{4}', title: 'Exactly 4 digits' },
  };

  const check = () => {
    const ok = field.validity.valid;
    result.dataset.state = ok ? 'ok' : 'bad';
    result.textContent = ok ? '\u2713 Valid: the browser would let this through.' : `\u2717 The browser says: \u201c${field.validationMessage}\u201d`;
  };

  const sync = () => {
    const attrs = [`type="${control('type').value}"`];
    field.type = control('type').value;
    if (control('required').checked) { field.setAttribute('required', ''); attrs.push('required'); } else field.removeAttribute('required');
    for (const name of ['minlength', 'maxlength', 'min', 'max']) {
      const value = control(name).value.trim();
      if (value === '') field.removeAttribute(name);
      else { field.setAttribute(name, value); attrs.push(`${name}="${value}"`); }
    }
    const preset = patterns[control('pattern').value];
    if (preset) {
      field.setAttribute('pattern', preset.pattern);
      field.title = preset.title;
      attrs.push(`pattern="${preset.pattern}"`, `title="${preset.title}"`);
    } else { field.removeAttribute('pattern'); field.removeAttribute('title'); }
    code.textContent = `<input id="demo" name="demo"\n       ${attrs.join('\n       ')}>`;
    check();
  };

  lab.querySelector('.fl-box').addEventListener('input', sync);
  lab.querySelector('.fl-box').addEventListener('change', sync);
  field.addEventListener('input', check);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    result.dataset.state = 'ok';
    result.textContent = '\u2713 Submit allowed. In a real site the data would be sent now. Nothing was sent here.';
  });
  sync();
}
