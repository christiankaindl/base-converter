'use strict';

var resultBox = document.getElementsByClassName('result-number'),
    resultBoxBase = [];

var addedCharacter = "",
    selectedBase,
    inputField = document.getElementById('number');

window.onload = function() {
    base.value = 10;
    selectedBase = 10;
    inputField.value = "";
    updateResultBoxArray();
};

// Initialize eventlistener
document.getElementById('add-base').addEventListener("click", addResultBox);
document.getElementById('base').addEventListener("change", updateBase);
inputField.addEventListener("paste", handlePaste);

// Is needed to detect which characters were added to the input field
// NOTE: In future it is possible to use InputEvent.data to get the added character, so this eventlistener would be obsolete. See input eventlistener.
inputField.addEventListener("keypress", keyInput);

// Handles all input to the number input field
// NOTE: In future it is possible to use InputEvent.data to get the added character, so it would not be necessary to use an keypress eventlistener
inputField.addEventListener("input", inputHandler);

function keyInput(e) {
    var addedCharacter = (e.charCode == 0) ? '-1' : String.fromCharCode(e.charCode);

    if (!e.ctrlKey) {
        if (!BaseConverter.validateNumber(addedCharacter)) {
            console.error("Character not allowed. Use digits 0-" + (selectedBase - 1));
            e.preventDefault();
        }
    }
}

// NOTE: keyInput() does get triggered before inputHandler()
function inputHandler(e) {
  console.log('resultBoxBase: ' + resultBoxBase);
    // create results
    let results = BaseConverter.convert(selectedBase, resultBoxBase, this.value);

    // add results to the page
    for (var i = 0; i < resultBox.length; i++) {
        resultBox[i].innerHTML = results[i];
    }
}

function updateBase(e) {
    if (inputField.value != "") {
        inputField.value = BaseConverter.convert(selectedBase, this.value, inputField.value);
    }

    // Update to new Base
    selectedBase = this.value;
    inputField.placeholder = "Input (0-" + BaseConverter.getDigitCharacter(selectedBase - 1) + ")";
}

function handlePaste(e) {
    var pastedData = e.clipboardData.getData('text');

    if (!BaseConverter.validateNumber(pastedData, selectedBase)) {
        console.error("Pasted data is not allowed. Try to change the format");
        e.preventDefault();
    }
}

function enterEditMode(elem) {
    if (elem.parentNode.className !== "expanded") {
        elem.parentNode.className = "expanded";
        elem.focus();
    }
}

function leaveEditMode(button) {
    if (button.parentNode.className == "expanded") {
        button.parentNode.className = "";
    }
    updateResultBoxArray();
    inputField.focus();
}

function removeResultBox(elem) {
    elem.parentNode.parentNode.removeChild(elem.parentNode);
    updateResultBoxArray();
}

function addResultBox(e) {
    var newListItem = document.createElement('LI'),
        baseElement = document.createElement('DIV'),
        numberElement = document.createElement('DIV'),
        deleteButton = document.createElement('DIV'),
        deleteImage = document.createElement('IMG'),
        dividerImage = document.createElement('IMG');

    deleteImage.setAttribute('src', 'delete.svg');
    deleteButton.appendChild(deleteImage);
    deleteButton.setAttribute('class', 'delete-button');
    deleteButton.setAttribute('onclick', 'removeResultBox(this);');

    baseElement.setAttribute('class', 'result-base');
    numberElement.setAttribute('class', 'result-number');
    dividerImage.setAttribute('src', 'divider-arrow.png');

    newListItem.appendChild(baseElement);
    newListItem.appendChild(dividerImage);
    newListItem.appendChild(numberElement);
    newListItem.appendChild(deleteButton);

    document.getElementsByClassName('results')[0].appendChild(newListItem);
}

function updateResultBoxArray() {
    for (var i = 0; i < resultBox.length; i++) {
        resultBoxBase[i] = document.getElementsByClassName('result-base')[i].innerHTML;

        // NOTE: At some point there could be the need for a config file, to allow changes in the markup let the code untouched
    }
}
