'use strict';

const {h, app} = hyperapp;

// Component
const resultBox = (number, base, targetBase, remove) => {
  return h("li", {class: "result"},[
    h("span", {class: "result-number"}, Base.convert(base, targetBase, number)),
    h("sub", {class: "result-base", base: targetBase}, targetBase)
  ]);
}

const baseDropdown = (state, actions, type) => {
  return h("select", {onchange: (e) => {return type=="base" ? {outputTargets: state.outputTargets.unshift(e.target.value)} : {number: Base.convert(state.base, e.target.value, state.number)}}}, [
    h("option", {value: 2}, "Base 2"),
    h("option", {value: 8}, "Base 8"),
    h("option", {value: 10, selected: (type!=="base" ? "selected" : "")}, "Base 10"),
    h("option", {value: 16, selected: (type=="base" ? "selected" : "")}, "Base 16")
  ]);
}

const emit = app({
  // IDEA: Use setter for base so when base state is changed number gets updated automagically
  state: {
    number: "",
    base: 10,
    error: false,
    outputTargets: [8],
    newBase: ""
  },

  view: (state, actions) => {
    return h("div", {id: "hyperapp"}, [
      h("section", {id: "input"}, [
        h("input", {oninput: (e) => emit("input", e.target.value), placeholder: "Type a number", class: state.error?"error":"", id: "input-number", type: "text", name: "number", autofocus: "", value: state.number}),
        h("sub", {}, state.base)]
      ),
      h("div", {id: "from-to"}, [
        h("span", {}, "from"),
        baseDropdown(state, actions),
        h("span", {}, "to"),
        baseDropdown(state, actions, "base")
      ]),
      h("section", {id: "results"}, [
        h("ul", {}, state.outputTargets.map((i) => { return resultBox(state.number, state.base, i, actions.removeResultBox);}))
      ])
    ]);
  },

  actions: {
    setInput(state, actions, {number, error = false}) {
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
    addResultBox(state, actions, e) {
      var inputField = e.target.parentElement.getElementsByTagName("input")[0];

      state.outputTargets.push(inputField.value);
      return {
        outputTargets: state.outputTargets
      }
    },
    removeResultBox(state, actions, target) {
      var base = target.parentElement.getElementsByClassName('result-box-base')[0].getAttribute("base"),
        position = state.outputTargets.indexOf(Number(base));

      // splice() modyfies the array directly and returns the deleted element
      state.outputTargets.splice(position, 1);

      return {
        outputTargets: state.outputTargets
      };
    },
    addBase() {
      console.log("blub");
      return {
        addBaseDialog: true
      };
    }
  },

  events: {
    input(state, {setInput: setInput, invalidInput: invalidInput}, number) {
      console.log(number);
      var error = !Base.validateNumber(number, state.base);
      setInput({
        number: number,
        error: error
      });
    },
    base(state, {setBase: setBase}, base) {
      setBase(base);
    },
  },

  root: document.getElementById("main")
});
