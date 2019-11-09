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

class PointerLayer {
  constructor() { }

  static create() {
    return new PointerLayer;
  }

  apply(s) {
    return "*" + s;
  }
}

class ArrayLayer {
  constructor(length) {
    this.length = length;
  }

  static create() {
    return new ArrayLayer(Math.trunc(Math.random() * 8) + 2);
  }

  apply(s) {
    if (s[0] == "*") s = `(${s})`;
    return s + (this.length ? `[${this.length}]` : "[]");
  }
}

class FunctionLayer {
  constructor(args) {
    this.args = args;
  }

  static create() {
    return new FunctionLayer(Array.from({ length: Math.trunc(Math.random() * 4) }, () => randomElement(primitives)));
  }

  apply(s) {
    if (s[0] == "*") s = `(${s})`;
    return s + `(${this.args.join(", ")})`;
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
    let str = name;
    for (const layer of layers)
      str = layer.apply(str);
    return e("code", null, `${root} ${str};`);
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
      e("span", null,
        e("var", null, name),
        " is ",
        layers.map((layer, index) => e("button", {
          key: index,
          class: "layer removable",
          onClick: () => {
            layers.splice(index, 1);
            return onUpdate(layers);
          }
        }, descriptions.get(layer))),
        e("code", null, root)),
      expected.every((layer, index) => layer === layers[index]) ? e("span", { className: "correct" }) : null,
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
    const { difficulty, root, layers, inputLayers } = this.state;
    return e("center", null,
      e("h1", null, "What cdecl?"),
      e(Cdecl, { name: "x", root, layers }),
      e(LayersInput, {
        name: "x",
        root,
        layers: inputLayers,
        expected: layers.map(layer => layer.constructor),
        available: [
          [PointerLayer, "pointer", "a pointer to"],
          [ArrayLayer, "array", "an array of"],
          [FunctionLayer, "function", "a function returning"]
        ],
        onUpdate: layers => this.setState({ inputLayers: layers })
      }),
      "difficulty: ",
      e("input", { type: "number", value: difficulty, min: 1, max: 100, onChange: event => this.setState(this.reset(event.target.valueAsNumber)) }),
      e("button", { className: "another", onClick: () => this.setState(this.reset(difficulty)) }, "another one"));
  }

  reset(difficulty = 6) {
    return {
      difficulty,
      root: randomElement(primitives),
      layers: randomLayers(difficulty),
      inputLayers: []
    };
  }
}

ReactDOM.render(e(App), document.getElementById("app"));
