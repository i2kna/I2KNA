
"use strict";

const API_BASE = "https://i2kna-chat-api.i2kna.workers.dev";

const loginView = document.getElementById("login-view");
const dashboardView = document.getElementById("dashboard-view");
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const statusElement = document.getElementById("status");

function setStatus(message, type = "") {
    statusElement.textContent = message;
    statusElement.className = `status ${type}`.trim();
}

function showLogin() {
    loginView.hidden = false;
    dashboardView.hidden = true;
}

function showDashboard(admin) {
    loginView.hidden = true;
    dashboardView.hidden = false;

    document.getElementById("account-username").textContent =
        admin.username || "";

    document.getElementById("account-role").textContent =
        admin.role || "";

    document.getElementById("account-created").textContent =
        admin.createdAt
            ? new Date(admin.createdAt).toLocaleString()
            : "不明";
}

async function adminRequest(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            ...(options.body
                ? { "Content-Type": "application/json" }
                : {}),
            ...options.headers
        }
    });

    let data = {};

    try {
        data = await response.json();
    } catch {
        // APIがJSON以外を返した場合
    }

    if (!response.ok) {
        const error = new Error(
            data.error || `リクエストに失敗しました (${response.status})`
        );
        error.status = response.status;
        throw error;
    }

    return data;
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (loginButton.disabled) return;

    loginButton.disabled = true;
    setStatus("ログインを確認中です…");

    const formData = new FormData(loginForm);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");

    try {
        const data = await adminRequest("/api/admin/login", {
            method: "POST",
            body: JSON.stringify({ username, password })
        });

        if (!data.success || !data.admin) {
            throw new Error("ログイン応答が正しくありません。");
        }

        loginForm.reset();
        showDashboard(data.admin);
        setStatus("ログインしました。", "success");
    } catch (error) {
        if (error.status === 401) {
            setStatus("ユーザー名またはパスワードが違います。", "error");
        } else if (error.status === 429) {
            setStatus(
                "ログイン試行回数の上限に達しました。時間をおいて再試行してください。",
                "error"
            );
        } else {
            setStatus(
                `ログインできませんでした：${error.message}`,
                "error"
            );
        }
    } finally {
        loginButton.disabled = false;
    }
});

logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;
    setStatus("ログアウト中です…");

    try {
        await adminRequest("/api/admin/logout", {
            method: "POST"
        });

        showLogin();
        setStatus("ログアウトしました。", "success");
    } catch (error) {
        setStatus(
            `ログアウトに失敗しました：${error.message}`,
            "error"
        );
    } finally {
        logoutButton.disabled = false;
    }
});

async function checkSession() {
    setStatus("ログイン状態を確認中です…");

    try {
        const data = await adminRequest("/api/admin/me");

        if (!data.authenticated || !data.admin) {
            showLogin();
            setStatus("ログインしてください。");
            return;
        }

        showDashboard(data.admin);
        setStatus("ログイン状態を確認しました。", "success");
    } catch (error) {
        showLogin();

        if (error.status === 401) {
            setStatus("ログインしてください。");
        } else {
            setStatus(
                `接続を確認できませんでした：${error.message}`,
                "error"
            );
        }
    }
}

checkSession();
