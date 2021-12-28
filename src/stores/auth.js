import { writable } from 'svelte/store';
import { browser } from '$app/env';

export const username = writable((browser && localStorage.getItem('username')) || null);

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


username.subscribe(val => updateLocalStorage('username', val));