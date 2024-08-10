import { EventTimeline } from 'matrix-js-sdk';

import settings from '../settings';

export function isEdited(mEvent) {
  return mEvent.getRelation()?.rel_type === 'm.replace';
}

export function isReaction(mEvent) {
  return mEvent.getType() === 'm.reaction';
}

export function hideMemberEvents(mEvent) {
  const content = mEvent.getContent();
  const prevContent = mEvent.getPrevContent();
  const { membership } = content;
  if (settings.hideMembershipEvents) {
    if (membership === 'invite' || membership === 'ban' || membership === 'leave') return true;
    if (prevContent.membership !== 'join') return true;
  }
  if (settings.hideNickAvatarEvents) {
    if (membership === 'join' && prevContent.membership === 'join') return true;
  }
  return false;
}

export function getRelateToId(mEvent) {
  const relation = mEvent.getRelation();
  return relation && (relation.event_id ?? null);
}

export function addToMap(myMap, mEvent) {
  const relateToId = getRelateToId(mEvent);
  if (relateToId === null) return null;
  const mEventId = mEvent.getId();

  if (!myMap.has(relateToId)) myMap.set(relateToId, []);
  const mEvents = myMap.get(relateToId);
  if (mEvents.find((ev) => ev.getId() === mEventId)) return mEvent;
  mEvents.push(mEvent);
  return mEvent;
}

export function getFirstLinkedTimeline(timeline) {
  let prevTimeline = timeline;
  let tm = prevTimeline;
  while (prevTimeline) {
    tm = prevTimeline;
    prevTimeline = prevTimeline.getNeighbouringTimeline(EventTimeline.BACKWARDS);
  }
  return tm;
}
export function getLastLinkedTimeline(timeline) {
  let nextTimeline = timeline;
  let tm = nextTimeline;
  while (nextTimeline) {
    tm = nextTimeline;
    nextTimeline = nextTimeline.getNeighbouringTimeline(EventTimeline.FORWARDS);
  }
  return tm;
}

export function iterateLinkedTimelines(timeline, backwards, callback) {
  let tm = timeline;
  while (tm) {
    callback(tm);
    if (backwards) tm = tm.getNeighbouringTimeline(EventTimeline.BACKWARDS);
    else tm = tm.getNeighbouringTimeline(EventTimeline.FORWARDS);
  }
}

export function isTimelineLinked(tm1, tm2) {
  let tm = getFirstLinkedTimeline(tm1);
  while (tm) {
    if (tm === tm2) return true;
    tm = tm.getNeighbouringTimeline(EventTimeline.FORWARDS);
  }
  return false;
}

export const getClientYjs = (updateInfo, callback) => {
  if (Array.isArray(updateInfo.structs) && updateInfo.structs.length > 0) {
    for (const item in updateInfo.structs) {
      const struct = updateInfo.structs[item];
      callback({ value: struct, key: struct.id.client }, 'structs');
    }
  }

  if (updateInfo.ds && objType(updateInfo.ds.clients, 'map')) {
    updateInfo.ds.clients.forEach((value, key) => {
      callback({ value, key }, 'deleted');
    });
  }
};

export const enableyJsItem = {
  convertToString: (update) => btoa(update.toString()),

  action: (ydoc, type, parent) => {
    if (typeof enableyJsItem.types[type] === 'function') {
      return enableyJsItem.types[type](ydoc, parent);
    }
  },

  constructorToString: (parent) =>
    String(
      parent.constructor.name.startsWith('_')
        ? parent.constructor.name.substring(1)
        : parent.constructor.name,
    ).toLocaleLowerCase(),

  types: {
    ymap: (ydoc, parent) => ydoc.getMap(parent),
    ytext: (ydoc, parent) => ydoc.getText(parent),
    yarray: (ydoc, parent) => ydoc.getArray(parent),
  },

  convertToJson: {
    ymap: (data) => data.toJSON(),
    ytext: (data) => data.toString(),
    yarray: (data) => data.toArray(),
  },
};
