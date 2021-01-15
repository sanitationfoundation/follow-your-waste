import React from "react";

const streams = ["landfill", "paper", "plastic"];

export default function Alerts({ dialogText, microText }) {
	return(
		<div id="alerts-view" className="view">
			<div className="view-inner">
				<div className="alert"
						 data-alert="select"
						 role="dialog">
					<div className="message" aria-hidden="true">
						<p>Discover what happens to your household waste after you toss it in the bin.</p>
						<p>To start, click on any item and drag it into the bin you think it belongs.</p>
						<button className="button">
							Okay
						</button>
					</div>

					<div className="aria-only">
						<div id="aria-select-message" aria-hidden="true">
							<p>
								Discover what happens to your household waste after you toss it in the bin.
								To start, select which material you would like to follow.
							</p>
						</div>
						<div id="aria-select" role="menu" aria-labelledby="aria-select-message">
							{streams.map((streamSlug, i) => {
								return (
									<button role="menuitem" className="aria-only" aria-controls="aria-select" key={i}>
										{streamSlug}
									</button>
								)
							})}
						</div>
					</div>
				</div>

				<div className="alert"
						 data-alert="not-trash"
						 aria-hidden="true">
					<div className="message" id="not-trash-message">
						<p>{dialogText.not_trash}</p>
						<button className="button">
							{microText.try_again}
						</button>
					</div>
				</div>

				<div className="alert"
						 data-alert="wrong-recycle"
						 aria-hidden="true">
					<div className="message" id="wrong-recycle-message">
						<p>{dialogText.wrong_recycle}</p>
						<button className="button">
							{microText.try_again}
						</button>
					</div>
				</div>

				<div className="alert"
						 data-alert="not-recycle"
						 aria-hidden="true">
					<div className="message" id="not-recycle-message">
						<p>{dialogText.not_recycle}</p>
						<button className="button">
							{microText.try_again}
						</button>
					</div>
				</div>

				<div className="alert"
						 data-alert="correct-bin"
						 aria-hidden="true">
					<div className="message" id="correct-bin-message">
						<p>{dialogText.correct_bin}</p>
						<button className="button">
							{microText.lets_go}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}