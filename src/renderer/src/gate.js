const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const submit = document.getElementById("submit");
  const copy = document.getElementById("copy");
  var inputElement = document.getElementById("myText");
  var hwid;
  ipcRenderer.on("send-hwid", (event, data) => {
    inputElement.value = data;
    hwid = data;
  });

  copy.addEventListener("click", async (event) => {
    event.preventDefault();

    const copyText = document.getElementById("myText");
    const textToCopy = copyText.value;

    // Use the Clipboard API to copy text to the clipboard
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Text copied to clipboard: " + textToCopy);
      })
      .catch((err) => {
        console.error("Unable to copy to clipboard", err);
      });
  });
  submit.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log("submited");
    // const data = new FormData(gate);
    // const key = data.get("key");

    ipcRenderer.send("GATE_SUBMIT", "click");
  });
});
