import EventEmitter from 'events';

import { objType } from 'for-promise/utils/lib.mjs';
import initMatrix from '@src/client/initMatrix';
import { startDb } from './db/indexedDb';

class StorageManager extends EventEmitter {
  constructor() {
    super();
    this.isPersisted = null;

    // Db
    this._dbVersion = 2;
    this.dbName = 'pony-house-database';
    this._timelineSyncCache = this.getJson('ponyHouse-timeline-sync', 'obj');

    // Get Content
    this.content = this.getJson('ponyHouse-storage-manager', 'obj');
    this.content.isPersistedLocal =
      typeof this.content.isPersistedLocal === 'boolean' ? this.content.isPersistedLocal : true;

    const tinyThis = this;
    window.addEventListener('storage', function (e) {
      tinyThis.emit('storage', e);
    });
  }

  async _syncTimeline(room, checkpoint = null, timeline = null) {
    if (room && typeof room.roomId === 'string') {
      const tm = timeline || room.getLiveTimeline();
      const roomId = room.roomId;

      const checkPoint =
        typeof checkpoint === 'string' && checkpoint.length > 0
          ? checkpoint
          : objType(this._timelineSyncCache[roomId], 'object') &&
              typeof this._timelineSyncCache[roomId].last === 'string' &&
              this._timelineSyncCache[roomId].last.length > 0
            ? this._timelineSyncCache[roomId].last
            : null;
    }
    return null;
  }

  syncTimeline(roomId, checkpoint = null) {
    return this._syncTimeline(initMatrix.matrixClient.getRoom(roomId), checkpoint);
  }

  addToMembers(event) {
    const tinyThis = this;
    return new Promise((resolve, reject) => {
      const data = {};
      const tinyReject = (err) => {
        console.log('[indexed-db] ERROR SAVING MEMBER DATA!', data);
        tinyThis.emit('dbMemberInserted-Error', err, data);
        reject(err);
      };
      try {
        data.user_id;
        data.room_id;
        data.type;
        data.origin_server_ts;

        data.id = `${data.user_id}:${data.room_id}`;

        tinyThis.storeConnection
          .insert({
            into: 'members',
            upsert: true,
            values: [data],
          })
          .then((result) => {
            tinyThis.emit('dbMemberInserted', result, data);
            resolve(result);
          })
          .catch(tinyReject);
      } catch (err) {
        tinyReject(err);
      }
    });
  }

  addToTimeline(event) {
    const tinyThis = this;
    return new Promise((resolve, reject) => {
      const data = {};
      const tinyReject = (err) => {
        console.log('[indexed-db] ERROR SAVING TIMELINE DATA!', data);
        tinyThis.emit('dbTimelineInserted-Error', err, data);
        reject(err);
      };
      try {
        const date = event.getDate();
        const thread = event.getThread();
        const threadId = thread && typeof thread.id === 'string' ? thread.id : null;

        data.event_id = event.getId();
        data.type = event.getType();
        data.sender = event.getSender();
        data.room_id = event.getRoomId();
        data.content = event.getContent();
        data.unsigned = event.getUnsigned();
        data.redaction = event.isRedaction();

        if (typeof threadId === 'string') data.thread_id = threadId;
        if (date) data.origin_server_ts = date.getTime();

        if (typeof data.age !== 'number') delete data.age;
        if (typeof data.type !== 'string') delete data.type;
        if (typeof data.sender !== 'string') delete data.sender;
        if (typeof data.room_id !== 'string') delete data.room_id;

        if (!objType(data.content, 'object')) delete data.content;
        if (!objType(data.unsigned, 'object')) delete data.unsigned;

        tinyThis.storeConnection
          .insert({
            into: 'timeline',
            upsert: true,
            values: [data],
          })
          .then((result) => {
            tinyThis.emit('dbTimelineInserted', result, data);
            resolve(result);
          })
          .catch(tinyReject);
      } catch (err) {
        tinyReject(err);
      }
    });
  }

  async startPonyHouseDb() {
    const isDbCreated = await startDb(this);
    this.emit('isDbCreated', isDbCreated);
    return isDbCreated;
  }

  getLocalStorage() {
    return global.localStorage;
  }

  getIndexedDB() {
    return global.indexedDB;
  }

  getIsPersisted() {
    return this.isPersisted;
  }

  getIsPersistedLocal() {
    return this.isPersisted ? this.content.isPersistedLocal : false;
  }

  setIsPersistedLocal(value) {
    if (typeof value === 'boolean') {
      this.content.isPersistedLocal = value;
      this.setJson('ponyHouse-storage-manager', this.content);
      this.emit('isPersistedLocal', value);
    }
  }

  async estimate() {
    if (navigator.storage && navigator.storage.estimate) {
      return navigator.storage.estimate();
    }
    return null;
  }

  async checkStoragePersisted() {
    // Check if site's storage has been marked as persistent
    if (navigator.storage && navigator.storage.persist) {
      await navigator.storage.persisted();
    } else this.isPersisted = null;
    return this.isPersisted;
  }

  async requestStoragePersisted() {
    // Request persistent storage for site
    if (navigator.storage && navigator.storage.persist) {
      this.isPersisted = await navigator.storage.persist();
    } else this.isPersisted = null;
    this.emit('isPersisted', this.isPersisted);
    return this.isPersisted;
  }

  localStorageExist() {
    return typeof Storage !== 'undefined';
  }

  setJson(name, data) {
    if (objType(data, 'object') || objType(data, 'map') || Array.isArray(data))
      return global.localStorage.setItem(name, JSON.stringify(data));
    throw new Error('The storage value is not json!');
  }

  getJson(name, defaultData = null) {
    if (
      typeof defaultData !== 'string' ||
      (defaultData !== 'array' &&
        defaultData !== 'obj' &&
        defaultData !== 'map' &&
        defaultData !== 'null')
    ) {
      return JSON.parse(global.localStorage.getItem(name));
    } else {
      let content = global.localStorage.getItem(name);
      const defaultValue =
        defaultData === 'obj'
          ? {}
          : defaultData === 'array'
            ? []
            : defaultData === 'map'
              ? new Map()
              : null;
      try {
        content = JSON.parse(content) ?? defaultValue;
      } catch {
        content = defaultValue;
      }
      return content;
    }
  }

  setItem(name, data) {
    return global.localStorage.setItem(name, data);
  }

  getItem(name) {
    return global.localStorage.getItem(name);
  }

  setString(name, data) {
    if (typeof data === 'string') return global.localStorage.setItem(name, data);
    throw new Error('The storage value is not string!');
  }

  getString(name) {
    let value = global.localStorage.getItem(name);
    if (typeof value === 'string') return value;

    return null;
  }

  setNumber(name, data) {
    if (typeof data === 'number') return global.localStorage.setItem(name, data);
    throw new Error('The storage value is not number!');
  }

  getNumber(name) {
    let number = global.localStorage.getItem(name);
    if (typeof number === 'number') return number;
    if (typeof number === 'string' && number.length > 0) {
      number = Number(number);
      if (!Number.isNaN(number)) return number;
    }

    return null;
  }

  setBool(name, data) {
    if (typeof data === 'boolean') return global.localStorage.setItem(name, data);
    throw new Error('The storage value is not boolean!');
  }

  getBool(name) {
    const value = global.localStorage.getItem(name);
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      if (value === 'true') return true;
      if (value === 'false') return false;
    }

    return null;
  }

  removeItem(name) {
    return global.localStorage.removeItem(name);
  }

  clearLocalStorage() {
    global.localStorage.clear();
  }
}

// Functions and class
const storageManager = new StorageManager();
storageManager.setMaxListeners(__ENV_APP__.MAX_LISTENERS);
export default storageManager;

if (__ENV_APP__.MODE === 'development') {
  global.storageManager = storageManager;
}
