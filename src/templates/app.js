import React from "react";
import { Helmet } from "react-helmet";
// import { withPrefix } from "gatsby";

import enText from "../content/en.json";
import esText from "../content/es.json";
import zhText from "../content/zh.json";
import data from "../content/data.json";

import Intro from "../components/intro.js";
import Selection from "../components/selection.js";
import Streams from "../components/streams.js";

const allText = {
  en: enText,
  es: esText,
  zh: zhText,
};

const { items } = data;

export default ({ pageContext }) => {
  const { lang } = pageContext,
    text = allText[lang],
    microText = text.micro[0],
    dialogText = text.dialog[0],
    itemsText = text.items;

  return (
    <div>
      <Helmet
        bodyAttributes={{
          id: "intro",
          class: "mute",
        }}>
      </Helmet>

      <Intro microText={microText} />
      <Selection itemsData={items} itemsText={itemsText} />
      <Streams data={data} text={text} />

      <div id="alerts-view" className="view">
        <div className="view-inner">
          <div className="alert" data-alert="select">
            <div className="portrait">
              <img src="./assets/images/workers/renee.png" alt="" />
            </div>
            <div className="message">
              Hi there, and welcome to Disposal Journey! I’m Renee, and I work
              at DSNY. Do you ever wonder what happens to your waste after you
              toss it in a bin? My team and I are here to teach you.
            </div>
            <button className="button" aria-label="Close">
              Okay
            </button>
          </div>

          <div className="alert" data-alert="not-trash">
            <div className="message">
              {dialogText.not_trash}
              <button className="button" aria-label="Close">
                {microText.try_again}
              </button>
            </div>
          </div>

          <div className="alert" data-alert="wrong-recycle">
            <div className="message">
              {dialogText.wrong_recycle}
              <button className="button" aria-label="Close">
                {microText.try_again}
              </button>
            </div>
          </div>

          <div className="alert" data-alert="not-recycle">
            <div className="message">
              {dialogText.not_recycle}
              <button className="button" aria-label="Close">
                {microText.try_again}
              </button>
            </div>
          </div>

          <div className="alert" data-alert="correct-bin">
            <div className="message">
              {dialogText.correct_bin}
              <button className="button" aria-label="Close">
                {microText.lets_go}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="full-toggle"></div>

      <div id="lang-select">
        <span className="lang-option" title="English">
          <a lang="es" href="/">
            English
          </a>
        </span>
        <span className="lang-option" title="Español">
          <a lang="es" href="/es/">
            Español
          </a>
        </span>
        <span className="lang-option" title="简体">
          <a lang="es" href="/zh/">
            简体
          </a>
        </span>
      </div>
    </div>
  );
};
