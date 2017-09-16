'use strict';

const {h, app} = hyperapp;

// Component
const resultBox = (number, base, targetBase, remove) => {
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
    error: false,
    outputTargets: [2, 8, 16]
  },
  view: (state, actions) => {
    return h("div", {id: "hyperapp"}, [
      h("section", {id: "input"}, [
        h("h1", {}, "Convert numbers between numerical systems. Simply start by typing a number:"),
        h("label", {for: "number"}, "Number"),
        h("input", {oninput: (e) => emit("input", e.target.value), placeholder: "Stay cool!", class: state.error?"error":"", id: "input-number", type: "text", name: "number", autofocus: "", value: state.number}),
        h("span", {}, [
          h("label", {for: "base"}, "Base"),
          h("br"),
          h("span", {id: "current-base"}, state.base)
        ]),
        h("input", {id: "input-base", value: state.base, type: "range", name: "base", min: "2", max: "36", step: "1", oninput: (e) => emit("base", e.target.value)})
        ]
      ),
      h("section", {id: "results"}, [
        h("h1", {}, "Results"),
        h("ul", {}, state.outputTargets.map((i) => { return resultBox(state.number, state.base, i, actions.removeResultBox);}))
      ]),
      h("button", {onclick: (e) => {actions.addResultBox()}}, "ADD")
    ]);
  },
  actions: {
    setInput(state, actions, {number, error = false}) {
      //console.log(error);
      return {
        number: number,
        error: error
      };
    },
    setBase(state, actions, base) {
      return {
        base: base,
        number: Base.convert(state.base, base, state.number)
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
  },
  events: {
    input(state, {setInput: setInput, invalidInput: invalidInput}, number) {
      var error = !Base.validateNumber(number, state.base);

      console.log(error, " asdf");
      var lel = [number, error];
      setInput({
        number: number,
        error: error
      });
    },
    base(state, {setBase: setBase}, base) {
      setBase(base);
    },
    load(state, {setInput: setInput}) {
      addEventListener("load", e => {
        var initValues = [1, 12, 123, 1234];

        function setInitValue(i = 0) {
          if(i >= 4)
            return;

          setInput({number: initValues[i]});
          setTimeout((i) => {setInitValue(i)}, 250, ++i);
        }

        setInitValue();
      });
    }
  },
  root: document.getElementById("main")
});
