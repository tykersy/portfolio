const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

// Web3Forms에서 발급받은 Access Key로 교체하세요.
// https://web3forms.com 에서 이메일 입력 후 무료로 키를 받을 수 있습니다.
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
  formStatus.textContent = message;
  formStatus.className = `form-status${type ? ` ${type}` : ''}`;
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
    setFormStatus('Web3Forms Access Key를 script.js에 설정해 주세요.', 'error');
    return;
  }

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  submitBtn.disabled = true;
  submitBtn.textContent = '전송 중...';
  setFormStatus('');

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name,
        email,
        message,
        subject: `포트폴리오 문의 - ${name}`,
      }),
    });

    const result = await response.json();

    if (result.success) {
      setFormStatus(`${name}님, 메시지가 전송되었습니다!`, 'success');
      contactForm.reset();
    } else {
      setFormStatus('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'error');
    }
  } catch {
    setFormStatus('네트워크 오류가 발생했습니다. 다시 시도해 주세요.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '보내기';
  }
});
