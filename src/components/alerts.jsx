import React from "react";

const streams = ["landfill", "metal", "glass", "paper", "plastic"];

export default function Alerts({ text }) {
	return(
		<div id="alerts-view" className="view">
			<div className="view-inner">
				<div className="alert"
						 data-alert="select"
						 role="dialog">

					<div className="message mobile-hidden" aria-hidden="true">
						<p>{text.system.select_intro}</p>
						<p>{text.system.begin_select}</p>
					</div>

					<div className="alert-buttons mobile-hidden">
						<button className="button okay" aria-hidden="true">
							{text.system.okay}
						</button>
					</div>

					<div className="message mobile-show">
						<div id="select-menu-message" aria-hidden="true">
							<p>
								{text.system.select_intro}
								{text.system.begin_select_alt}
							</p>
						</div>
					</div>

					<div className="alert-buttons screen-hidden mobile-show" id="select-menu" role="menu" aria-labelledby="select-menu-message">
						{streams.map((streamSlug, i) => {
							return (
								<button
									role="menuitem"
									className="button"
									data-stream={streamSlug}
									aria-controls="select-menu"
									key={i}>
									{streamSlug}
								</button>
							)
						})}
					</div>

				</div>

				<div className="alert"
						 data-alert="not-trash"
						 aria-hidden="true">
					<div className="message" id="not-trash-message">
						<p>{text.system.not_trash}</p>
					</div>
					<div className="alert-buttons">
						<button className="button okay">
							{text.system.try_again}
						</button>
					</div>
				</div>

				<div className="alert"
						 data-alert="wrong-recycle"
						 aria-hidden="true">
					<div className="message" id="wrong-recycle-message">
						<p>{text.system.wrong_recycle}</p>
					</div>
					<div className="alert-buttons">
						<button className="button okay">
							{text.system.try_again}
						</button>
					</div>
				</div>

				<div className="alert"
						 data-alert="not-recycle"
						 aria-hidden="true">
					<div className="message" id="not-recycle-message">
						<p>{text.system.not_recycle}</p>
					</div>
					<div className="alert-buttons">
						<button className="button okay">
							{text.system.try_again}
						</button>
					</div>
				</div>

				<div className="alert"
						 data-alert="correct-bin"
						 aria-hidden="true">
					<div className="message" id="correct-bin-message">
						<p>{text.system.correct_bin}</p>
					</div>
					<div className="alert-buttons">
						<button className="button cancel" aria-hidden="true">
							Try another
						</button>
						<button className="button okay">
							{text.system.lets_go}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}