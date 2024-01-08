const toolButtons = document.querySelectorAll(".editor-tool-btn");
const textArea = document.querySelector(".editor-textarea");
const linkPopup = document.querySelector(".editor-tool-link");
const imagePopup = document.querySelector(".editor-tool-image");
let globalCaretPos;

// events
toolButtons.forEach((btn) => {
  btn.addEventListener("click", handleToolClick);
});

["mouseup", "keyup", "selectionchange"].forEach((e) => {
  textArea.addEventListener(e, handleSelection);
});

// functions
function handleToolClick(e) {
  const btn = e.target.dataset["command"] ? e.target : e.target.parentNode;
  const command = btn.dataset["command"];

  // color buttons
  if (btn.classList.contains("editor-tool-color")) {
    handleColorTool(btn);
  }

  // copy baste buttons
  else if (command == "paste") {
    handlePaste();
  } else if (command == "copy") {
    // get text representation of clipboard
    handleCopy(command);
    // console.log(clipboardText)
  }

  // undo and redo buttons
  else if (command == "undo" || command == "redo") {
    handleUndoRedo(command);
  }

  // Spell Check
  else if (command == "toggleSpellCheck") {
    toggleSpellCheck();
  }

  // urls
  else if (command == "createLink") {
    handleLinkCreate();
  }

  // images
  else if (command == "insertImage") {
    handleImageInsert();
  }

  // general buttons
  else {
    document.execCommand(command);
  }
  handleSelection();
}

function handleImageInsert() {
  globalCaretPos = getCaretPosition();
  textArea.focus();
  event.stopPropagation();
}

function handleLinkCreate() {
  globalCaretPos = getCaretPosition();
  textArea.focus();
  event.stopPropagation();
}

function handleUndoRedo(command) {
  document.execCommand(command);
  window.getSelection().removeAllRanges();
}

function handleCopy(command) {
  clipboardText = document.queryCommandValue("copy");
  document.execCommand(command);
  console.log(document.queryCommandValue("copy"));
  // console.log(document.queryCommandText('copy'))
  console.log(document.queryCommandEnabled("copy"));
  console.log(document.queryCommandState("copy"));
}

function handlePaste() {
  textArea.focus();
  // insert text manually
  document.execCommand("insertHTML", false, clipboardText);
  console.log(clipboardText);
}

function handleColorTool(btn) {
  const colorInput = btn.querySelector(".color-input");
  const colorIcon = btn.querySelector("i");
  colorIcon.addEventListener("click", () => {
    colorInput.click();
  });
  colorInput.addEventListener("input", () => {
    //   colorIcon.style.borderColor = colorInput.value;
    document.execCommand(btn.dataset["command"], false, colorInput.value);
  });
}

function handleSelection() {
  toolButtons.forEach(function (btn) {
    updateUi(btn);
  });
}

function toggleSpellCheck() {
  textArea.spellcheck = !textArea.spellcheck;
}

function updateUi(btn) {
  const command = btn.dataset["command"];

  // spell check
  if (command == "toggleSpellCheck") {
    if (textArea.spellcheck) {
      btn.classList.add("editor-tool-btn-active");
    } else {
      btn.classList.remove("editor-tool-btn-active");
    }
  }

  // color
  else if (btn.classList.contains("editor-tool-color")) {
    const colorInput = btn.querySelector(".color-input");
    const colorIcon = btn.querySelector("i");
    colorIcon.style.borderColor = document.queryCommandValue(command);
  }

  // else
  else {
    if (document.queryCommandState(command)) {
      btn.classList.add("editor-tool-btn-active");
    } else {
      btn.classList.remove("editor-tool-btn-active");
    }
  }
  textArea.focus();
}

function handleLinkCreation(linkText, linkUrl) {
  let linkObj = `<a contenteditable="false" href="${linkUrl}">${linkText}</a>`;
  setCurrentCursorPosition(globalCaretPos);
  document.execCommand("insertHTML", false, linkObj);
}

function handleImageUrl(imageUrl) {
  console.log(imageUrl);
  setCurrentCursorPosition(globalCaretPos);
  document.execCommand("insertImage", false, imageUrl);
}
async function handleImageUpload(imageFile) {
  showLoadingSpinner();
  let imageUrl = await uploadImage(imageFile);
  handleImageUrl(imageUrl);
  hideLoadingSpinner();
}
async function uploadImage(imageFile) {
  let formData = new FormData();
  formData.append("key", "4ac3f8be6f3564b8243f01d3e2c268d2");
  formData.append("image", imageFile);
  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });
  const responseJson = await response.json();
  const url = await responseJson.data["display_url"];
  return url;
}
function showLoadingSpinner() {
  document.querySelector(".loader-overlay").style.display = "flex";
}
function hideLoadingSpinner() {
  document.querySelector(".loader-overlay").style.display = "none";
}
// disgusting caret position functions

function getCaretPosition() {
  textArea.focus();
  let _range = document.getSelection().getRangeAt(0);
  let range = _range.cloneRange();
  range.selectNodeContents(textArea);
  range.setEnd(_range.endContainer, _range.endOffset);
  return range.toString().length;
}

function createRange(node, chars, range) {
  if (!range) {
    range = document.createRange();
    range.selectNode(node);
    range.setStart(node, 0);
  }

  if (chars.count === 0) {
    range.setEnd(node, chars.count);
  } else if (node && chars.count > 0) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.length < chars.count) {
        chars.count -= node.textContent.length;
      } else {
        range.setEnd(node, chars.count);
        chars.count = 0;
      }
    } else {
      for (var lp = 0; lp < node.childNodes.length; lp++) {
        range = createRange(node.childNodes[lp], chars, range);

        if (chars.count === 0) {
          break;
        }
      }
    }
  }

  return range;
}

function setCurrentCursorPosition(chars) {
  if (chars >= 0) {
    var selection = window.getSelection();

    range = createRange(textArea, {
      count: chars,
    });

    if (range) {
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}
