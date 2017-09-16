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
        h("input", {id: "input-base", value: state.base, type: "range", name: "base", min: "2", max: "36", step: "1", oninput: (e) => emit("base", e.target.value)})
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
    input(state, {setInput: setInput}, number) {
      if (!Base.validateNumber(number, state.base))
        return;

      setInput(number);
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

          setInput(initValues[i]);
          setTimeout((i) => {setInitValue(i)}, 250, ++i);
        }

        setInitValue();
      });
    }
  },
  root: document.getElementById("main")
});
