import React from "react";
import { withPrefix } from "gatsby";

export default function Selection({ itemsData, itemsText }) {
  return (
    <div id="select-view" className="view">
      <div className="view-inner">

        <div id="items-wrap">
          <div id="stamp"></div>
          {itemsData.map((item, i) => {
            const itemText = itemsText[i];
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
          <div className="bin" data-stream="paper" data-title="Paper">
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
            data-stream="metal-glass-plastic"
            data-title="Metal, Glass, Plastic, Cartons">
            <img
              className="bin-front"
              src={withPrefix("images/bin-mgp-front.png")}
              alt="" />
            <img
              className="bin-lid"
              src={withPrefix("images/bin-mgp-lid.png")}
              alt="" />
          </div>
          <div className="bin" data-stream="landfill" data-title="Landfill">
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
          <div className="bin" data-stream="paper">
            <img
              className="bin-back"
              src={withPrefix("images/bin-paper-back.png")}
              alt="" />
          </div>
          <div className="bin" data-stream="metal-glass-plastic">
            <img
              className="bin-back"
              src={withPrefix("images/bin-mgp-back.png")}
              alt="" />
          </div>
          <div className="bin" data-stream="landfill">
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
