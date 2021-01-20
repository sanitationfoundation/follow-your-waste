import React from "react";
import { withPrefix } from "gatsby";

export default function Select({ text, data }) {
  return (
    <div id="select-view" className="view">
      <div className="view-inner">

        <div id="items-wrap">
          <div id="stamp"></div>
          {data.items.map((item, i) => {
            const itemText = text.items[i];
            return (
              <div
                className="item"
                data-item={item.slug}
                data-stream={item.stream}
                aria-hidden="true"
                key={i}>
                <img
                  src={withPrefix(`images/items/${item.slug}.png`)}
                  alt={`${itemText.label}: ${itemText.tooltip}`} />
                <div className="tooltip mobile-hidden">
                  <div className="tooltip-arrow"></div>
                  <div className="tooltip-inner">
                    <strong>{itemText.label}</strong>
                    <p>{itemText.tooltip}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div id="bins" className="bins-wrap mobile-hidden">
          <div
            className="bin"
            id="paper-bin"
            data-bin="paper"
            data-title={text.system.paper}>
            <img
              className="bin-front"
              src={withPrefix("images/bin-paper-front.png")}
              alt="" />
            <img
              className="bin-lid"
              src={withPrefix("images/bin-paper-lid.png")}
              alt="" />
          </div>
          <div
            className="bin"
            id="metal-glass-plastic-bin"
            data-bin="metal-glass-plastic"
            data-title={text.system.mgp}>
            <img
              className="bin-front"
              src={withPrefix("images/bin-mgp-front.png")}
              alt="" />
            <img
              className="bin-lid"
              src={withPrefix("images/bin-mgp-lid.png")}
              alt="" />
          </div>
          <div
            className="bin"
            id="landfill-bin"
            data-bin="landfill"
            data-title={text.system.landfill}>
            <img
              className="bin-front"
              src={withPrefix("images/bin-landfill-front.png")}
              alt="" />
            <img
              className="bin-lid"
              src={withPrefix("images/bin-landfill-lid.png")}
              alt="" />
          </div>
        </div>

        <div id="bin-backs" className="bins-wrap mobile-hidden">
          <div
            className="bin"
            id="paper-back"
            data-bin="paper">
            <img
              className="bin-back"
              src={withPrefix("images/bin-paper-back.png")}
              alt="" />
          </div>
          <div
            className="bin"
            id="metal-glass-plastic-back"
            data-bin="metal-glass-plastic">
            <img
              className="bin-back"
              src={withPrefix("images/bin-mgp-back.png")}
              alt="" />
          </div>
          <div
            className="bin"
            id="landfill-back"
            data-bin="landfill">
            <img
              className="bin-back"
              src={withPrefix("images/bin-landfill-back.png")}
              alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
