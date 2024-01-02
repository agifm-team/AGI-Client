import { serverDomain } from "./socket";

const logoutUrl = `https://auth.${serverDomain}/realms/Multi/protocol/openid-connect/logout`;

export function logout(redirect = true) {
    return new Promise((resolve, reject) => {
        fetch(logoutUrl).then((data) => {
            if (redirect) global.location.reload();
            resolve(data);
        }).catch(reject);
    });
};

export function redirectLogout() {
    window.open(logoutUrl, '_self');
};

export { logoutUrl };