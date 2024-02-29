import { saveAs } from "file-saver";

export const downloadObjectAsText = (text: string, filename: string): void => {
  const blob = new Blob([text], { type: "text/html;charset=utf-8" });
  saveAs(blob, filename);
};

export const downloadObjectAsJson = <T>(
  exportObj: T,
  exportName: string
): void => {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(exportObj));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};
