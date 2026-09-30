const Books = (() => {
  const state = { type: '', category: '', status: '', keyword: '' };

  async function borrow(book, currentUser) {
    try {
      await Api.createBorrowing({ userId: currentUser.id, bookId: book.id });
      UI.toast(`ยืมหนังสือ "${book.title}" สำเร็จ`, 'success');
    } catch (error) {
      UI.showError(error);
    }
  }

  function bookCard(book, currentUser, onChange) {
    const canBorrow = book.status === 'available';
    return `
      <article class="book-card">
        ${UI.bookCover(book)}
        <div class="book-card__body">
          <h3 class="book-card__title">${UI.esc(book.title)}</h3>
          <p class="book-card__author">โดย ${UI.esc(book.author)}</p>
          <div class="book-card__meta">
            ${UI.badge('type', book.type)} <span class="badge badge--${UI.esc(book.category)}">${UI.esc(UI.categoryLabel(book.category))}</span>
            ${UI.badge('status', book.status)}
            <span class="badge">จำนวน ${UI.esc(book.quantity)}</span>
          </div>
          <div class="book-card__actions">
            <a class="btn btn-outline btn-sm" href="#/books/${book.id}">รายละเอียด</a>
            ${
              canBorrow
                ? `<button class="btn btn-success btn-sm" data-borrow="${book.id}">ยืม</button>`
                : '<button class="btn btn-outline btn-sm" disabled>ไม่พร้อมให้ยืม</button>'
            }
          </div>
        </div>
      </article>
    `;
  }

  async function renderList() {
    UI.loading();
    const app = document.getElementById('app');
    const currentUser = Auth.getUser();

    app.innerHTML = `
      <h1 class="page-title">หนังสือทั้งหมด</h1>
      <p class="page-subtitle">เลือกดูหนังสือ ค้นหา และกรองรายการที่สนใจ</p>
      <div class="alert" id="books-alert"></div>
      <div class="toolbar">
        <div class="form-group">
          <label for="filter-keyword">ค้นหาหนังสือ</label>
          <input class="form-control" id="filter-keyword" placeholder="ชื่อหนังสือหรือผู้เขียน" value="${UI.esc(state.keyword)}" />
        </div>
        <div class="form-group">
          <label for="filter-type">ประเภท</label>
          <select class="form-control" id="filter-type">
            <option value="">ทั้งหมด</option>
            <option value="textbook">หนังสือเรียน</option>
            <option value="comic">หนังสือการ์ตูน</option>
          </select>
        </div>
        <div class="form-group">
          <label for="filter-category">หมวดหมู่</label>
          <select class="form-control" id="filter-category">
            <option value="">ทั้งหมด</option>
            <option value="science">วิทยาศาสตร์</option>
            <option value="math">คณิตศาสตร์</option>
            <option value="thai">ภาษาไทย</option>
            <option value="fantasy">แฟนตาซี</option>
            <option value="romantic">โรแมนติก</option>
            <option value="mystery">สืบสวน</option>
          </select>
        </div>
        <div class="form-group">
          <label for="filter-status">สถานะ</label>
          <select class="form-control" id="filter-status">
            <option value="">ทั้งหมด</option>
            <option value="available">ว่าง</option>
            <option value="borrowed">ถูกยืม</option>
          </select>
        </div>
        <div class="toolbar__actions">
          <button class="btn btn-outline" id="filter-reset">ล้างตัวกรอง</button>
        </div>
      </div>
      <div id="books-result"><div class="loading">กำลังโหลดข้อมูล...</div></div>
    `;

    const alertBox = document.getElementById('books-alert');
    const result = document.getElementById('books-result');
    const keywordInput = document.getElementById('filter-keyword');
    const typeSelect = document.getElementById('filter-type');
    const categorySelect = document.getElementById('filter-category');
    const statusSelect = document.getElementById('filter-status');

    typeSelect.value = state.type;
    categorySelect.value = state.category;
    statusSelect.value = state.status;

    async function load() {
      result.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
      try {
        const books = await Api.getBooks({
          type: state.type,
          category: state.category,
          status: state.status
        });

        const keyword = state.keyword.trim().toLowerCase();
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
          result.innerHTML = UI.emptyState('ไม่พบหนังสือที่ตรงกับเงื่อนไข');
          return;
        }

        result.innerHTML = `<div class="grid grid--books">${filtered
          .map((book) => bookCard(book, currentUser, load))
          .join('')}</div>`;

        result.querySelectorAll('[data-borrow]').forEach((button) => {
          button.addEventListener('click', async () => {
            button.disabled = true;
            const book = filtered.find((item) => item.id === Number(button.dataset.borrow));
            await borrow(book, currentUser);
            await load();
          });
        });
      } catch (error) {
        alertBox.className = 'alert alert-error';
        alertBox.textContent = error.message;
        result.innerHTML = UI.emptyState('ไม่สามารถโหลดข้อมูลได้');
      }
    }

    let timer;
    keywordInput.addEventListener('input', () => {
      clearTimeout(timer);
      state.keyword = keywordInput.value;
      timer = setTimeout(load, 350);
    });

    typeSelect.addEventListener('change', () => {
      state.type = typeSelect.value;
      load();
    });
    categorySelect.addEventListener('change', () => {
      state.category = categorySelect.value;
      load();
    });
    statusSelect.addEventListener('change', () => {
      state.status = statusSelect.value;
      load();
    });
    document.getElementById('filter-reset').addEventListener('click', () => {
      state.type = '';
      state.category = '';
      state.status = '';
      state.keyword = '';
      keywordInput.value = '';
      typeSelect.value = '';
      categorySelect.value = '';
      statusSelect.value = '';
      load();
    });

    await load();
  }

  async function renderDetail(id) {
    UI.loading();
    const app = document.getElementById('app');
    const currentUser = Auth.getUser();

    try {
      const book = await Api.getBook(id);

      app.innerHTML = `
        <a class="back-link" href="#/books">&larr; กลับไปหนังสือทั้งหมด</a>
        <div class="card detail-grid">
          <div>
            ${UI.bookCover(book, 'detail-cover')}
          </div>
          <div>
            <h1 class="page-title">${UI.esc(book.title)}</h1>
            <p class="page-subtitle">โดย ${UI.esc(book.author)}</p>
            <ul class="detail-list">
              <li><span>ชื่อหนังสือ</span><span>${UI.esc(book.title)}</span></li>
              <li><span>ผู้เขียน</span><span>${UI.esc(book.author)}</span></li>
              <li><span>ประเภท</span><span>${UI.badge('type', book.type)} ${UI.esc(UI.typeLabel(book.type))}</span></li>
              <li><span>หมวดหมู่</span><span class="badge badge--${UI.esc(book.category)}">${UI.esc(UI.categoryLabel(book.category))}</span></li>
              <li><span>สถานะ</span><span>${UI.badge('status', book.status)} ${UI.esc(UI.statusLabel(book.status))}</span></li>
              <li><span>จำนวน</span><span>${UI.esc(book.quantity)} เล่ม</span></li>
              <li><span>รายละเอียด</span><span>${UI.esc(book.description)}</span></li>
            </ul>
            <div class="mt-1">
              ${
                book.status === 'available'
                  ? `<button class="btn btn-success" id="detail-borrow">ยืมหนังสือเล่มนี้</button>`
                  : '<span class="alert alert-info mb-1" style="display:inline-block">หนังสือเล่มนี้ถูกยืมอยู่</span>'
              }
            </div>
          </div>
        </div>
      `;

      const button = document.getElementById('detail-borrow');
      if (button) {
        button.addEventListener('click', async () => {
          button.disabled = true;
          await borrow(book, currentUser);
          window.location.hash = '#/books';
        });
      }
    } catch (error) {
      app.innerHTML = `
        <a class="back-link" href="#/books">&larr; กลับไปหนังสือทั้งหมด</a>
        <div class="card">
          <div class="alert alert-error">${UI.esc(error.message)}</div>
        </div>
      `;
    }
  }

  return { renderList, renderDetail };
})();
