import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

let setStatus = null;
function setLoadingPage(status = 'Loading...', type = 'border') {
  if (typeof setStatus === 'function') {
    setStatus({ status, type });
  }
}

function LoadingPage() {
  const [systemState, setSystemState] = useState({ status: false, type: null });
  setStatus = setSystemState;

  return systemState !== null && typeof systemState.status === 'string' ? (
    <Modal
      className={`modal-loading-page${__ENV_APP__.ELECTRON_MODE ? ' root-electron-style' : ''}`}
      backdropClassName={`${__ENV_APP__.ELECTRON_MODE ? 'root-electron-style ' : ''}modal-backdrop-loading-page`}
      contentClassName="modal-content-loading-page"
      dialogClassName="modal-dialog-centered modal-dialog-scrollable modal-dialog-loading-page"
      animation={false}
      show
    >
      <Modal.Body className="noselect text-center">
        <div
          className={`spinner-${typeof systemState.type === 'string' ? systemState.type : 'border'}`}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>

        <br />

        {systemState.status}
      </Modal.Body>
    </Modal>
  ) : null;
}

export { setLoadingPage };
export default LoadingPage;

if (__ENV_APP__.MODE === 'development') {
  global.setLoadingPage = setLoadingPage;
}
