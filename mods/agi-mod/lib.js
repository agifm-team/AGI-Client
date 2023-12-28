import { serverDomain } from "./socket";

export function logout() {
    return fetch(`https://auth.${serverDomain}/realms/Multi/protocol/openid-connect/logout`, { mode: 'no-cors' });
};