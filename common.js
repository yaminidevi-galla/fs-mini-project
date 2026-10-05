function getToken() {
    return localStorage.getItem("token");
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch {
        return null;
    }
}

function requireLogin() {
    if (!getToken()) {
        window.location.href = "/login.html";
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login.html";
}

async function apiFetch(url, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (getToken()) {
        headers.Authorization = `Bearer ${getToken()}`;
    }

    const response = await fetch(url, { ...options, headers });

    let data;
    try {
        data = await response.json();
    } catch {
        data = { message: "Server returned an invalid response" };
    }

    if (!response.ok) {
        throw new Error(data.message || `Request failed (${response.status})`);
    }

    return data;
}
