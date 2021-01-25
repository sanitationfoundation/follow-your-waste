import React from "react";

const streams = ["landfill", "metal", "glass", "paper", "plastic"];

export default function Alerts({ text }) {
	return(
		<div id="alerts-view" className="view">
			<div className="view-inner">


				{/*******Select intro*******/}
				<div
					role="dialog"
					className="alert big"
					id="alert-select-intro"
					aria-hidden="true">
					<div className="message" id="message-select-intro">
						<p>{text.system.select_intro}</p>
						<p>{text.system.begin_select}</p>
					</div>
					<div
						role="menu"
						className="alert-buttons"
						tabIndex={-1}
						aria-labelledby="message-select-intro">
						<button
							className="button okay"
							role="menuitem">
							I'm ready
						</button>
					</div>
				</div>

				{/*******Select info*******/}
				<div
					role="dialog"
					className="alert"
					id="alert-select">

					<div
						className="message mobile-hidden"
						aria-hidden="true">
						<p>{text.system.select_intro}</p>
						<p>{text.system.begin_select}</p>
					</div>

					<div
						role="menu"
						className="alert-buttons mobile-hidden"
						aria-hidden="true">
						<button
							className="button okay"
							aria-hidden="true">
							{text.system.okay}
						</button>
					</div>

					<div className="message mobile-show">
						<div
							id="message-menu-select"
							aria-hidden="true">
							<p>
								{text.system.select_intro}
								{text.system.begin_select_alt}
							</p>
						</div>
					</div>

					<div
						role="menu"
						className="alert-buttons screen-hidden mobile-show"
						id="menu-select"
						tabIndex={-1}
						aria-labelledby="message-menu-select">
						{streams.map((streamSlug, i) => {
							return (
								<button
									role="menuitem"
									className="button"
									data-stream={streamSlug}
									aria-controls="menu-select"
									key={i}>
									{streamSlug}
								</button>
							)
						})}
					</div>

				</div>



			{/******* Not trash *******/}
				<div
					role="dialog"
					className="alert"
				  id="alert-not-trash"
					aria-hidden="true">
					<div className="message" id="message-not-trash">
						<p>{text.system.not_trash}</p>
					</div>
					<div
						role="menu"
						className="alert-buttons"
						tabIndex={-1}
						aria-labelledby="message-not-trash">
						<button
							className="button okay"
							role="menuitem">
							{text.system.try_again}
						</button>
					</div>
				</div>

				{/******* Wrong recycle *******/}
				<div
					role="dialog"
					className="alert"
					id="alert-wrong-recycle"
					aria-hidden="true">
					<div className="message" id="message-wrong-recycle">
						<p>{text.system.wrong_recycle}</p>
					</div>
					<div role="menu"
						className="alert-buttons"
						tabIndex={-1}
						aria-labelledby="message-wrong-recycle">
						<button
							className="button okay"
							role="menuitem">
							{text.system.try_again}
						</button>
					</div>
				</div>

				{/******* Not recycle *******/}
				<div
					role="dialog"
					className="alert"
					id="alert-not-recycle"
					aria-hidden="true">
					<div className="message" id="message-not-recycle">
						<p>{text.system.not_recycle}</p>
					</div>
					<div
						role="menu"
						className="alert-buttons"
						tabIndex={-1}
						aria-labelledby="message-not-recycle">
						<button
							className="button okay"
							role="menuitem">
							{text.system.try_again}
						</button>
					</div>
				</div>

				{/******* Correct bin *******/}
				<div
					role="dialog"
					className="alert"
					id="alert-correct-bin"
					aria-hidden="true">
					<div className="message" id="message-correct-bin">
						<p>{text.system.correct_bin}</p>
					</div>
					<div
						role="menu"
						className="alert-buttons"
						tabIndex={-1}
						aria-labelledby="message-correct-bin">
						<button
							className="button cancel"
							role="menuitem">
							Try another
						</button>
						<button
							className="button okay"
							role="menuitem">
							{text.system.lets_go}
						</button>
					</div>
				</div>

				{/*******Streams intro*******/}
				<div
					role="dialog"
					className="alert big"
					id="alert-streams-intro"
					aria-hidden="true">
					<div className="message" id="message-streams-intro">
						<p>Instructions for the stream</p>
					</div>
					<div
						role="menu"
						className="alert-buttons"
						tabIndex={-1}
						aria-labelledby="message-streams-intro">
						<button
							className="button okay"
							role="menuitem">
							I'm ready
						</button>
					</div>
				</div>

			</div>
		</div>
	);
}