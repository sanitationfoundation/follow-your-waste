import React from "react";
import { withPrefix } from "gatsby";

// import TitleLogo from "../images/title.svg";

export default function Intro({ text }) {
  return (
    <div id="intro-view" className="view loading">
      <div id="intro-selection-wrap">
        <div id="intro-selection">
          <div id="intro-title">
            <img src={withPrefix("images/title.svg")} alt={text.system.title} />
          </div>
          <div id="intro-tagline">
            {text.system.tagline}
          </div>
          <div id="intro-bottom">
            <div id="loading">
              <span aria-hidden="true">
                {text.system.loading}
              </span>
            </div>
            <button
              className="button start"
              id="intro-button"
              tabIndex={0}
              aria-disabled="true"
              aria-haspopup="true">
              {text.system.get_started}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
