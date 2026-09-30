(function () {
  const USER_NAV = [
    { hash: '#/books', label: 'หนังสือทั้งหมด' },
    { hash: '#/books/search', label: 'ค้นหาหนังสือ' },
    { hash: '#/borrowings', label: 'หนังสือที่กำลังยืม' },
    { hash: '#/history', label: 'ประวัติการยืม-คืน' }
  ];

  const ADMIN_NAV = [
    { hash: '#/admin', label: 'Dashboard' },
    { hash: '#/admin/books', label: 'จัดการหนังสือ' },
    { hash: '#/admin/users', label: 'จัดการผู้ใช้งาน' },
    { hash: '#/admin/borrowings', label: 'รายการยืม-คืน' }
  ];

  function renderNav(user, currentHash) {
    const nav = document.getElementById('main-nav');
    const items = user.role === 'admin' ? ADMIN_NAV : USER_NAV;

    nav.innerHTML =
      items
        .map(
          (item) =>
            `<a href="${item.hash}" class="${item.hash === currentHash ? 'active' : ''}">${item.label}</a>`
        )
        .join('') + `<a href="#/logout">ออกจากระบบ</a>`;
  }

  function route() {
    const hash = window.location.hash || '#/login';
    const user = Auth.getUser();

    if (hash === '#/logout') {
      Auth.logout();
      return;
    }

    const publicRoutes = ['#/login', '#/register'];
    const isPublic = publicRoutes.includes(hash);

    if (!user && !isPublic) {
      window.location.hash = '#/login';
      return;
    }

    if (user && isPublic) {
      window.location.hash = user.role === 'admin' ? '#/admin' : '#/books';
      return;
    }

    UI.setChromeVisible(true);
    UI.userChip(user);

    if (hash === '#/login') {
      Auth.renderLogin();
      return;
    }

    if (hash === '#/register') {
      Auth.renderRegister();
      return;
    }

    renderNav(user, hash);

    if (user && user.role === 'admin') {
      if (hash === '#/admin' || hash === '#/admin/') return Admin.renderDashboard();
      if (hash === '#/admin/books') return Admin.renderBooks();
      if (hash === '#/admin/users') return Admin.renderUsers();
      if (hash === '#/admin/borrowings') return Admin.renderBorrowings();
    }

    if (hash === '#/books' || hash === '#/books/search') return Books.renderList();

    if (hash.startsWith('#/books/')) {
      return Books.renderDetail(hash.replace('#/books/', ''));
    }

    if (hash === '#/borrowings') return Borrowings.renderMyBorrowings();
    if (hash === '#/history') return Borrowings.renderHistory();

    if (hash === '#/admin') return Admin.renderDashboard();
    if (hash === '#/admin/books') return Admin.renderBooks();
    if (hash === '#/admin/users') return Admin.renderUsers();
    if (hash === '#/admin/borrowings') return Admin.renderBorrowings();

    window.location.hash = '#/login';
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('DOMContentLoaded', route);

  if (document.readyState !== 'loading') route();
})();
