"use strict";

const { h, app } = hyperapp;

// Component
const resultBox = (number = 0, base, targetBase) => {
  // console.log(number);
  // console.log(Base.convert(base, targetBase, number));
  return h(
    "li",
    { class: "result" },
    h("output", { for: "input-number" }, [
      h(
        "span",
        { class: "result-number" },
        Base.convert(base, targetBase, number)
      ),
      h("sub", { class: "result-base", base: targetBase }, targetBase)
    ])
  );
};

// Component
const baseDropdown = (state, actions, type) => {
  return h(
    "select",
    {
      onchange: e => {
        actions.updateBase({ newBase: Number(e.target.value), type: type });
      }
    },
    [
      h("option", { value: 2 }, "Base 2"),
      h("option", { value: 3 }, "Base 3"),
      h("option", { value: 4 }, "Base 4"),
      h("option", { value: 5 }, "Base 5"),
      h("option", { value: 6 }, "Base 6"),
      h("option", { value: 7 }, "Base 7"),
      h("option", { value: 8 }, "Base 8"),
      h("option", { value: 9 }, "Base 9"),
      h(
        "option",
        { value: 10, selected: type == "from" ? "selected" : "" },
        "Base 10"
      ),
      h("option", { value: 11 }, "Base 11"),
      h("option", { value: 12 }, "Base 12"),
      h("option", { value: 13 }, "Base 13"),
      h("option", { value: 14 }, "Base 14"),
      h("option", { value: 15 }, "Base 15"),
      h(
        "option",
        { value: 16, selected: type == "to" ? "selected" : "" },
        "Base 16"
      ),
      h("option", { value: 17 }, "Base 17"),
      h("option", { value: 18 }, "Base 18"),
      h("option", { value: 19 }, "Base 19"),
      h("option", { value: 20 }, "Base 20"),
      h("option", { value: 21 }, "Base 21"),
      h("option", { value: 22 }, "Base 22"),
      h("option", { value: 23 }, "Base 23"),
      h("option", { value: 24 }, "Base 24"),
      h("option", { value: 25 }, "Base 25"),
      h("option", { value: 26 }, "Base 26"),
      h("option", { value: 27 }, "Base 27"),
      h("option", { value: 28 }, "Base 28"),
      h("option", { value: 29 }, "Base 29"),
      h("option", { value: 30 }, "Base 30"),
      h("option", { value: 31 }, "Base 31"),
      h("option", { value: 32 }, "Base 32"),
      h("option", { value: 33 }, "Base 33"),
      h("option", { value: 34 }, "Base 34"),
      h("option", { value: 35 }, "Base 35"),
      h("option", { value: 36 }, "Base 36")
    ]
  );
};

const state = {
  number: 42,
  base: 10,
  error: false,
  outputTargets: [16]
};

const actions = {
  input: number => state => {
    if (number === "") number = 42;

    return {
      number: number,
      error: !Base.validateNumber(number, state.base)
    };
  },
  updateBase: ({ newBase, type }) => state => {
    if (type === "to") {
      let index = state.outputTargets.indexOf(newBase);
      if (index != -1) state.outputTargets.splice(index, 1);

      state.outputTargets.unshift(newBase);

      return {
        outputTargets: state.outputTargets
      };
    } else if (type === "from") {
      return {
        number: Base.convert(state.base, newBase, state.number),
        base: newBase
      };
    }

    console.error(
      "Missig base type. It can be one of the following: 'to' or 'from'"
    );
  }
};

const view = (state, actions) => {
  return h("div", { id: "hyperapp" }, [
    h("section", { id: "input" }, [
      h("span", {
        contenteditable: "true",
        oninput: e => actions.input(e.target.textContent),
        placeholder: "42",
        class: state.error ? "error" : "",
        id: "input-number",
        autofocus: "autofocus"
      }),
      h("sub", {}, state.base)
    ]),
    h("div", { id: "from-to" }, [
      h("span", {}, "from"),
      baseDropdown(state, actions, "from"),
      h("span", {}, "to"),
      baseDropdown(state, actions, "to")
    ]),
    h("section", { id: "results" }, [
      h(
        "span",
        {},
        h("b", {}, state.number, h("sub", {}, state.base)),
        " results in"
      ),
      h(
        "ul",
        {},
        state.outputTargets.map(i => {
          return resultBox(state.number, state.base, i);
        })
      )
    ])
  ]);
};

const main = app(state, actions, view, document.getElementById("main"));

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service_worker.js", {scope: '/base-converter/'})
    .then(worker => {
      if (worker.installing) {
        console.log("Service worker installing");
      } else if (worker.waiting) {
        console.log("Service worker installed");
      } else if (worker.active) {
        console.log("Service worker active");
      }
    })
    .catch(err => {
      console.error(err);
    });
}
