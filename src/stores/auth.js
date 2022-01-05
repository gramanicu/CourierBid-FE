import { writable } from 'svelte/store';
import { browser } from '$app/env';

export const authUser = writable(JSON.parse(browser && localStorage.getItem('accessToken')) || {});
export const isLogged = writable((browser && localStorage.getItem('isLogged')) || false);

/**
 * Stores a key-value pair in the local storage, which is also
 * synchronized with the cache
 * @param {String} key The key of the pair
 * @param {String} val The value of the pair
 */
function updateLocalStorage(key, val) {
    if (browser) {
        if (val != null) {
            localStorage.setItem(key, val);
        } else {
            localStorage.removeItem(key);
        }
    }
}

authUser.subscribe(val => updateLocalStorage('authUser', JSON.stringify(val)));
isLogged.subscribe(val => updateLocalStorage('isLogged', val));
