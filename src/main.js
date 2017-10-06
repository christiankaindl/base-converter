'use strict';

const {h, app} = hyperapp;

// Component
const resultBox = (number, base, targetBase) => {
  return h("li", {class: "result"},[
    h("span", {class: "result-number"}, Base.convert(base, targetBase, number)),
    h("sub", {class: "result-base", base: targetBase}, targetBase)
  ]);
}

// Component
const baseDropdown = (state, actions, type) => {
  return h("select", {onchange: (e) => {console.log("TYPE2", type);actions.setBase({base: e.target.value, type: type})}}, [
    h("option", {value: 2}, "Base 2"),
    h("option", {value: 8}, "Base 8"),
    h("option", {value: 10, selected: (type!=="base" ? "selected" : "")}, "Base 10"),
    h("option", {value: 16, selected: (type=="base" ? "selected" : "")}, "Base 16")
  ]);
}

const emit = app({
  // IDEA: Use setter for base so when base state is changed number gets updated automagically
  state: {
    number: 42,
    base: 10,
    error: false,
    outputTargets: [16]
  },

  view: (state, actions) => {
    return h("div", {id: "hyperapp"}, [
      h("section", {id: "input"}, [
        h("input", {oninput: (e) => emit("input", e.target.value), placeholder: "Type a number", class: state.error?"error":"", id: "input-number", type: "text", name: "number", autofocus: "", value: state.number}),
        h("sub", {}, state.base)]
      ),
      h("div", {id: "from-to"}, [
        h("span", {}, "from"),
        baseDropdown(state, actions, "number"),
        h("span", {}, "to"),
        baseDropdown(state, actions, "base")
      ]),
      h("section", {id: "results"}, [
        h("ul", {}, state.outputTargets.map((i) => {return resultBox(state.number, state.base, i);}))
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
    setBase(state, actions, {base, type}) {
      console.log("TYPE:", type);
      console.log("BASE:", base);
      return type=="base" ? (() => {
        state.outputTargets.unshift(Number(base));
        return {
          outputTargets: state.outputTargets
        }
      })() : {
        number: Base.convert(state.base, base, state.number),
        base: base
      };

    }
  },

  events: {
    input(state, {setInput: setInput, invalidInput: invalidInput}, number) {
      var error = !Base.validateNumber(number, state.base);
      setInput({
        number: number,
        error: error
      });
    },
    base(state, {setBase: setBase}, type, base) {

      setBase(base, type);
    },
  },

  root: document.getElementById("main")
});
