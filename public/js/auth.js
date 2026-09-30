const Auth = (() => {
  const STORAGE_KEY = 'library_current_user';

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      return null;
    }
  }

  function setUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  function clearUser() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function renderLogin() {
    UI.setChromeVisible(false);
    const app = document.getElementById('app');
    app.hidden = false;
    document.getElementById('app-header').hidden = true;

    app.innerHTML = `
      <div class="auth-wrapper">
        <div class="auth-card">
          <h1 class="auth-card__title">เข้าสู่ระบบห้องสมุด</h1>
          <p class="auth-card__sub">กรอกข้อมูลเพื่อยืมและคืนหนังสือ</p>
          <div class="alert" id="login-alert"></div>
          <form id="login-form">
            <div class="form-group">
              <label for="login-username">ชื่อผู้ใช้</label>
              <input class="form-control" id="login-username" name="username" autocomplete="username" required />
            </div>
            <div class="form-group">
              <label for="login-password">รหัสผ่าน</label>
              <input class="form-control" id="login-password" name="password" type="password" autocomplete="current-password" required />
            </div>
            <button class="btn btn-primary btn-block" type="submit">เข้าสู่ระบบ</button>
          </form>
          <div class="auth-footer">
            ยังไม่มีบัญชี? <a href="#/register">สมัครสมาชิก</a>
          </div>
          <div class="auth-footer text-muted" style="font-size:0.8rem">
            ทดลองใช้งาน: admin / admin123 (ผู้ดูแล) หรือ user01 / user123 (ผู้ใช้)
          </div>
        </div>
      </div>
    `;

    const alertBox = document.getElementById('login-alert');
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      alertBox.className = 'alert';
      alertBox.textContent = '';

      const username = form.username.value.trim();
      const password = form.password.value;

      if (!username || !password) {
        alertBox.className = 'alert alert-error';
        alertBox.textContent = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'กำลังตรวจสอบ...';

      try {
        const users = await Api.getUsers();
        const matched = users.find(
          (user) => user.username === username && user.password === password
        );

        if (!matched) {
          alertBox.className = 'alert alert-error';
          alertBox.textContent = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
          return;
        }

        setUser(matched);
        UI.toast(`ยินดีต้อนรับ ${matched.name}`, 'success');
        window.location.hash = matched.role === 'admin' ? '#/admin' : '#/books';
      } catch (error) {
        alertBox.className = 'alert alert-error';
        alertBox.textContent = error.message;
      } finally {
        button.disabled = false;
        button.textContent = 'เข้าสู่ระบบ';
      }
    });
  }

  function renderRegister() {
    document.getElementById('app-header').hidden = true;
    const app = document.getElementById('app');
    app.hidden = false;
    app.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'auth-wrapper';
    wrapper.innerHTML = `
      <div class="auth-card">
        <h1 class="auth-card__title">สมัครสมาชิกใหม่</h1>
        <p class="auth-card__sub">สร้างบัญชีเพื่อยืมหนังสือจากห้องสมุด</p>
        <div class="alert" id="register-alert"></div>
        <form id="register-form">
          <div class="form-group">
            <label for="reg-username">ชื่อผู้ใช้</label>
            <input class="form-control" id="reg-username" name="username" required />
          </div>
          <div class="form-group">
            <label for="reg-password">รหัสผ่าน</label>
            <input class="form-control" id="reg-password" name="password" type="password" required />
          </div>
          <div class="form-group">
            <label for="reg-name">ชื่อ-นามสกุล</label>
            <input class="form-control" id="reg-name" name="name" required />
          </div>
          <div class="form-group">
            <label for="reg-email">อีเมล</label>
            <input class="form-control" id="reg-email" name="email" type="email" required />
          </div>
          <button class="btn btn-primary btn-block" type="submit">สมัครสมาชิก</button>
        </form>
        <div class="auth-footer">
          มีบัญชีอยู่แล้ว? <a href="#/login">เข้าสู่ระบบ</a>
        </div>
      </div>
    `;
    app.appendChild(wrapper);

    const alertBox = wrapper.querySelector('#register-alert');
    const form = wrapper.querySelector('#register-form');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      alertBox.className = 'alert';
      alertBox.textContent = '';

      const payload = {
        username: form.username.value.trim(),
        password: form.password.value,
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        role: 'user'
      };

      if (!payload.username || !payload.password || !payload.name || !payload.email) {
        alertBox.className = 'alert alert-error';
        alertBox.textContent = 'กรุณากรอกข้อมูลให้ครบทุกช่อง';
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'กำลังสมัคร...';

      try {
        const created = await Api.createUser(payload);
        alertBox.className = 'alert alert-success';
        alertBox.textContent = `สมัครสมาชิกสำเร็จ ยินดีต้อนรับ ${created.name} กำลังพาไปหน้าเข้าสู่ระบบ...`;
        form.reset();
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 1200);
      } catch (error) {
        alertBox.className = 'alert alert-error';
        alertBox.textContent = error.message;
      } finally {
        button.disabled = false;
        button.textContent = 'สมัครสมาชิก';
      }
    });
  }

  function logout() {
    clearUser();
    UI.toast('ออกจากระบบแล้ว', 'info');
    window.location.hash = '#/login';
  }

  return { getUser, setUser, clearUser, renderLogin, renderRegister, logout };
})();
