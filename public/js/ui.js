const UI = (() => {
  const app = () => document.getElementById('app');
  const header = () => document.getElementById('app-header');

  const LABELS = {
    type: { textbook: 'หนังสือเรียน', comic: 'หนังสือการ์ตูน' },
    category: {
      science: 'วิทยาศาสตร์',
      math: 'คณิตศาสตร์',
      thai: 'ภาษาไทย',
      fantasy: 'แฟนตาซี',
      romantic: 'โรแมนติก',
      mystery: 'สืบสวน'
    },
    status: { available: 'ว่าง', borrowed: 'ถูกยืม', returned: 'คืนแล้ว' }
  };

  function esc(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function typeLabel(type) {
    return LABELS.type[type] || type || '-';
  }

  function categoryLabel(category) {
    return LABELS.category[category] || category || '-';
  }

  function statusLabel(status) {
    return LABELS.status[status] || status || '-';
  }

  function formatDate(date) {
    if (!date) return '-';
    const parts = String(date).slice(0, 10).split('-');
    if (parts.length !== 3) return date;
    return `${parts[0]}/${parts[1]}/${parts[2]}`;
  }

  function isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date().toISOString().slice(0, 10);
    return String(dueDate).slice(0, 10) < today;
  }

  function toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function loading(text = 'กำลังโหลดข้อมูล...') {
    app().innerHTML = `<div class="loading">${esc(text)}</div>`;
  }

  function showError(error) {
    toast(error && error.message ? error.message : 'เกิดข้อผิดพลาด', 'error');
  }

  function setChromeVisible(visible) {
    header().hidden = !visible;
    app().hidden = !visible;
  }

  function openModal(html) {
    const root = document.getElementById('modal-root');
    root.innerHTML = `<div class="modal-backdrop"><div class="modal">${html}</div></div>`;
    root.querySelector('.modal-backdrop').addEventListener('click', (event) => {
      if (event.target === event.currentTarget) closeModal();
    });
    return root.querySelector('.modal');
  }

  function closeModal() {
    document.getElementById('modal-root').innerHTML = '';
  }

  function confirmModal(message, confirmLabel = 'ยืนยัน') {
    return new Promise((resolve) => {
      const modal = openModal(`
        <h3 class="modal__title">ยืนยันการดำเนินการ</h3>
        <p>${esc(message)}</p>
        <div class="modal__actions">
          <button class="btn btn-outline" data-action="cancel">ยกเลิก</button>
          <button class="btn btn-danger" data-action="ok">${esc(confirmLabel)}</button>
        </div>
      `);
      modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
        closeModal();
        resolve(false);
      });
      modal.querySelector('[data-action="ok"]').addEventListener('click', () => {
        closeModal();
        resolve(true);
      });
    });
  }

  function badge(kind, value) {
    return `<span class="badge badge--${esc(value)}">${esc(value)}</span>`;
  }

  function bookCover(book, className = 'book-card__cover') {
    return `<img class="${className}" src="${esc(book.coverImage)}" alt="ปกหนังสือ ${esc(book.title)}"
      loading="lazy"
      onerror="this.onerror=null;this.src='/assets/images/book-placeholder.jpg'" />`;
  }

  function emptyState(text) {
    return `<div class="empty-state">
      <div class="empty-state__icon">&#128269;</div>
      <p>${esc(text)}</p>
    </div>`;
  }

  function userChip(user) {
    const chip = document.getElementById('user-chip');
    if (!user) {
      chip.innerHTML = '';
      return;
    }
    chip.innerHTML = `
      <span class="user-chip__avatar">${esc((user.username || '?').charAt(0).toUpperCase())}</span>
      <span>${esc(user.name)} (${esc(user.role)})</span>
    `;
  }

  return {
    LABELS,
    esc,
    typeLabel,
    categoryLabel,
    statusLabel,
    formatDate,
    isOverdue,
    toast,
    loading,
    showError,
    setChromeVisible,
    openModal,
    closeModal,
    confirmModal,
    badge,
    bookCover,
    emptyState,
    userChip
  };
})();
