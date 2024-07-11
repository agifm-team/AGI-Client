import initMatrix from '@src/client/initMatrix';
import EventEmitter from 'events';
import { objType } from 'for-promise/utils/lib.mjs';

// Emitter
class AttemptDecryption extends EventEmitter {
  constructor() {
    super();
  }

  start() {
    this.emit('start', true);
  }

  exec(mEvent, ops = undefined) {
    return new Promise(async (resolve) => {
      try {
        let result;
        if (!objType(ops, 'object'))
          result = await mEvent.attemptDecryption(initMatrix.matrixClient.getCrypto());
        else result = await mEvent.attemptDecryption(initMatrix.matrixClient.getCrypto(), ops);

        resolve(result);
      } catch (err) {
        resolve(null);
        console.error(err);
      }
    });
  }
}

const attemptDecryption = new AttemptDecryption();
attemptDecryption.setMaxListeners(__ENV_APP__.MAX_LISTENERS);
export default attemptDecryption;
