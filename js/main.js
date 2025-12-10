// main.js - Contact form validation + helpers
document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const form = document.getElementById('contactForm');
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const messageEl = document.getElementById('message');
  const formMsg = document.getElementById('formMsg');
  const resetBtn = document.getElementById('resetBtn');

  if (!form || !nameEl || !emailEl || !messageEl || !formMsg || !resetBtn) {
    console.error('Form elements not found');
    return;
  }
  /* Auto-grow textarea logic */
  messageEl.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  function showMessage(text, type = 'error') {
    formMsg.textContent = text;
    formMsg.classList.remove('error', 'success');
    formMsg.classList.add(type === 'success' ? 'success' : 'error');
  }

  function clearMessage() {
    formMsg.textContent = '';
    formMsg.classList.remove('error', 'success');
  }

  function setInvalid(el, invalid = true) {
    if (invalid) el.classList.add('invalid');
    else el.classList.remove('invalid');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearMessage();

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = messageEl.value.trim();

    // Reset invalid states
    [nameEl, emailEl, messageEl].forEach(el => setInvalid(el, false));

    // Validate
    if (!name) {
      setInvalid(nameEl, true);
      showMessage('Please enter your name.');
      nameEl.focus();
      return;
    }

    if (!email) {
      setInvalid(emailEl, true);
      showMessage('Please enter your email address.');
      emailEl.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      setInvalid(emailEl, true);
      showMessage('Please enter a valid email address.');
      emailEl.focus();
      return;
    }

    if (!message) {
      setInvalid(messageEl, true);
      showMessage('Please enter a message.');
      messageEl.focus();
      return;
    }

    // Passed validation
    // showMessage('Message sent successfully. (Demo mode — not actually sent.)', 'success');
    showToast('Message sent successfully!');

    form.reset();
  });

  let toastTimeout; // Variable to store timeout ID

  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    // Clear previous timeout if exists
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    // After 3 seconds, remove the show class
    toastTimeout = setTimeout(function () {
      toast.classList.remove('show');
    }, 3000);
  }

  resetBtn.addEventListener('click', function () {
    form.reset();
    clearMessage();
    [nameEl, emailEl, messageEl].forEach(el => setInvalid(el, false));
    nameEl.focus();
  });
});