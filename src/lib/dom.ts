export function getPipecatUiNamespace(): string {
  return ".pipecat-ui";
}

export function getPipecatUIContainer(): HTMLElement {
  return document.querySelector(getPipecatUiNamespace()) ?? document.body;
}
