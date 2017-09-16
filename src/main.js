'use strict';

const {h, app} = hyperapp;
console.log("TRADUBLBEBMD");

const resultBox = (number, base, targetBase, remove) => {
  console.log("BLOOO");
  return h("li", {class: "result-box"},[
    h("div", {class: "result-box-base"}, targetBase),
    h("div", {class: "result-box-number"}, Base.convert(base, targetBase, number)),
    h("button", {class: "result-box-delete-button", onclick: (e) => {remove(e.target)}})
  ]);

}


const emit = app({
  // IDEA: Use setter for base so when base state is changed number gets updated automagically
  state: {
    number: 123,
    base: 10,
    outputTargets: [2, 8, 16]
  },
  view: (state, actions) => {
    return h("div", {class: "hyperapp"}, [
      h("section", {id: "input"}, [
        h("h1", {}, "Convert numbers between numerical systems."),
        h("label", {for: "number"}, "Number"),
        h("input", {oninput: (e) => emit("input", e.target.value), id: "input-number", type: "text", name: "number", autofocus: "", value: state.number}),
        h("span", {}, [
          h("label", {for: "base"}, "Base"),
          h("br"),
          h("span", {id: "current-base"}, state.base)
        ]),
        h("input", {id: "input-base", value: 10, type: "range", name: "base", min: "2", max: "36", step: "1", oninput: (e) => emit("base", e.target.value)})
        ]
      ),
      h("section", {id: "results"},
        h("ul", {}, state.outputTargets.map((i) => { return resultBox(state.number, state.base, i, actions.removeResultBox);}))
      ),
      h("button", {onclick: (e) => {actions.addResultBox()}}, "ADD")
    ]);
    },
  actions: {
    setInput(state, actions, number) {
      return {number: number};
    },
    setBase(state, actions, base) {
      return {
        base: base,
        number: Base.convert(state.base, base, state.number)
      };
    },
    checkInput(state, actions, input) {
      if (Base.validateNumber(input, state.base))
        return {number: input};

      actions.giveErrorMessage(input);
    },
    inputBaseChange(state, actions, e) {
      console.log(e.target.value);
      console.log(state.number);
      return {
        base: e.target.value,
        number: Base.convert(state.base, e.target.value, state.number)
      };
    },
    addResultBox(state) {
      console.log(state.outputTargets.unshift(5));
      return {
        outputTargets: state.outputTargets
      }
    },
    removeResultBox(state, actions, target) {
      console.log(target.parentNode);
      var base = target.parentElement.getElementsByClassName('result-box-base')[0].textContent,
        position = state.outputTargets.indexOf(Number(base));

      // splice() modyfies the array directly and returns the deleted element
      state.outputTargets.splice(position, 1);

      return {
        outputTargets: state.outputTargets
      };
    },
    convertInput(state, actions, value){
      console.log(value);
        return {number: value};
    },
    giveErrorMessage(state, actions, input) {
      console.log("WRONG!");
    }

  },
  events: {
    input(state, {setInput: setInput}, number) {
      if (!Base.validateNumber(number, state.base))
        return;

      setInput(number);
    },
    base(state, {setBase: setBase}, base) {
      setBase(base);
    },
    load(state, actions) {
      addEventListener("load", e => {
        var initValues = [1, 12, 123, 1234];

        function setInitValue(i = 0) {
          console.log(i);
          if(i >= 4)
            return;

          actions.setInput(initValues[i]);
          setTimeout((i) => {setInitValue(i)}, 250, ++i);
        }

        setInitValue();
      });
    }
  },
  root: document.getElementById("main")
});
/*
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
    if (!Base.validateNumber(addedCharacter)) {
      console.error("Character not allowed. Use digits 0-" + (selectedBase - 1));
        e.preventDefault();
    }
  }
}

// NOTE: keyInput() does get triggered before inputHandler()
function inputHandler(e) {
  // create results
  let results = Base.convert(selectedBase, resultBoxBase, this.value);

  // add results to the page
  for (var i = 0; i < resultBox.length; i++) {
    resultBox[i].innerHTML = results[i];
  }
}

function updateBase(e) {
  if (inputField.value != "") {
    inputField.value = Base.convert(selectedBase, this.value, inputField.value);
  }

  // Update to new Base
  selectedBase = this.value;
  inputField.placeholder = "Input (0-" + Base.getNumberCharacter(selectedBase - 1) + ")";

  document.querySelector('label[for="base"]').innerHTML = selectedBase;
}

function handlePaste(e) {
  var pastedData = e.clipboardData.getData('text');

  if (!Base.validateNumber(pastedData, selectedBase)) {
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

  numberElement.innerHTML = Base.convert(selectedBase, base, inputField.value);
  document.getElementsByClassName('results')[0].appendChild(newListItem);
}

function updateResultBoxArray() {
  for (var i = 0; i < resultBox.length; i++) {
    resultBoxBase[i] = document.getElementsByClassName('result-base')[i].innerHTML;
  }
}

function addBase(e) {
  var base = document.getElementById('new-base').value.split(','),
      length = base.length;

  for (let i = 0; i < length; i++) {
    let help = Base.getNumberCharacter(base[i]);
    if (help && help != -1) {
      console.log(Base.getNumberCharacter(base[i]));
      addResultBox(base[i]);
    } else {
      let help = Base.getDigitValue(base[i]);

      if (help && help >= 2) {
        addResultBox(Base.getDigitValue(base[i])+1);
      }
    }
  }

  updateResultBoxArray();
  document.getElementById('new-base').value = "";

  document.getElementById('res').scrollTo({
    top: 8000,
    left: 0,
    behavior: 'smooth'
  });
}*/
