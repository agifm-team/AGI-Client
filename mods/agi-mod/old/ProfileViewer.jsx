// src/app/organisms/profile-viewer/ProfileViewer.jsx
// import YamlEditor from '@mods/agi-mod/components/YamlEditor';

import { serverDomain } from '@mods/agi-mod/socket';
import { openSuperAgent } from '@mods/agi-mod/menu/Buttons';

// Super agent
useEffect(() => {
  // Reset
  if (lastUserId && userId && lastUserId !== userId) {
    setLastUserId(userId);
    setAgentFullPrompt(false);
    setAgentData({
      err: null,
      data: null,
      loading: false,
    });
  }

  // Set agent data
  if (user && !agentData.loading && !agentData.err && !agentData.data) {
    setAgentData({
      err: null,
      data: null,
      loading: true,
    });

    fetch(`https://bots.${serverDomain}/bot/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setLastUserId(userId);
        setAgentData({
          err: null,
          data: data || {},
          loading: false,
        });
      })
      .catch((err) => {
        setLastUserId(userId);
        setAgentData({
          err,
          data: null,
          loading: false,
        });
      });
  }
});

/*
{agentData &&
      agentData.data &&
      typeof agentData.data.id === 'string' &&
      agentData.data.id.length > 0 ? (
        <>
          <Button
            className="me-2"
            variant="primary"
            onClick={() => {
              openSuperAgent(
                `${agentData.data.type === 'WORKFLOW' ? 'workflows' : 'agents'}/${agentData.data.id}?`,
              );
            }}
          >
            Edit
          </Button>
          <Button
            className="me-2"
            variant="primary"
            onClick={async () => {
              setLoadingPage();
              reconnectAgent(userId)
                .then(() => {
                  setLoadingPage(false);
                })
                .catch((err) => {
                  console.error(err);
                  alert(err.message);
                });
            }}
          >
            Restart
          </Button>
          <Button
            className="me-2"
            variant="primary"
            onClick={async () => {
              setLoadingPage();
              duplicatorAgent(agentData.data)
                .then(() => {
                  setLoadingPage(false);
                })
                .catch((err) => {
                  console.error(err);
                  alert(err.message);
                });
            }}
          >
            Duplicate
          </Button>
        </>
      ) : null}
*/
