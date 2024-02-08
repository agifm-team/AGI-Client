import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import Text from '../../../atoms/text/Text';
import * as auth from '../../../../client/action/auth';
import { getBaseUrl } from '../../../../util/matrixUtil';
import Spinner from '../../../atoms/spinner/Spinner';

let searchingHs = null;
function Homeserver({ onChange }) {
  const [hs, setHs] = useState(null);
  const [process, setProcess] = useState({
    isLoading: true,
    message: 'Loading homeserver list...',
  });

  const setupHsConfig = async (servername) => {
    if (servername !== '') {
      setProcess({ isLoading: true, message: 'Looking for homeserver...' });
      let baseUrl = null;
      baseUrl = await getBaseUrl(servername);

      if (searchingHs !== servername) return;
      setProcess({ isLoading: true, message: `Connecting to ${baseUrl}...` });
      const tempClient = auth.createTemporaryClient(baseUrl);

      Promise.allSettled([tempClient.loginFlows(), tempClient.register()])
        .then((values) => {
          const loginFlow = values[0].status === 'fulfilled' ? values[0]?.value : undefined;
          const registerFlow =
            values[1].status === 'rejected' ? values[1]?.reason?.data : undefined;
          if (loginFlow === undefined || registerFlow === undefined) throw new Error();

          if (searchingHs !== servername) return;
          onChange({ baseUrl, login: loginFlow, register: registerFlow });
          setProcess({ isLoading: false });
        })
        .catch(() => {
          if (searchingHs !== servername) return;
          onChange(null);
          setProcess({ isLoading: false, error: 'Unable to connect. Please check your input.' });
        });
    } else {
      setProcess({ isLoading: false });
    }
  };

  useEffect(() => {
    onChange(null);
    if (hs === null) return;
    searchingHs = hs.selected;
    setupHsConfig(hs.selected);
  }, [hs]);

  useEffect(() => {
    try {
      const ENV = __ENV_APP__.LOGIN ?? {};
      const selectedHs =
        !Number.isNaN(ENV.DEFAULT_HOMESERVER) && Number.isFinite(ENV.DEFAULT_HOMESERVER)
          ? ENV.DEFAULT_HOMESERVER
          : 0;
      const allowCustom = ENV.ALLOW_CUSTOM_HOMESERVERS;
      const hsList = Array.isArray(ENV.HOMESERVER_LIST) ? ENV.HOMESERVER_LIST : [];

      if (!hsList?.length > 0 || selectedHs < 0 || selectedHs >= hsList?.length) {
        throw new Error();
      }

      let selectedServer = hsList[selectedHs];
      if (
        typeof window.location.hash === 'string' &&
        window.location.hash.startsWith('#') &&
        window.location.hash.length > 1
      ) {
        selectedServer = window.location.hash.substring(1);
        if (hsList.indexOf(selectedServer) < 0) hsList.push(selectedServer);
      }

      setHs({ selected: selectedServer, list: hsList, allowCustom });
    } catch {
      setHs({ selected: '', list: [''], allowCustom: true });
    }
  }, []);

  return (
    <>
      {process.error !== undefined && (
        <Text className="homeserver-form__error" variant="b3">
          {process.error}
        </Text>
      )}
      {process.isLoading && (
        <div className="homeserver-form__status flex--center">
          <Spinner size="small" />
          <Text variant="b2">{process.message}</Text>
        </div>
      )}
    </>
  );
}
Homeserver.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default Homeserver;
