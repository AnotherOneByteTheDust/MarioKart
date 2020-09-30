import items from "../assets/img/item*.png";

export default class ItemKart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.item = Math.round(Math.random() * Object.keys(items).length + 0.5);
    this.img = items[this.item];
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML += `
    <style>${this.styles}</style>
    <img src="${this.img}">
    `;
  }

  get styles() {
    return `
        :host {
            position: absolute;
            top: -30px;
            left: 30px;
        }
        img {
            height: 32px;
            filter: drop-shadow(0px 0px 10px black);
        }
    `;
  }

  get item() {
    return this.getAttribute("item");
  }

  set item(n) {
    this.setAttribute("item", n);
  }
}

customElements.define("item-kart", ItemKart);
