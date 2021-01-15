import React from "react";
import { withPrefix } from "gatsby";

// import TitleLogo from "../images/title.svg";

export default function Selection({ microText }) {
  return (
    <div id="intro-view" className="view loading">
      <div id="intro-selection-wrap">
        <div id="intro-selection">
          <div id="intro-title">
            <img src={withPrefix("images/title.svg")} alt={microText.title} />
          </div>
          <div id="intro-tagline">{microText.tagline}</div>
          <div id="intro-bottom">
            <div id="loading">
              <span aria-hidden="true">{microText.loading}</span>
            </div>
            <button
              className="button"
              id="intro-button"
              aria-disabled="true"
              aria-haspopup="true">
              {microText.get_started}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
