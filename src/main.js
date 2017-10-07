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
  return h("select", {onchange: (e) => {actions.updateBase({newBase: e.target.value, type: type})}}, [
    h("option", {value: 2}, "Base 2"),
    h("option", {value: 3}, "Base 3"),
    h("option", {value: 4}, "Base 4"),
    h("option", {value: 5}, "Base 5"),
    h("option", {value: 6}, "Base 6"),
    h("option", {value: 7}, "Base 7"),
    h("option", {value: 8}, "Base 8"),
    h("option", {value: 9}, "Base 9"),
    h("option", {value: 10, selected: (type=="from" ? "selected" : "")}, "Base 10"),
    h("option", {value: 11}, "Base 11"),
    h("option", {value: 12}, "Base 12"),
    h("option", {value: 13}, "Base 13"),
    h("option", {value: 14}, "Base 14"),
    h("option", {value: 15}, "Base 15"),
    h("option", {value: 16, selected: (type=="to" ? "selected" : "")}, "Base 16"),
    h("option", {value: 17}, "Base 17"),
    h("option", {value: 18}, "Base 18"),
    h("option", {value: 19}, "Base 19"),
    h("option", {value: 20}, "Base 20"),
    h("option", {value: 21}, "Base 21"),
    h("option", {value: 22}, "Base 22"),
    h("option", {value: 23}, "Base 23"),
    h("option", {value: 24}, "Base 24"),
    h("option", {value: 25}, "Base 25"),
    h("option", {value: 26}, "Base 26"),
    h("option", {value: 27}, "Base 27"),
    h("option", {value: 28}, "Base 28"),
    h("option", {value: 29}, "Base 29"),
    h("option", {value: 30}, "Base 30"),
    h("option", {value: 31}, "Base 31"),
    h("option", {value: 32}, "Base 32"),
    h("option", {value: 33}, "Base 33"),
    h("option", {value: 34}, "Base 34"),
    h("option", {value: 35}, "Base 35"),
    h("option", {value: 36}, "Base 36")
  ]);
}

app({
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
        h("span", {
          contenteditable: "true",
          oninput: (e) => actions.input(e.target.textContent),
          placeholder: "You are awesome!",
          class: state.error?"error":"",
          id: "input-number",
          autofocus: "autofocus"}, state.number),
        h("sub", {}, state.base)]
      ),
      h("div", {id: "from-to"}, [
        h("span", {}, "from"),
        baseDropdown(state, actions, "from"),
        h("span", {}, "to"),
        baseDropdown(state, actions, "to")
      ]),
      h("section", {id: "results"}, [
        h("span", {}, h("b", {}, state.number, h("sub", {}, state.base)), " reults in"),
        h("ul", {}, state.outputTargets.map((i) => {return resultBox(state.number, state.base, i);}))
      ])
    ]);
  },

  actions: {
    input(state, actions, number) {
      return {
        number: number || 0,
        error: !Base.validateNumber(number, state.base)
      };
    },
    updateBase(state, actions, {newBase, type}) {
      if (type === "to") {
        state.outputTargets.unshift(newBase);
        return {
          outputTargets: state.outputTargets
        };
      }

      else if (type === "from") {
        return {
          number: Base.convert(state.base, newBase, state.number),
          base: newBase
        };
      }

      console.error("Missig base type. It can be one of the following: 'to' or 'from'");
    }
  },

  root: document.getElementById("main")
});
