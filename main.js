'use strict';

var resultBox = document.getElementsByClassName('result-number'),
    resultBoxBase = [],
    addBaseButton = document.getElementById('add-base');

var addedCharacter = "",
    selectedBase,
    inputField = document.getElementById('number');

window.onload = function() {
    base.value = 10;
    selectedBase = 10;
    inputField.value = "";
    updateResultBoxArray();
};

// Initialize EventListener
document.getElementById('base').addEventListener("input", updateBase);
addBaseButton.addEventListener('click', addBase);
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

    document.querySelector('label[for="base"]').innerHTML = selectedBase;
}

function handlePaste(e) {
    var pastedData = e.clipboardData.getData('text');

    if (!BaseConverter.validateNumber(pastedData, selectedBase)) {
        console.error("Pasted data is not allowed. Try to change the format");
        e.preventDefault();
    }
}

function removeResultBox(elem) {
    elem.parentNode.parentNode.removeChild(elem.parentNode);
    updateResultBoxArray();
}

function addResultBox(base) {
    var newListItem = document.createElement('LI'),
        baseElement = document.createElement('DIV'),
        numberElement = document.createElement('DIV'),
        deleteButton = document.createElement('DIV'),
        deleteImage = document.createElement('IMG'),
        dividerImage = document.createElement('IMG'),
        textNode = document.createTextNode(base + '');

    deleteImage.setAttribute('src', 'delete.png');
    deleteButton.appendChild(deleteImage);
    deleteButton.setAttribute('class', 'delete-button');
    deleteButton.setAttribute('onclick', 'removeResultBox(this);');

    baseElement.setAttribute('class', 'result-base');
    baseElement.appendChild(textNode);
    numberElement.setAttribute('class', 'result-number');
    dividerImage.setAttribute('src', 'divider-arrow.png');
    dividerImage.setAttribute('class', 'divider-arrow');

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

function addBase(e) {
    var base = document.getElementById('new-base').value.split(',');

    for (let i = 0; i < base.length; i++) {
        let help = BaseConverter.getDigitCharacter(base[i]);
        if (help && help >= 2) {
            console.log(BaseConverter.getDigitCharacter(base[i]));
            addResultBox(base[i]);
            updateResultBoxArray();
        } else {
            let help = BaseConverter.getDigitValue(base[i]);

            if (help && help >= 2) {
                addResultBox(BaseConverter.getDigitValue(base[i]));
                updateResultBoxArray();
            }
        }
    }

    document.getElementById('new-base').value = "";
}
