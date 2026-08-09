const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

const WEB3FORMS_ACCESS_KEY = 'f759fbbb-9fc3-4337-a04c-5b4c0327dc4d';

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

function setFormStatus(message, type = '') {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status${type ? ` ${type}` : ''}`;
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';
  }
  setFormStatus('');

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name,
        email,
        message,
        subject: `포트폴리오 문의 - ${name}`,
        botcheck: '',
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      setFormStatus(`${name}님, 메시지가 전송되었습니다! 이메일함(스팸함 포함)을 확인해 주세요.`, 'success');
      contactForm.reset();
    } else {
      const detail = result.message || result.body?.message || `HTTP ${response.status}`;
      setFormStatus(`전송 실패: ${detail}`, 'error');
      console.error('Web3Forms error:', result);
    }
  } catch (error) {
    setFormStatus('네트워크/CORS 오류입니다. Live Server로 열어서 다시 시도해 주세요.', 'error');
    console.error('Submit error:', error);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '보내기';
    }
  }
});
