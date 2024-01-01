import { serverDomain } from "./socket";

const logoutUrl = `https://auth.${serverDomain}/realms/Multi/protocol/openid-connect/logout`;

export function logout() {
    return fetch(logoutUrl, { mode: 'no-cors' });
};

export function redirectLogout() {
    window.open(logoutUrl, '_self');
};

export { logoutUrl };