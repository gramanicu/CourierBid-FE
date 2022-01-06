import { writable } from 'svelte/store';
import { persist, localStorage } from '@macfja/svelte-persistent-store';

export const authUser = persist(writable({}), localStorage(), 'authUser');
export const isLogged = persist(writable(false), localStorage(), 'isLogged');
