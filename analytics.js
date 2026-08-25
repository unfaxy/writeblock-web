/*
 * Writeblock 웹 분석 — PostHog (EU 호스팅)
 *
 * 왜 이렇게 설정했나
 * - persistence: 'memory'  기기에 아무것도 저장하지 않는다(쿠키·localStorage 없음).
 *                          ePrivacy상 동의 배너가 필요 없어지는 대신, 방문자를 세션
 *                          너머로 이어붙일 수 없다. 즉 지표는 "사람"이 아니라 "방문"
 *                          단위로 읽어야 한다. 앱의 프라이버시 포지셔닝과 맞바꾼 값이다.
 * - autocapture: false     앱 SDK 설정과 동일하게 전수 수집을 끈다. 우리가 정의한
 *                          이벤트만 나간다.
 * - respect_dnt: true      브라우저가 추적 거부 신호를 보내면 아무것도 보내지 않는다.
 *
 * IP 기반 위치 추정은 PostHog 프로젝트 설정에서 이미 꺼져 있어 웹에도 그대로 적용된다.
 * 프로젝트는 iOS 앱과 같은 것을 쓴다. 웹 이벤트는 $pageview 및 $lib='web'으로 구분되고,
 * 앱 퍼널 쿼리는 $is_emulator 같은 모바일 전용 속성으로 필터하므로 서로 섞이지 않는다.
 */
!function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

posthog.init('phc_xvE5BUtHpFBZPxQDxeZfJwXJBkYt4dmsC4htPWSFjWJJ', {
  api_host: 'https://eu.i.posthog.com',
  ui_host: 'https://eu.posthog.com',
  persistence: 'memory',
  autocapture: false,
  disable_session_recording: true,
  disable_surveys: true,
  capture_pageview: true,
  capture_pageleave: false,
  person_profiles: 'identified_only',
  respect_dnt: true
});

/*
 * App Store로 나가는 클릭 = 이 사이트의 유일한 전환 지점.
 * 유료 고객이 실제로 웹에서 왔던 만큼(ASC 유입 소스 "Web referrer"), 방문 대비
 * 이 클릭의 비율이 사이트가 일하고 있는지를 보는 유일한 지표다.
 * capture 단계에서 잡아 링크가 새 탭을 열기 전에 이벤트가 큐에 들어가게 한다.
 */
document.addEventListener('click', function (event) {
  var target = event.target;
  if (!target || !target.closest) return;

  var link = target.closest('a[href*="apps.apple.com"]');
  if (!link) return;

  posthog.capture('appstore_click', {
    page: location.pathname,
    lang: document.documentElement.lang || 'en',
    placement: link.getAttribute('data-ph-placement') || 'unknown'
  });
}, true);
