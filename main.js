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
    if (e.charCode == 0) {
        addedCharacter = -1;
    } else {
        addedCharacter = String.fromCharCode(e.charCode);
    }
}

function inputHandler(e) {
    let digit = addedCharacter;
    // create results
    let results = BaseConverter.convert(selectedBase, resultBoxBase, this.value);

    // add results to the page
    if (results == false) {
        console.error("Character not allowed. Use digits 0-"+ (selectedBase-1));
    } else {
        for (var i = 0; i < resultBox.length; i++) {
            resultBox[i].innerHTML = results[i];
        }
    }
}

function updateBase(e) {
    if (inputField.value != "") {
        inputField.value = BaseConverter.convert(selectedBase, this.value, inputField.value);
    }

    // Update to new Base
    selectedBase = this.value;
    inputField.placeholder = "Use digits 0-" + BaseConverter.getDigitCharacter(selectedBase - 1);
}

function handlePaste(e) {
    e.preventDefault();
    var pastedData = e.clipboardData.getData('text');

    if (BaseConverter.validateNumber(pastedData, selectedBase)) {
        this.value = this.value + pastedData;
    } else {
        console.error("Pasted data is not allowed. Try to change the format");
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
    var newListItem = document.createElement('LI');
    var baseValue = "5";
    var baseElement = document.createElement('INPUT');
    var textElement = document.createElement('DIV');
    var doneButton = document.createElement('DIV');
    var deleteButton = document.createElement('DIV');
    var doneImage = document.createElement('IMG');
    var deleteImage = document.createElement('IMG');

    deleteImage.setAttribute('src', 'delete.svg');
    doneImage.setAttribute('src', 'done.svg');

    doneButton.appendChild(doneImage);
    deleteButton.appendChild(deleteImage);
    doneButton.setAttribute('class', 'edit-mode done-button');
    deleteButton.setAttribute('class', 'edit-mode delete-button');
    doneButton.setAttribute('onclick', 'leaveEditMode(this);');
    deleteButton.setAttribute('onclick', 'removeResultBox(this);');


    baseElement.setAttribute('class', 'result-base');
    baseElement.setAttribute('type', 'text');
    baseElement.setAttribute('value', '--');
    baseElement.setAttribute('onfocus', 'enterEditMode(this);')
    textElement.setAttribute('class', 'result-number');

    baseElement.innerHTML = baseValue;
    textElement.innerHTML = "";

    newListItem.appendChild(doneButton);
    newListItem.appendChild(deleteButton);
    newListItem.appendChild(baseElement);
    newListItem.appendChild(textElement);

    console.log(newListItem);
    document.getElementsByClassName('results')[0].appendChild(newListItem);

    baseElement.focus();
}

function updateResultBoxArray() {
    for (var i = 0; i < resultBox.length; i++) {
        resultBoxBase[i] = document.getElementsByClassName('result-base')[i].value;
    }
}

//----- BASE CONVERTER CORE -----//
/**
This function receives a number and the base from which the number comes from.
It then chops the received number apart and multiplies the value of the digit with the place value to produce the base ten result.
*/
