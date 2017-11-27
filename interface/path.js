const Pathes = {
  executeSync:                  (sessionId) =>                       `/wd/hub/session/${sessionId}/execute/sync`,
  windowHandle:                 (sessionId) =>                       `/wd/hub/session/${sessionId}/window_handle`,
  windowHandles:                (sessionId) =>                       `/wd/hub/session/${sessionId}/window_handles`,
  screenshot:                   (sessionId) =>                       `/wd/hub/session/${sessionId}/screenshot`,
  forward:                      (sessionId) =>                       `/wd/hub/session/${sessionId}/forward`,
  back:                         (sessionId) =>                       `/wd/hub/session/${sessionId}/back`,
  refresh:                      (sessionId) =>                       `/wd/hub/session/${sessionId}/refresh`,
  currentSize:                  (sessionId) =>                       `/wd/hub/session/${sessionId}/window/current/size`,
  url:                          (sessionId) =>                       `/wd/hub/session/${sessionId}/url`,
  click:                        (sessionId, elementId) =>            `/wd/hub/session/${sessionId}/element/${elementId}/click`,
  submit:                       (sessionId, elementId) =>            `/wd/hub/session/${sessionId}/element/${elementId}/submit`,
  clear:                        (sessionId, elementId) =>            `/wd/hub/session/${sessionId}/element/${elementId}/clear`,
  text:                         (sessionId, elementId) =>            `/wd/hub/session/${sessionId}/element/${elementId}/text`,
  title:                        (sessionId) =>                       `/wd/hub/session/${sessionId}/title`,
  element:                      (sessionId) =>                       `/wd/hub/session/${sessionId}/element`,
  elements:                     (sessionId) =>                       `/wd/hub/session/${sessionId}/elements`,
  sendKeys:                     (sessionId, elementId) =>            `/wd/hub/session/${sessionId}/element/${elementId}/value`,
  killSession:                  (sessionId) =>                       `/wd/hub/session/${sessionId}`,
  attribute:                    (sessionId, elementId, attribute) => `/wd/hub/session/${sessionId}/element/${elementId}/attribute/${attribute}`
}


module.exports = {
  Pathes
}