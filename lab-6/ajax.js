class Ajax {
  constructor(options = {}) {
    this.defaultOptions = {
      baseURL: options.baseURL || '',
      timeout: options.timeout || 5000,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };
  }

  async request(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.defaultOptions.timeout);

    const fullURL = (options.baseURL || this.defaultOptions.baseURL) + url;

    const fetchOptions = {
      signal: controller.signal,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(fullURL, fetchOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`Request timeout: exceeded ${options.timeout || this.defaultOptions.timeout}ms`);
      }

      if (error instanceof TypeError) {
        throw new Error(`Network error: ${error.message}`);
      }

      throw error;
    }
  }

  async get(url, options = {}) {
    return this.request(url, {
      method: 'GET',
      ...options
    });
  }

  async post(url, data, options = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async put(url, data, options = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  async delete(url, options = {}) {
    return this.request(url, {
      method: 'DELETE',
      ...options
    });
  }
}

export default Ajax;
