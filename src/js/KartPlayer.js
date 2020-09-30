import ItemKart from "./ItemKart.js";
import audios from "../assets/mp3/characters/*.wav";
import { Howl, Howler } from "howler";

export class KartPlayer extends HTMLElement {
  constructor(name, config) {
    super();
    this.name = name;
    this.y = config["y"];
    this.x = 0;
    this.image = config["image"];
    this.attachShadow({ mode: "open" });
    this.nextItem = Math.round(Math.random() * 500 + 60.5);
    this.speed = 0.5;
    this.it = 0;
    this.audios = {
      win: new Howl({
        src: audios[`${name}-win`],
      }),
      random: new Howl({
        src: audios[name],
      }),
    };
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>${this.styles}</style>
    <img src=${this.image}>
    `;
  }

  get styles() {
    return `
        :host {
            position: absolute;
            display: inline-block;
            top: ${this.y + 135}px;
            transform: translateX(var(--x)) translateY(var(--y));
            transition: transform 0.25s;
            will-change: transform;
        }
        
        img {
            height: 96px;
            position: relative;
        }
      `;
  }

  get name() {
    return this.getAttribute("name");
  }

  set name(n) {
    this.setAttribute("name", n);
  }

  inc() {
    let i = Math.random();
    this.item = this.shadowRoot.querySelector("item-kart");

    if (i <= 0.15 && this.item == null && this.nextItem <= 0) {
      let play = Math.round(Math.random());
      if (play < 0.1) {
        this.audios["random"].play();
      }

      let child = new ItemKart();
      this.shadowRoot.appendChild(child);

      this.applyItem(child.item);
      this.nextItem = Math.round(Math.random() * 500 + 60.5);
    }

    if (this.it <= 0 && this.item != null) {
      this.shadowRoot.removeChild(this.item);
      this.speed = 0.5;
    }

    this.nextItem -= 1;
    this.it -= 1;
    this.x += this.speed;
    this.x = parseFloat(Number(this.x).toFixed(3));
    this.style.setProperty("--x", `${this.x}px`);
    this.style.setProperty("transform", "translateX(var(--x))");
  }

  isWinner() {
    return this.x >= 816;
  }

  win() {
    this.style.filter = "drop-shadow(0px 0px 15px gold)";
    this.audios["win"].play();
  }

  lose() {
    this.style.opacity = "50%";
  }

  restart() {
    this.style.opacity = "";
    this.style.filter = "";
    this.x = 0;
    this.style.setProperty("--x", `${this.x}px`);
    this.style.setProperty("transform", "translateX(0px)");
    this.item = this.shadowRoot.querySelector("item-kart");
    if (this.item != null) {
      this.shadowRoot.removeChild(this.item);
    }
    this.nextItem = Math.round(Math.random() * 500 + 60.5);
    this.it = 0;
    this.speed = 0.5;
  }

  applyItem(item) {
    const itemsEffects = {
      "1": [0, 60],
      "2": [0.7, 60],
      "3": [0.3, 60],
      "4": [0.7, 100],
    };

    [this.speed, this.it] = itemsEffects[item];
  }
}

customElements.define("kart-player", KartPlayer);
