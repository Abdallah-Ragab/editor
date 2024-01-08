let modalTriggers = document.querySelectorAll("[modal-trigger]");
let modalOverlays = document.querySelectorAll(".modal");
let modalBoxs = document.querySelectorAll(".modal-box");
let modalHideTriggers = document.querySelectorAll("[modal-hide-trigger]");
let modalSubmits = document.querySelectorAll("[modal-submit]");
modalTriggers.forEach(function (modalTrigger) {
  modalTrigger.addEventListener("click", (e) => {
    document
      .querySelector(`[modal-id=${e.target.getAttribute("modal-trigger")}]`)
      .classList.add("modal-visible");
  });
});
modalOverlays.forEach(function (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    closeModal(modalOverlay);
  });
});
modalBoxs.forEach(function (modalBox) {
  modalBox.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});
modalHideTriggers.forEach(function (modalHideTrigger) {
  modalHideTrigger.addEventListener("click", (e) => {
    closeModal(modalHideTrigger.closest(".modal"));
  });
});
modalSubmits.forEach(function (modalSubmit) {
  modalSubmit.addEventListener("click", (e) => {
    submitModal(modalSubmit.closest(".modal"));
  });
});

function closeModal(modal) {
  modal.classList.remove("modal-visible");
  modal.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
}
// function submitModal(modal) {
//   let imageField = modal.querySelector("input[type='file']");
//   let isImage = !!imageField;

//   let inputValues = [];
//   modal.querySelectorAll("input[type='text']").forEach((input) => {
//     let name = input.name;
//     let value = input.value;
//     inputValues.push({ name: name, value: value });
//   });

//   if (isImage) {
//     let imageFile = imageField.files[0];
//     if (imageFile) {
//       handleImageUpload(imageFile);
//       console.log(imageFile.name);
//     } else {
//       let imageUrl = inputValues.filter((input) => input.name == "image-url']")[0]
//         .value;
//       handleImageUrl(imageUrl);
//     }
//   } else {
//     let linkUrl = inputValues.filter((input) => input.name == "link-url")[0]
//       .value;
//     let linkText = inputValues.filter((input) => input.name == "link-text")[0]
//       .value;
//     handleLinkCreation(linkText, linkUrl);
//     closeModal(modal);
//   }
// }
function submitModal(modal) {
  let imageField = modal.querySelector("input[type='file']");
  // if image insertion
  if (imageField) {
    console.log("img");

    let imageFile = imageField.files[0];
    if (imageField && imageFile) {
      handleImageUpload(imageFile);
    } else if (imageField && !imageFile) {
      let imageUrl = modal.querySelector("input[name='image-url']").value;
      handleImageUrl(imageUrl);
    }
  } else {
    console.log("text");
    let linkUrl = modal.querySelector("input[name='link-url']").value;
    let linkText = modal.querySelector("input[name='link-text']").value;
    if (!linkUrl.includes("http://") && !linkUrl.includes("https://")) {
      linkUrl = "https://" + linkUrl;
    } else {
    }
    console.log(linkText);
    console.log(linkUrl);
    handleLinkCreation(linkText, linkUrl);
  }
  closeModal(modal);
}
