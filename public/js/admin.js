const Admin = (() => {
  async function renderDashboard() {
    UI.loading();
    const app = document.getElementById('app');

    app.innerHTML = `
      <h1 class="page-title">ภาพรวมระบบ</h1>
      <p class="page-subtitle">สถิติห้องสมุดทั้งหมด</p>
      <div class="alert" id="dash-alert"></div>
      <div id="dash-body"><div class="loading">กำลังโหลดข้อมูล...</div></div>
    `;

    const alertBox = document.getElementById('dash-alert');
    const body = document.getElementById('dash-body');

    try {
      const [books, users, borrowings] = await Promise.all([
        Api.getBooks(),
        Api.getUsers(),
        Api.getBorrowings()
      ]);

      const available = books.filter((book) => book.status === 'available').length;
      const borrowed = books.filter((book) => book.status === 'borrowed').length;
      const activeBorrowings = borrowings.filter((item) => item.status === 'borrowed').length;
      const returnedBorrowings = borrowings.filter((item) => item.status === 'returned').length;

      body.innerHTML = `
        <div class="grid grid--stats">
          <div class="stat-card">
            <div class="stat-card__value">${books.length}</div>
            <div class="stat-card__label">จำนวนหนังสือทั้งหมด</div>
          </div>
          <div class="stat-card stat-card--success">
            <div class="stat-card__value">${available}</div>
            <div class="stat-card__label">หนังสือที่ว่าง</div>
          </div>
          <div class="stat-card stat-card--warning">
            <div class="stat-card__value">${borrowed}</div>
            <div class="stat-card__label">หนังสือที่ถูกยืม</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value">${users.length}</div>
            <div class="stat-card__label">จำนวนผู้ใช้งาน</div>
          </div>
          <div class="stat-card stat-card--danger">
            <div class="stat-card__value">${borrowings.length}</div>
            <div class="stat-card__label">รายการยืมทั้งหมด</div>
          </div>
          <div class="stat-card stat-card--success">
            <div class="stat-card__value">${activeBorrowings}</div>
            <div class="stat-card__label">กำลังยืมอยู่</div>
          </div>
          <div class="stat-card stat-card--success">
            <div class="stat-card__value">${returnedBorrowings}</div>
            <div class="stat-card__label">คืนแล้ว</div>
          </div>
        </div>
      `;
    } catch (error) {
      alertBox.className = 'alert alert-error';
      alertBox.textContent = error.message;
      body.innerHTML = UI.emptyState('ไม่สามารถโหลดข้อมูลได้');
    }
  }

  // ---------- Books management ----------
  const bookState = { type: '', category: '', status: '', keyword: '' };

  function bookFormModal(book) {
    const isEdit = Boolean(book);
    const modal = UI.openModal(`
      <h3 class="modal__title">${isEdit ? 'แก้ไขหนังสือ' : 'เพิ่มหนังสือใหม่'}</h3>
      <div class="alert" id="modal-alert"></div>
      <form id="book-form">
        <div class="form-group">
          <label for="b-title">ชื่อหนังสือ</label>
          <input class="form-control" id="b-title" value="${UI.esc(book ? book.title : '')}" required />
        </div>
        <div class="form-group">
          <label for="b-author">ผู้เขียน</label>
          <input class="form-control" id="b-author" value="${UI.esc(book ? book.author : '')}" required />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="b-type">ประเภท</label>
            <select class="form-control" id="b-type">
              <option value="textbook" ${book && book.type === 'textbook' ? 'selected' : ''}>หนังสือเรียน</option>
              <option value="comic" ${book && book.type === 'comic' ? 'selected' : ''}>หนังสือการ์ตูน</option>
            </select>
          </div>
          <div class="form-group">
            <label for="b-category">หมวดหมู่</label>
            <select class="form-control" id="b-category">
              ${Object.keys(UI.LABELS.category)
                .map(
                  (key) =>
                    `<option value="${key}" ${book && book.category === key ? 'selected' : ''}>${UI.esc(UI.categoryLabel(key))}</option>`
                )
                .join('')}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="b-status">สถานะ</label>
            <select class="form-control" id="b-status">
              <option value="available" ${!book || book.status === 'available' ? 'selected' : ''}>ว่าง</option>
              <option value="borrowed" ${book && book.status === 'borrowed' ? 'selected' : ''}>ถูกยืม</option>
            </select>
          </div>
          <div class="form-group">
            <label for="b-quantity">จำนวน</label>
            <input class="form-control" id="b-quantity" type="number" min="0" value="${book ? book.quantity : 1}" />
          </div>
        </div>
        <div class="form-group">
          <label for="b-description">รายละเอียด</label>
          <textarea class="form-control" id="b-description" rows="3">${UI.esc(book ? book.description : '')}</textarea>
        </div>
        <div class="form-group">
          <label for="b-cover">รูปปก (path)</label>
          <input class="form-control" id="b-cover" value="${UI.esc(book ? book.coverImage : '/assets/images/book-placeholder.jpg')}" />
          <div class="form-hint">ระบบอัปโหลดรูปจริงยังไม่เปิดใช้งาน</div>
        </div>
        <div class="modal__actions">
          <button class="btn btn-outline" type="button" data-action="cancel">ยกเลิก</button>
          <button class="btn btn-primary" type="submit">บันทึก</button>
        </div>
      </form>
    `);

    const alertBox = modal.querySelector('#modal-alert');

    modal.querySelector('[data-action="cancel"]').addEventListener('click', UI.closeModal);

    modal.querySelector('#book-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = {
        title: modal.querySelector('#b-title').value.trim(),
        author: modal.querySelector('#b-author').value.trim(),
        type: modal.querySelector('#b-type').value,
        category: modal.querySelector('#b-category').value,
        status: modal.querySelector('#b-status').value,
        quantity: Number(modal.querySelector('#b-quantity').value),
        description: modal.querySelector('#b-description').value.trim(),
        coverImage: modal.querySelector('#b-cover').value.trim() || '/assets/images/book-placeholder.jpg'
      };

      try {
        if (isEdit) {
          await Api.updateBook(book.id, payload);
          UI.toast('บันทึกการแก้ไขหนังสือสำเร็จ', 'success');
        } else {
          await Api.createBook(payload);
          UI.toast('เพิ่มหนังสือใหม่สำเร็จ', 'success');
        }
        UI.closeModal();
        await loadAdminBooks();
      } catch (error) {
        alertBox.className = 'alert alert-error';
        alertBox.textContent = error.message;
      }
    });
  }

  async function loadAdminBooks() {
    const alertBox = document.getElementById('admin-books-alert');
    const body = document.getElementById('admin-books-body');

    if (!body) return;

    body.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';

    try {
      const books = await Api.getBooks({
        type: bookState.type,
        category: bookState.category,
        status: bookState.status
      });

      const keyword = bookState.keyword.trim().toLowerCase();
      const filtered = keyword
        ? books.filter(
            (book) =>
              book.title.toLowerCase().includes(keyword) ||
              book.author.toLowerCase().includes(keyword)
          )
        : books;

      alertBox.className = 'alert';
      alertBox.textContent = '';

      if (!filtered.length) {
        body.innerHTML = UI.emptyState('ไม่พบหนังสือที่ตรงกับเงื่อนไข');
        return;
      }

      body.innerHTML = `
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ชื่อหนังสือ</th>
                <th>ผู้เขียน</th>
                <th>ประเภท</th>
                <th>หมวดหมู่</th>
                <th>สถานะ</th>
                <th>จำนวน</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              ${filtered
                .map(
                  (book) => `<tr>
                    <td>#${book.id}</td>
                    <td><a href="#/books/${book.id}">${UI.esc(book.title)}</a></td>
                    <td>${UI.esc(book.author)}</td>
                    <td>${UI.badge('type', book.type)}</td>
                    <td><span class="badge badge--${UI.esc(book.category)}">${UI.esc(UI.categoryLabel(book.category))}</span></td>
                    <td>${UI.badge('status', book.status)}</td>
                    <td>${UI.esc(book.quantity)}</td>
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-outline btn-sm" data-edit="${book.id}">แก้ไข</button>
                        <button class="btn btn-danger btn-sm" data-delete="${book.id}">ลบ</button>
                      </div>
                    </td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `;

      body.querySelectorAll('[data-edit]').forEach((button) => {
        button.addEventListener('click', () => {
          const book = filtered.find((item) => item.id === Number(button.dataset.edit));
          bookFormModal(book);
        });
      });

      body.querySelectorAll('[data-delete]').forEach((button) => {
        button.addEventListener('click', async () => {
          const id = Number(button.dataset.delete);
          const book = filtered.find((item) => item.id === id);
          const ok = await UI.confirmModal(`ต้องการลบหนังสือ "${book.title}" ใช่หรือไม่?`, 'ลบ');
          if (!ok) return;
          try {
            await Api.deleteBook(id);
            UI.toast('ลบหนังสือสำเร็จ', 'success');
          } catch (error) {
            UI.showError(error);
          }
          await loadAdminBooks();
        });
      });
    } catch (error) {
      alertBox.className = 'alert alert-error';
      alertBox.textContent = error.message;
      body.innerHTML = UI.emptyState('ไม่สามารถโหลดข้อมูลได้');
    }
  }

  async function renderBooks() {
    UI.loading();
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="section-head">
        <div>
          <h1 class="page-title">จัดการหนังสือ</h1>
          <p class="page-subtitle">เพิ่ม แก้ไข และลบหนังสือในระบบ</p>
        </div>
        <button class="btn btn-primary" id="admin-add-book">เพิ่มหนังสือ</button>
      </div>
      <div class="alert" id="admin-books-alert"></div>
      <div class="toolbar">
        <div class="form-group">
          <label for="af-keyword">ค้นหา</label>
          <input class="form-control" id="af-keyword" placeholder="ชื่อหนังสือหรือผู้เขียน" value="${UI.esc(bookState.keyword)}" />
        </div>
        <div class="form-group">
          <label for="af-type">ประเภท</label>
          <select class="form-control" id="af-type">
            <option value="">ทั้งหมด</option>
            <option value="textbook">หนังสือเรียน</option>
            <option value="comic">หนังสือการ์ตูน</option>
          </select>
        </div>
        <div class="form-group">
          <label for="af-category">หมวดหมู่</label>
          <select class="form-control" id="af-category">
            <option value="">ทั้งหมด</option>
            ${Object.keys(UI.LABELS.category)
              .map((key) => `<option value="${key}">${UI.esc(UI.categoryLabel(key))}</option>`)
              .join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="af-status">สถานะ</label>
          <select class="form-control" id="af-status">
            <option value="">ทั้งหมด</option>
            <option value="available">ว่าง</option>
            <option value="borrowed">ถูกยืม</option>
          </select>
        </div>
      </div>
      <div id="admin-books-body"><div class="loading">กำลังโหลดข้อมูล...</div></div>
    `;

    const keywordInput = document.getElementById('af-keyword');
    const typeSelect = document.getElementById('af-type');
    const categorySelect = document.getElementById('af-category');
    const statusSelect = document.getElementById('af-status');

    typeSelect.value = bookState.type;
    categorySelect.value = bookState.category;
    statusSelect.value = bookState.status;

    document.getElementById('admin-add-book').addEventListener('click', () => bookFormModal(null));

    let timer;
    keywordInput.addEventListener('input', () => {
      clearTimeout(timer);
      bookState.keyword = keywordInput.value;
      timer = setTimeout(loadAdminBooks, 350);
    });
    typeSelect.addEventListener('change', () => {
      bookState.type = typeSelect.value;
      loadAdminBooks();
    });
    categorySelect.addEventListener('change', () => {
      bookState.category = categorySelect.value;
      loadAdminBooks();
    });
    statusSelect.addEventListener('change', () => {
      bookState.status = statusSelect.value;
      loadAdminBooks();
    });

    await loadAdminBooks();
  }

  // ---------- Users management ----------
  function userFormModal(user) {
    const isEdit = Boolean(user);
    const modal = UI.openModal(`
      <h3 class="modal__title">${isEdit ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน'}</h3>
      <div class="alert" id="modal-alert"></div>
      <form id="user-form">
        <div class="form-group">
          <label for="u-username">ชื่อผู้ใช้</label>
          <input class="form-control" id="u-username" value="${UI.esc(user ? user.username : '')}" required />
        </div>
        <div class="form-group">
          <label for="u-password">รหัสผ่าน</label>
          <input class="form-control" id="u-password" type="text" value="${UI.esc(user ? user.password : '')}" required />
          <div class="form-hint">ยังไม่มีการเข้ารหัสรหัสผ่านในระบบ Mock</div>
        </div>
        <div class="form-group">
          <label for="u-name">ชื่อ-นามสกุล</label>
          <input class="form-control" id="u-name" value="${UI.esc(user ? user.name : '')}" required />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="u-email">อีเมล</label>
            <input class="form-control" id="u-email" type="email" value="${UI.esc(user ? user.email : '')}" required />
          </div>
          <div class="form-group">
            <label for="u-role">สิทธิ์</label>
            <select class="form-control" id="u-role">
              <option value="user" ${!user || user.role === 'user' ? 'selected' : ''}>ผู้ใช้</option>
              <option value="admin" ${user && user.role === 'admin' ? 'selected' : ''}>ผู้ดูแลระบบ</option>
            </select>
          </div>
        </div>
        <div class="modal__actions">
          <button class="btn btn-outline" type="button" data-action="cancel">ยกเลิก</button>
          <button class="btn btn-primary" type="submit">บันทึก</button>
        </div>
      </form>
    `);

    const alertBox = modal.querySelector('#modal-alert');
    modal.querySelector('[data-action="cancel"]').addEventListener('click', UI.closeModal);

    modal.querySelector('#user-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = {
        username: modal.querySelector('#u-username').value.trim(),
        password: modal.querySelector('#u-password').value,
        name: modal.querySelector('#u-name').value.trim(),
        email: modal.querySelector('#u-email').value.trim(),
        role: modal.querySelector('#u-role').value
      };

      try {
        if (isEdit) {
          await Api.updateUser(user.id, payload);
          UI.toast('บันทึกการแก้ไขผู้ใช้สำเร็จ', 'success');
        } else {
          await Api.createUser(payload);
          UI.toast('เพิ่มผู้ใช้งานสำเร็จ', 'success');
        }
        UI.closeModal();
        await loadAdminUsers();
      } catch (error) {
        alertBox.className = 'alert alert-error';
        alertBox.textContent = error.message;
      }
    });
  }

  async function loadAdminUsers() {
    const alertBox = document.getElementById('admin-users-alert');
    const body = document.getElementById('admin-users-body');
    if (!body) return;

    body.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';

    try {
      const users = await Api.getUsers();
      alertBox.className = 'alert';
      alertBox.textContent = '';

      if (!users.length) {
        body.innerHTML = UI.emptyState('ไม่มีผู้ใช้งาน');
        return;
      }

      body.innerHTML = `
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ชื่อผู้ใช้</th>
                <th>ชื่อ-นามสกุล</th>
                <th>อีเมล</th>
                <th>สิทธิ์</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              ${users
                .map(
                  (user) => `<tr>
                    <td>#${user.id}</td>
                    <td>${UI.esc(user.username)}</td>
                    <td>${UI.esc(user.name)}</td>
                    <td>${UI.esc(user.email)}</td>
                    <td>${UI.badge('role', user.role)}</td>
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-outline btn-sm" data-edit="${user.id}">แก้ไข</button>
                        <button class="btn btn-danger btn-sm" data-delete="${user.id}">ลบ</button>
                      </div>
                    </td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `;

      body.querySelectorAll('[data-edit]').forEach((button) => {
        button.addEventListener('click', () => {
          const user = users.find((item) => item.id === Number(button.dataset.edit));
          userFormModal(user);
        });
      });

      body.querySelectorAll('[data-delete]').forEach((button) => {
        button.addEventListener('click', async () => {
          const id = Number(button.dataset.delete);
          const user = users.find((item) => item.id === id);
          const ok = await UI.confirmModal(`ต้องการลบผู้ใช้ "${user.username}" ใช่หรือไม่?`, 'ลบ');
          if (!ok) return;
          try {
            await Api.deleteUser(id);
            UI.toast('ลบผู้ใช้งานสำเร็จ', 'success');
          } catch (error) {
            UI.showError(error);
          }
          await loadAdminUsers();
        });
      });
    } catch (error) {
      alertBox.className = 'alert alert-error';
      alertBox.textContent = error.message;
      body.innerHTML = UI.emptyState('ไม่สามารถโหลดข้อมูลได้');
    }
  }

  async function renderUsers() {
    UI.loading();
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="section-head">
        <div>
          <h1 class="page-title">จัดการผู้ใช้งาน</h1>
          <p class="page-subtitle">เพิ่ม แก้ไข และลบผู้ใช้งานในระบบ</p>
        </div>
        <button class="btn btn-primary" id="admin-add-user">เพิ่มผู้ใช้งาน</button>
      </div>
      <div class="alert" id="admin-users-alert"></div>
      <div id="admin-users-body"><div class="loading">กำลังโหลดข้อมูล...</div></div>
    `;

    document.getElementById('admin-add-user').addEventListener('click', () => userFormModal(null));
    await loadAdminUsers();
  }

  // ---------- Borrowings management ----------
  async function renderBorrowings() {
    UI.loading();
    const app = document.getElementById('app');

    app.innerHTML = `
      <h1 class="page-title">รายการยืม-คืนทั้งหมด</h1>
      <p class="page-subtitle">ตรวจสอบสถานะการยืมและคืนหนังสือของผู้ใช้ทุกคน</p>
      <div class="alert" id="admin-borrow-alert"></div>
      <div class="toolbar">
        <div class="form-group">
          <label for="ab-status">สถานะ</label>
          <select class="form-control" id="ab-status">
            <option value="">ทั้งหมด</option>
            <option value="borrowed">กำลังยืม</option>
            <option value="returned">คืนแล้ว</option>
          </select>
        </div>
        <div class="form-group">
          <label for="ab-user">ผู้ใช้</label>
          <select class="form-control" id="ab-user"><option value="">ทั้งหมด</option></select>
        </div>
      </div>
      <div id="admin-borrow-body"><div class="loading">กำลังโหลดข้อมูล...</div></div>
    `;

    const alertBox = document.getElementById('admin-borrow-alert');
    const body = document.getElementById('admin-borrow-body');
    const statusSelect = document.getElementById('ab-status');
    const userSelect = document.getElementById('ab-user');

    async function load() {
      body.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
      try {
        const [borrowings, users, books] = await Promise.all([
          Api.getBorrowings({ status: statusSelect.value, userId: userSelect.value }),
          Api.getUsers(),
          Api.getBooks()
        ]);

        const selectedUser = userSelect.value;
        userSelect.innerHTML =
          '<option value="">ทั้งหมด</option>' +
          users.map((user) => `<option value="${user.id}">${UI.esc(user.username)}</option>`).join('');
        userSelect.value = selectedUser;

        alertBox.className = 'alert';
        alertBox.textContent = '';

        if (!borrowings.length) {
          body.innerHTML = UI.emptyState('ไม่พบรายการยืม-คืน');
          return;
        }

        body.innerHTML = `
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>รหัส</th>
                  <th>ผู้ยืม</th>
                  <th>หนังสือ</th>
                  <th>วันที่ยืม</th>
                  <th>วันครบกำหนด</th>
                  <th>วันที่คืน</th>
                  <th>สถานะ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                ${borrowings
                  .map((item) => {
                    const user = users.find((u) => u.id === item.userId);
                    const book = books.find((b) => b.id === item.bookId);
                    const overdue = item.status === 'borrowed' && UI.isOverdue(item.dueDate);
                    return `<tr>
                      <td>#${item.id}</td>
                      <td>${UI.esc(user ? user.username : `ผู้ใช้ #${item.userId}`)}</td>
                      <td>${UI.esc(book ? book.title : `หนังสือ #${item.bookId}`)}</td>
                      <td>${UI.esc(UI.formatDate(item.borrowDate))}</td>
                      <td class="${overdue ? 'text-danger' : ''}">${UI.esc(UI.formatDate(item.dueDate))}${overdue ? ' <span class="badge badge--borrowed">เกินกำหนด</span>' : ''}</td>
                      <td>${UI.esc(UI.formatDate(item.returnDate))}</td>
                      <td>${UI.badge('status', item.status)} ${UI.esc(UI.statusLabel(item.status))}</td>
                      <td>
                        <div class="table-actions">
                          ${
                            item.status === 'borrowed'
                              ? `<button class="btn btn-success btn-sm" data-return="${item.id}">คืนหนังสือ</button>`
                              : ''
                          }
                          <button class="btn btn-danger btn-sm" data-delete="${item.id}">ลบ</button>
                        </div>
                      </td>
                    </tr>`;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        `;

        body.querySelectorAll('[data-return]').forEach((button) => {
          button.addEventListener('click', async () => {
            const id = Number(button.dataset.return);
            button.disabled = true;
            try {
              await Api.updateBorrowing(id, { status: 'returned' });
              UI.toast('บันทึกการคืนหนังสือสำเร็จ', 'success');
            } catch (error) {
              UI.showError(error);
            }
            await load();
          });
        });

        body.querySelectorAll('[data-delete]').forEach((button) => {
          button.addEventListener('click', async () => {
            const id = Number(button.dataset.delete);
            const ok = await UI.confirmModal(`ต้องการลบรายการยืม #${id} ใช่หรือไม่?`, 'ลบ');
            if (!ok) return;
            try {
              await Api.deleteBorrowing(id);
              UI.toast('ลบรายการยืมสำเร็จ', 'success');
            } catch (error) {
              UI.showError(error);
            }
            await load();
          });
        });
      } catch (error) {
        alertBox.className = 'alert alert-error';
        alertBox.textContent = error.message;
        body.innerHTML = UI.emptyState('ไม่สามารถโหลดข้อมูลได้');
      }
    }

    statusSelect.addEventListener('change', load);
    userSelect.addEventListener('change', load);

    await load();
  }

  return { renderDashboard, renderBooks, renderUsers, renderBorrowings };
})();
