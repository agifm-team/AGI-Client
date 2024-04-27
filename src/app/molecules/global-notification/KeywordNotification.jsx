import React from 'react';
import { getAppearance } from '@src/util/libs/appearance';

import initMatrix from '../../../client/initMatrix';
import { openReusableContextMenu } from '../../../client/action/navigation';
import { getEventCords } from '../../../util/common';

import Chip from '../../atoms/chip/Chip';
import Input from '../../atoms/input/Input';
import Button from '../../atoms/button/Button';
import SettingTile from '../setting-tile/SettingTile';

import NotificationSelector from './NotificationSelector';

import { useAccountData } from '../../hooks/useAccountData';
import { notifType, typeToLabel, getActionType, getTypeActions } from './GlobalNotification';

const DISPLAY_NAME = '.m.rule.contains_display_name';
const ROOM_PING = '.m.rule.roomnotif';
const ROOM_PING2 = '.m.rule.roomnotif2';
const ROOM_PING3 = '.m.rule.roomnotif3';
const USERNAME = '.m.rule.contains_user_name';
const KEYWORD = 'keyword';

export const everyoneTags = ['@everyone', '@here', '@room'];

function useKeywordNotif() {
  const mx = initMatrix.matrixClient;
  const pushRules = useAccountData('m.push_rules')?.getContent();
  const override = pushRules?.global?.override ?? [];
  const content = pushRules?.global?.content ?? [];

  const rulesToType = {
    [DISPLAY_NAME]: notifType.NOISY,
    [ROOM_PING]: notifType.NOISY,
    [ROOM_PING2]: notifType.NOISY,
    [ROOM_PING3]: notifType.NOISY,
    [USERNAME]: notifType.NOISY,
  };

  const setRule = (rule, type) => {
    const evtContent = pushRules ?? {};
    if (!evtContent.global) evtContent.global = {};
    if (!evtContent.global.override) evtContent.global.override = [];
    if (!evtContent.global.content) evtContent.global.content = [];
    const or = evtContent.global.override;
    const ct = evtContent.global.content;

    if (rule === DISPLAY_NAME || rule === ROOM_PING || rule === ROOM_PING2 || rule === ROOM_PING3) {
      let orRule = or.find((r) => r?.rule_id === rule);
      if (!orRule) {
        orRule = {
          conditions: [],
          actions: [],
          rule_id: rule,
          default: true,
          enabled: true,
        };
        or.push(orRule);
      }
      if (rule === DISPLAY_NAME) {
        orRule.conditions = [{ kind: 'contains_display_name' }];
        orRule.actions = getTypeActions(type, true);
      } else {
        orRule.conditions = [];
        if (rule === ROOM_PING)
          orRule.conditions.push({ kind: 'event_match', key: 'content.body', pattern: '@room' });
        if (rule === ROOM_PING2)
          orRule.conditions.push({
            kind: 'event_match',
            key: 'content.body',
            pattern: '@everyone',
          });
        if (rule === ROOM_PING3)
          orRule.conditions.push({ kind: 'event_match', key: 'content.body', pattern: '@here' });
        orRule.conditions.push({ kind: 'sender_notification_permission', key: 'room' });
        orRule.actions = getTypeActions(type, true);
      }
    } else if (rule === USERNAME) {
      let usernameRule = ct.find((r) => r?.rule_id === rule);
      if (!usernameRule) {
        const userId = mx.getUserId();
        const username = userId.match(/^@?(\S+):(\S+)$/)?.[1] ?? userId;
        usernameRule = {
          actions: [],
          default: true,
          enabled: true,
          pattern: username,
          rule_id: rule,
        };
        ct.push(usernameRule);
      }
      usernameRule.actions = getTypeActions(type, true);
    } else {
      const keyRules = ct.filter((r) => r.rule_id !== USERNAME);
      keyRules.forEach((r) => {
        r.actions = getTypeActions(type, true);
      });
    }

    mx.setAccountData('m.push_rules', evtContent);
  };

  const addKeyword = (keyword) => {
    if (content.find((r) => r.rule_id === keyword)) return;
    content.push({
      rule_id: keyword,
      pattern: keyword,
      enabled: true,
      default: false,
      actions: getTypeActions(rulesToType[KEYWORD] ?? notifType.NOISY, true),
    });
    mx.setAccountData('m.push_rules', pushRules);
  };
  const removeKeyword = (rule) => {
    pushRules.global.content = content.filter((r) => r.rule_id !== rule.rule_id);
    mx.setAccountData('m.push_rules', pushRules);
  };

  const dsRule = override.find((rule) => rule.rule_id === DISPLAY_NAME);
  const roomRule = override.find((rule) => rule.rule_id === ROOM_PING);
  const roomRule2 = override.find((rule) => rule.rule_id === ROOM_PING2);
  const roomRule3 = override.find((rule) => rule.rule_id === ROOM_PING3);
  const usernameRule = content.find((rule) => rule.rule_id === USERNAME);
  const keywordRule = content.find((rule) => rule.rule_id !== USERNAME);

  if (dsRule) rulesToType[DISPLAY_NAME] = getActionType(dsRule);
  if (roomRule) rulesToType[ROOM_PING] = getActionType(roomRule);
  if (roomRule2) rulesToType[ROOM_PING2] = getActionType(roomRule2);
  if (roomRule3) rulesToType[ROOM_PING3] = getActionType(roomRule3);
  if (usernameRule) rulesToType[USERNAME] = getActionType(usernameRule);
  if (keywordRule) rulesToType[KEYWORD] = getActionType(keywordRule);

  return {
    rulesToType,
    pushRules,
    setRule,
    addKeyword,
    removeKeyword,
  };
}

function GlobalNotification() {
  const { rulesToType, pushRules, setRule, addKeyword, removeKeyword } = useKeywordNotif();

  const keywordRules = pushRules?.global?.content.filter((r) => r.rule_id !== USERNAME) ?? [];

  const onSelect = (evt, rule) => {
    openReusableContextMenu('bottom', getEventCords(evt, '.btn-link'), (requestClose) => (
      <NotificationSelector
        value={rulesToType[rule]}
        onSelect={(value) => {
          if (rulesToType[rule] !== value) setRule(rule, value);
          requestClose();
        }}
      />
    ));
  };

  const basicUserMode = getAppearance('basicUserMode');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const { keywordInput } = evt.target.elements;
    const value = keywordInput.value.trim();
    if (value === '') return;
    addKeyword(value);
    keywordInput.value = '';
  };

  return (
    <div className="card noselect mt-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item very-small text-gray">Mentions & keywords</li>

        <SettingTile
          title="Message containing my display name"
          options={
            <Button onClick={(evt) => onSelect(evt, DISPLAY_NAME)} faSrc="fa-solid fa-check">
              {typeToLabel[rulesToType[DISPLAY_NAME]]}
            </Button>
          }
          content={
            <div className="very-small text-gray">
              Default notification settings for all message containing your display name.
            </div>
          }
        />

        <SettingTile
          title="Message containing my username"
          options={
            <Button onClick={(evt) => onSelect(evt, USERNAME)} faSrc="fa-solid fa-check">
              {typeToLabel[rulesToType[USERNAME]]}
            </Button>
          }
          content={
            <div className="very-small text-gray">
              Default notification settings for all message containing your username.
            </div>
          }
        />

        {!basicUserMode ? (
          <>
            <SettingTile
              title="Message containing @room"
              options={
                <Button onClick={(evt) => onSelect(evt, ROOM_PING)} faSrc="fa-solid fa-check">
                  {typeToLabel[rulesToType[ROOM_PING]]}
                </Button>
              }
              content={
                <div className="very-small text-gray">
                  Default notification settings for all messages containing @room.
                </div>
              }
            />

            <SettingTile
              title="Message containing @everyone"
              options={
                <Button onClick={(evt) => onSelect(evt, ROOM_PING2)} faSrc="fa-solid fa-check">
                  {typeToLabel[rulesToType[ROOM_PING2]]}
                </Button>
              }
              content={
                <div className="very-small text-gray">
                  Default notification settings for all messages containing @everyone.
                </div>
              }
            />

            <SettingTile
              title="Message containing @here"
              options={
                <Button onClick={(evt) => onSelect(evt, ROOM_PING3)} faSrc="fa-solid fa-check">
                  {typeToLabel[rulesToType[ROOM_PING3]]}
                </Button>
              }
              content={
                <div className="very-small text-gray">
                  Default notification settings for all messages containing @here.
                </div>
              }
            />
          </>
        ) : null}

        {rulesToType[KEYWORD] && (
          <SettingTile
            title="Message containing keywords"
            options={
              <Button onClick={(evt) => onSelect(evt, KEYWORD)} faSrc="fa-solid fa-check">
                {typeToLabel[rulesToType[KEYWORD]]}
              </Button>
            }
            content={
              <div className="very-small text-gray">
                Default notification settings for all message containing keywords.
              </div>
            }
          />
        )}

        <SettingTile
          title="Keywords"
          content={
            <div className="keyword-notification__keyword">
              <div className="very-small text-gray">
                Get notification when a message contains keyword.
              </div>
              <form onSubmit={handleSubmit}>
                <div>
                  <Input name="keywordInput" required />
                </div>
                <Button variant="primary" type="submit">
                  Add
                </Button>
              </form>
              {keywordRules.length > 0 && (
                <div>
                  {keywordRules.map((rule) => (
                    <Chip
                      faSrc="fa-solid fa-xmark"
                      key={rule.rule_id}
                      text={rule.pattern}
                      // iconColor={CrossIC}
                      onClick={() => removeKeyword(rule)}
                    />
                  ))}
                </div>
              )}
            </div>
          }
        />
      </ul>
    </div>
  );
}

export default GlobalNotification;
