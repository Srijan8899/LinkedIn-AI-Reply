import editIcon from "~/assets/edit.svg";
import insertIcon from "~/assets/insert.svg";
import generateIcon from "~/assets/generate.svg";
import regenerateIcon from "~/assets/regenerate.svg";

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  main() {
    injectModal();
    setupEventListeners();
  },
});

const modalHtml = `
  <div id="custom-modal" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; z-index: 4000;">
    <div id="modal-content" style="background: white; border-radius: 8px; width: 100%; max-width: 570px; padding: 20px; position: relative;">
      <div id="messages" style="margin-top: 10px; max-height: 200px; overflow-y: auto; padding: 10px; display: flex; flex-direction: column;"></div>
      <div style="margin-bottom: 10px;">
        <input id="input-text" type="text" placeholder="Enter your prompt..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"/>
      </div>
      <div style="text-align: right; margin-top: 12px;">
        <button id="insert-btn" style="background: #fff; color: #666D80; padding: 8px 16px; border: 2px solid #666D80; border-radius: 4px; cursor: pointer; display: none; margin-right: 10px;">
          <img src="${insertIcon}" alt="Insert" style="vertical-align: middle; margin-right: 5px; width: 14px; height: 14px;"> 
          <b>Insert</b>
        </button>
        <button id="generate-btn" style="background: #007bff; color: white; padding: 8px 16px; border: 2px solid #007bff; border-radius: 4px; cursor: pointer;">
          <img src="${generateIcon}" alt="Generate" style="vertical-align: middle; margin-right: 5px; width: 14px; height: 14px"> 
          <b>Generate</b>
        </button>
      </div>
    </div>
  </div>
`;

let modal: HTMLDivElement;
let generateBtn: HTMLButtonElement;
let insertBtn: HTMLButtonElement;
let inputText: HTMLInputElement;
let messagesDiv: HTMLDivElement;
let lastGeneratedMessage = "";
let parentElement: HTMLElement | null = null;
let editIconElement: HTMLImageElement | null = null;

function injectModal() {
  document.body.insertAdjacentHTML("beforeend", modalHtml);
  initializeModalElements();
}

function initializeModalElements() {
  modal = document.getElementById("custom-modal") as HTMLDivElement;
  generateBtn = document.getElementById("generate-btn") as HTMLButtonElement;
  insertBtn = document.getElementById("insert-btn") as HTMLButtonElement;
  inputText = document.getElementById("input-text") as HTMLInputElement;
  messagesDiv = document.getElementById("messages") as HTMLDivElement;

  generateBtn.addEventListener("click", handleGenerateClick);
  insertBtn.addEventListener("click", handleInsertClick);
  document.addEventListener("click", handleDocumentClick);
}

function setupEventListeners() {
  document.addEventListener("click", handleLinkedInClick);
}

function handleLinkedInClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (
    target.matches(".msg-form__contenteditable") ||
    target.closest(".msg-form__contenteditable")
  ) {
    parentElement = target.closest(".msg-form__container") || target.closest(".msg-form__contenteditable");
    activateMessageInput(parentElement);
    if (parentElement && !parentElement.querySelector(".edit-icon")) {
      injectEditIcon(parentElement);
    }
  } else {
    removeEditIcon();
  }
}

function activateMessageInput(parent: HTMLElement | null) {
  const contentContainer = parent?.closest(".msg-form_msg-content-container");
  if (parent && contentContainer) {
    contentContainer.classList.add("msg-form_msg-content-container--is-active");
    parent.setAttribute("data-artdeco-is-focused", "true");
  }
}

function injectEditIcon(parent: HTMLElement) {
  editIconElement = document.createElement("img");
  editIconElement.className = "edit-icon";
  editIconElement.src = editIcon;
  editIconElement.alt = "Edit Icon";
  editIconElement.style.cssText = "position: absolute; bottom: 5px; right: 5px; width: 30px; height: 30px; cursor: pointer; z-index: 1000";
  editIconElement.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleModalVisibility(true);
  });
  parent.style.position = "relative";
  parent.appendChild(editIconElement);
}

function removeEditIcon() {
  if (editIconElement) {
    editIconElement.remove();
    editIconElement = null;
  }
}

function toggleModalVisibility(show: boolean) {
  modal.style.display = show ? "flex" : "none";
}

function handleDocumentClick(event: MouseEvent) {
  if (!modal.contains(event.target as Node) && modal.style.display === "flex") {
    toggleModalVisibility(false);
  }
}

function generateMessage() {
  return "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
}

function handleGenerateClick(e: MouseEvent) {
  e.stopPropagation();
  const inputValue = inputText.value.trim();
  if (!inputValue) return;

  displayMessage(inputValue, "user");

  generateBtn.disabled = true;
  generateBtn.textContent = "Loading...";
  generateBtn.style.backgroundColor = "#666D80";

  setTimeout(() => {
    lastGeneratedMessage = generateMessage();
    displayMessage(lastGeneratedMessage, "generated");

    generateBtn.disabled = false;
    generateBtn.style.backgroundColor = "#007bff";
    generateBtn.style.color = "white";
    generateBtn.innerHTML = `<img src="${regenerateIcon}" alt="Regenerate" style="vertical-align: middle; margin-right: 5px; width: 16px; height: 16px"> <b>Regenerate</b>`;

    inputText.value = "";
    insertBtn.style.display = "inline-block";
  }, 500);
}

function displayMessage(message: string, type: "user" | "generated") {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    background-color: ${type === "user" ? "#DFE1E7" : "#DBEAFE"};
    color: #666D80;
    border-radius: 12px;
    padding: 10px;
    margin-bottom: 5px;
    text-align: ${type === "user" ? "right" : "left"};
    max-width: 80%;
    align-self: ${type === "user" ? "flex-end" : "flex-start"};
    margin-left: ${type === "user" ? "auto" : "unset"};
  `;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function handleInsertClick() {
  if (!lastGeneratedMessage || !parentElement) return;

  const existingParagraph = parentElement.querySelector("p") || document.createElement("p");
  existingParagraph.textContent = lastGeneratedMessage;
  parentElement.appendChild(existingParagraph);

  parentElement.dispatchEvent(new Event("input", { bubbles: true }));
  insertBtn.style.display = "none";
  toggleModalVisibility(false);
}
