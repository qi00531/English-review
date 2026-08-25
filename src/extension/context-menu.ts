type TabsApi = { sendMessage(tabId: number, message: unknown): Promise<unknown> };
type ScriptingApi = { executeScript(injection: { target: { tabId: number }; files: string[] }): Promise<unknown> };

export async function deliverSelectionCapture(
  tabId: number,
  text: string,
  tabs: TabsApi = chrome.tabs,
  scripting: ScriptingApi = chrome.scripting,
) {
  const message = { type: 'SHOW_CAPTURE', text };
  try {
    await tabs.sendMessage(tabId, message);
  } catch {
    await scripting.executeScript({ target: { tabId }, files: ['extension/content.js'] });
    await tabs.sendMessage(tabId, message);
  }
}
