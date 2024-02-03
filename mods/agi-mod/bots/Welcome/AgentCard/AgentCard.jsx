import React from 'react';
import './AgentCard.scss';

function AgentCard({ agent, Img }) {
  const imageUrl = Img;
  let keyId = -1;
  return (
    <div
      className="AgentCard"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%), url("${imageUrl}")`,
      }}
    >
      <h3 className="agent-username">{agent.username}</h3>
      <p className="agent-description" title={agent.meta.description}>
        {agent.meta.description.length > 60
          ? `${agent.meta.description.substring(0, 60)}...`
          : agent.meta.description}
      </p>
      <div className="agent-tags">
        {agent.meta.tags.map((tag) => {
          keyId++;
          <span key={`${tag}${String(keyId)}`} className="agent-tag">
            {tag}
          </span>;
        })}
      </div>
    </div>
  );
}

export default AgentCard;
