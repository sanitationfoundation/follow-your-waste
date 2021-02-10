import React from "react";

export default function Intro({ text }) {
  return (
    <div id="intro-view" className="view loading show">
      <div id="intro-selection-wrap">
        <div id="intro-selection">
          <div id="intro-title">
            <div id="intro-title-spacer"></div>
            <span>
              {text.system.title}
            </span>
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
