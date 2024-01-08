let directParent = window.getSelection().getRangeAt(0).commonAncestorContainer
let isParentElement = (directParent.nodeType == 1)
let parent = isParentElement ? directParent : directParent.parentNode
let shouldcloneParent = !Boolean(parent.getAttribute('contenteditable'))

let selectionContent = window.getSelection().getRangeAt(0).cloneContents();
let elementOfSelection = shouldcloneParent ? parent.cloneNode(false).appendChild(selectionContent) : selectionContent

console.log(selectionContent)
console.log(elementOfSelection)
console.log(elementToHtml(elementOfSelection))
console.log(elementToHtml(document.createElement('p')));



let wrappedselectionContent = '<span style="color:green;">'+elementToHtml(elementOfSelection)+'</span>';


// document.execCommand('insertHTML', false, wrappedselectionContent);


function elementToHtml(element) {
    return document.createElement('div').appendChild(element).innerHTML
}