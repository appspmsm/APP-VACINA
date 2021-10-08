/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { Dexie } from 'dexie';

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith('/_')) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
self.addEventListener('sync', (event) => {
  if (event.tag === 'sendCadastros') {
    event.waitUntil(sendCadastros());
  }
});

async function sendCadastros() {
  console.log('function sendCadastros');
  try {
    const db = new Dexie('Cadastros');
    db.version(3).stores({
      cadastros: '++id, cpf, status',
      selecao: '++id'
    });
    const cadastros = await db.cadastros.where('status').equals('pend').toArray();
    console.log(cadastros);
    if(cadastros.length > 0){
      const token = cadastros[0].token;
      const params = new URLSearchParams();
      params.append('cadastros', JSON.stringify(cadastros));
      params.append('token', token);
      params.append('type', 'setCadastros');
      let response = await fetch('https://script.google.com/macros/s/AKfycbxAFMlljdbDmllroIVQTwPjuBhRVrB2nPct1yxziKdjkhdVcNZaVIn-hDBXaSc-yA2C/exec', {
          method: 'post',
          redirect: 'follow',
          body: params
      });
      let responseJson = await response.json();
      console.log(responseJson);
      if(responseJson.success){
        const cadastrosOk = cadastros.map(cadastro => { return {...cadastro, status: 'ok'}});
        console.log(cadastrosOk);
        let update = await db.cadastros.bulkPut(cadastrosOk);
        console.log(update);
      }
    }
  } catch(err) {
    console.log(err);
    throw err;
  }

}

async function sendVacinacao() {
  try {
    const db = new Dexie('Vacinas');
    const vacinacoes = await db.vacinacoes.toArray();
    vacinacoes.foreach(async (vacinacao) => {
      const params = new URLSearchParams();
      params.append('login', vacinacao.login);
      params.append('cpf', vacinacao.cpf);
      params.append('time', vacinacao.time);
      params.append('grupo', vacinacao.grupo);
      params.append('vacina', vacinacao.vacina);
      params.append('lote', vacinacao.lote);
      params.append('dose', vacinacao.dose);
      params.append('type', 'setVacinacao');
      let response = await fetch('https://script.google.com/macros/s/AKfycbxkQf1wEUKHZoB6kbYA_YPHOioUhUAPiW2ctj83G83iNhuvTT9eig_-R38xZkui8Fk_OA/exec', {
        method: 'post',
        redirect: 'follow',
        body: params
      });
    });
  } catch(err) {
    throw err;
  }

}