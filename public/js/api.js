const Api = (() => {
  async function request(path, options = {}) {
    const response = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });

    if (response.status === 204) return null;

    let data = null;
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (error) {
        data = text;
      }
    }

    if (!response.ok) {
      const message = (data && data.message) || `เรียก API ไม่สำเร็จ (${response.status})`;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  function withQuery(path, params) {
    const query = new URLSearchParams();
    Object.keys(params || {}).forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const qs = query.toString();
    return qs ? `${path}?${qs}` : path;
  }

  return {
    request,
    withQuery,

    // ---------- Books ----------
    getBooks(params) {
      return request(withQuery('/api/books', params));
    },
    getBook(id) {
      return request(`/api/books/${id}`);
    },
    createBook(payload) {
      return request('/api/books', { method: 'POST', body: JSON.stringify(payload) });
    },
    updateBook(id, payload) {
      return request(`/api/books/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
    },
    deleteBook(id) {
      return request(`/api/books/${id}`, { method: 'DELETE' });
    },

    // ---------- Users ----------
    getUsers() {
      return request('/api/users');
    },
    getUser(id) {
      return request(`/api/users/${id}`);
    },
    createUser(payload) {
      return request('/api/users', { method: 'POST', body: JSON.stringify(payload) });
    },
    updateUser(id, payload) {
      return request(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
    },
    deleteUser(id) {
      return request(`/api/users/${id}`, { method: 'DELETE' });
    },

    // ---------- Borrowings ----------
    getBorrowings(params) {
      return request(withQuery('/api/borrowings', params));
    },
    getBorrowing(id) {
      return request(`/api/borrowings/${id}`);
    },
    createBorrowing(payload) {
      return request('/api/borrowings', { method: 'POST', body: JSON.stringify(payload) });
    },
    updateBorrowing(id, payload) {
      return request(`/api/borrowings/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
    },
    deleteBorrowing(id) {
      return request(`/api/borrowings/${id}`, { method: 'DELETE' });
    },

    health() {
      return request('/api/health');
    }
  };
})();
