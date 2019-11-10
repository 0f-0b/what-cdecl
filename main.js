const e = React.createElement;

function randomElement(arr) {
  return arr[Math.trunc(Math.random() * arr.length)];
}

const primitives = [
  "char",
  "short",
  "int",
  "long",
  "signed char",
  "unsigned char",
  "unsigned short",
  "unsigned",
  "unsigned long",
  "float",
  "double",
  "long double"
];

function highlight(str, type) {
  return e("span", { className: type }, str);
}

function addParentheses(before, after) {
  if (before[before.length - 1] !== "*") return;
  before.push("(");
  after.push(")");
}

class PointerLayer {
  constructor() { }

  static create() {
    return new PointerLayer;
  }

  apply(before) {
    before.push("*");
  }
}

class ArrayLayer {
  constructor(length) {
    this.length = length;
  }

  static create() {
    return new ArrayLayer(Math.trunc(Math.random() * 8) + 2);
  }

  apply(before, after) {
    addParentheses(before, after);
    after.push("[", highlight(this.length, "hl-number"), "]");
  }
}

class FunctionLayer {
  constructor(args) {
    this.args = args;
  }

  static create() {
    return new FunctionLayer(Array.from({ length: Math.trunc(Math.random() * 4) }, () => randomElement(primitives)));
  }

  apply(before, after) {
    addParentheses(before, after);
    after.push("(");
    const args = this.args;
    const argCount = args.length;
    if (argCount) {
      after.push(highlight(args[0], "hl-type"));
      for (let i = 1; i < argCount; i++)
        after.push(", ", highlight(args[i], "hl-type"));
    }
    after.push(")");
  }
}

const next = {
  [PointerLayer]: [PointerLayer, ArrayLayer, FunctionLayer],
  [ArrayLayer]: [PointerLayer, ArrayLayer],
  [FunctionLayer]: [PointerLayer],
};

function randomLayers(size) {
  const result = [];
  for (let i = 0; i < size; i++)
    result.push(randomElement(next[result[i - 1] || PointerLayer]));
  return result.map(layer => layer.create());
}

class Cdecl extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { name, root, layers } = this.props;
    const before = [];
    const after = [];
    for (const layer of layers)
      layer.apply(before, after);
    return e("code", null,
      highlight("typedef", "hl-keyword"),
      " ",
      highlight(root, "hl-type"),
      " ",
      ...before.reverse(),
      highlight(name, "hl-variable"),
      ...after,
      ";");
  }
}

class LayersInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { name, root, layers, expected, available, onUpdate } = this.props;
    const descriptions = new Map;
    for (const [type, , description] of available)
      descriptions.set(type, description);
    return e("div", null,
      e("span", { className: layers.length === expected.length && layers.every((layer, index) => layer === expected[index]) ? "correct" : null },
        "instances of ",
        e("var", null, e("code", null, name)),
        " are ",
        layers.map((layer, index) => e("button", {
          key: index,
          class: "layer removable",
          onClick: () => {
            layers.splice(index, 1);
            return onUpdate(layers);
          }
        }, descriptions.get(layer))),
        e("code", null, root),
        "s"),
      e("br"),
      e("span", null, available.map((layer, index) => e("button", {
        key: index,
        class: "layer insertable",
        onClick: () => {
          layers.push(layer[0]);
          onUpdate(layers);
        }
      }, layer[1]))));
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.reset();
  }

  render() {
    const { difficulty, name, root, layers, inputLayers } = this.state;
    const expected = layers.map(layer => layer.constructor);
    return e("center", null,
      e("h1", null, "What cdecl?"),
      e(Cdecl, { name, root, layers }),
      e(LayersInput, {
        name,
        root,
        layers: inputLayers,
        expected,
        available: [
          [PointerLayer, "pointer", "pointers to"],
          [ArrayLayer, "array", "arrays of"],
          [FunctionLayer, "function", "functions returning"]
        ],
        onUpdate: layers => this.setState({ inputLayers: layers })
      }),
      "difficulty: ",
      e("input", {
        type: "number",
        value: difficulty,
        min: 1,
        max: 0x80000000,
        step: 1,
        onChange: event => {
          const newDifficulty = event.target.valueAsNumber;
          if (Number.isInteger(newDifficulty) && newDifficulty > 0 && newDifficulty <= 0x80000000)
            this.setState(this.reset(newDifficulty));
        }
      }),
      e("button", { className: "button", onClick: () => this.setState({ inputLayers: expected }) }, "show solution"),
      e("button", { className: "button", onClick: () => this.setState(this.reset(difficulty)) }, "another one"));
  }

  reset(difficulty = 6) {
    return {
      difficulty,
      name: "my_type",
      root: randomElement(primitives),
      layers: randomLayers(difficulty),
      inputLayers: []
    };
  }
}

ReactDOM.render(e(App), document.getElementById("app"));
