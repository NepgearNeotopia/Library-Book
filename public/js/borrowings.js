const Borrowings = (() => {
  async function renderMyBorrowings() {
    UI.loading();
    const app = document.getElementById('app');
    const currentUser = Auth.getUser();

    app.innerHTML = `
      <h1 class="page-title">หนังสือที่กำลังยืม</h1>
      <p class="page-subtitle">รายการหนังสือของคุณที่ยังไม่ได้คืน</p>
      <div class="alert" id="my-alert"></div>
      <div id="my-body"><div class="loading">กำลังโหลดข้อมูล...</div></div>
    `;

    const alertBox = document.getElementById('my-alert');
    const body = document.getElementById('my-body');

    async function load() {
      body.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
      try {
        const [borrowings, books] = await Promise.all([
          Api.getBorrowings({ userId: currentUser.id, status: 'borrowed' }),
          Api.getBooks()
        ]);

        if (!borrowings.length) {
          alertBox.className = 'alert';
          alertBox.textContent = '';
          body.innerHTML = UI.emptyState('คุณไม่มีหนังสือที่กำลังยืมอยู่');
          return;
        }

        alertBox.className = 'alert';
        alertBox.textContent = '';

        body.innerHTML = `
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>หนังสือ</th>
                  <th>วันที่ยืม</th>
                  <th>วันครบกำหนด</th>
                  <th>สถานะ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                ${borrowings
                  .map((item) => {
                    const book = books.find((b) => b.id === item.bookId);
                    const overdue = UI.isOverdue(item.dueDate);
                    return `<tr>
                      <td>
                        <strong>${UI.esc(book ? book.title : `หนังสือ #${item.bookId}`)}</strong><br />
                        <span class="text-muted" style="font-size:0.82rem">${UI.esc(book ? book.author : '-')}</span>
                      </td>
                      <td>${UI.esc(UI.formatDate(item.borrowDate))}</td>
                      <td class="${overdue ? 'text-danger' : ''}">
                        ${UI.esc(UI.formatDate(item.dueDate))}
                        ${overdue ? '<br /><span class="badge badge--borrowed">เกินกำหนด</span>' : ''}
                      </td>
                      <td>${UI.badge('status', item.status)} ${UI.esc(UI.statusLabel(item.status))}</td>
                      <td><button class="btn btn-success btn-sm" data-return="${item.id}">คืนหนังสือ</button></td>
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
            button.textContent = 'กำลังคืน...';
            try {
              await Api.updateBorrowing(id, { status: 'returned' });
              UI.toast('คืนหนังสือสำเร็จ', 'success');
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

    await load();
  }

  async function renderHistory() {
    UI.loading();
    const app = document.getElementById('app');
    const currentUser = Auth.getUser();

    app.innerHTML = `
      <h1 class="page-title">ประวัติการยืม-คืน</h1>
      <p class="page-subtitle">ประวัติทั้งหมดของคุณ</p>
      <div class="alert" id="hist-alert"></div>
      <div class="toolbar">
        <div class="form-group">
          <label for="hist-status">กรองตามสถานะ</label>
          <select class="form-control" id="hist-status">
            <option value="">ทั้งหมด</option>
            <option value="borrowed">กำลังยืม</option>
            <option value="returned">คืนแล้ว</option>
          </select>
        </div>
      </div>
      <div id="hist-body"><div class="loading">กำลังโหลดข้อมูล...</div></div>
    `;

    const alertBox = document.getElementById('hist-alert');
    const body = document.getElementById('hist-body');
    const select = document.getElementById('hist-status');

    async function load() {
      body.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
      try {
        const [borrowings, books] = await Promise.all([
          Api.getBorrowings({ userId: currentUser.id, status: select.value }),
          Api.getBooks()
        ]);

        alertBox.className = 'alert';
        alertBox.textContent = '';

        if (!borrowings.length) {
          body.innerHTML = UI.emptyState('ไม่มีประวัติการยืม-คืน');
          return;
        }

        body.innerHTML = `
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>รหัส</th>
                  <th>หนังสือ</th>
                  <th>วันที่ยืม</th>
                  <th>วันครบกำหนด</th>
                  <th>วันที่คืน</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                ${borrowings
                  .map((item) => {
                    const book = books.find((b) => b.id === item.bookId);
                    return `<tr>
                      <td>#${item.id}</td>
                      <td>${UI.esc(book ? book.title : `หนังสือ #${item.bookId}`)}</td>
                      <td>${UI.esc(UI.formatDate(item.borrowDate))}</td>
                      <td>${UI.esc(UI.formatDate(item.dueDate))}</td>
                      <td>${UI.esc(UI.formatDate(item.returnDate))}</td>
                      <td>${UI.badge('status', item.status)} ${UI.esc(UI.statusLabel(item.status))}</td>
                    </tr>`;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        `;
      } catch (error) {
        alertBox.className = 'alert alert-error';
        alertBox.textContent = error.message;
        body.innerHTML = UI.emptyState('ไม่สามารถโหลดข้อมูลได้');
      }
    }

    select.addEventListener('change', load);
    await load();
  }

  return { renderMyBorrowings, renderHistory };
})();
