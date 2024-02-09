import React from 'react';
import tinyAPI from '@src/util/mods';

import GradioEmbed from './GradioAPI';

export default function startMessage() {
  tinyAPI.on('messageBody', (data, content, msgInfo) => {
    if (content['agi.client.iframe.item']) {
      // Get Data
      const agiData = content['agi.client.iframe.item'];

      // Embed
      if (agiData.type === 'iframe') {
        // Gradio
        if (agiData.source === 'gradio') {
          data.custom = (
            <GradioEmbed msgInfo={msgInfo} agiData={agiData} replyId={content.reply_id} />
          );
        }
      }
    }
  });
}
