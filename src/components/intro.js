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
            <button className="button" id="intro-button">
              {microText.get_started}
            </button>
            <div id="loading">{microText.loading}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
