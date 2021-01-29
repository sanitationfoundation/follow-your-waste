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
						
						<div id="help-grid">

							<div className="row">
								<div className="col">
									<div className="progress">
										<div className="ticks-wrap">
											<div className="arrow" data-dir="prev"></div>
											<div className="tick"></div>
											<div className="tick"></div>
											<div className="tick"></div>
											<div className="arrow" data-dir="next"></div>
										</div>
									</div>
								</div>
								<div className="col">
									Use the progress bar or your arrow keys to move between scenes.
								</div>
							</div>

							<div className="row">
								<div className="col">
									<div className="factoid-tab"></div>
								</div>
								<div className="col">
									Look out for these tabs to learn extra facts.
								</div>
							</div>

							<div className="row">
								<div className="col">
									<div className="help-audio-buttons">
										<div className="audio-button volume"></div>
										<div className="audio-button playback"></div>
									</div>
									<div className="help-audio-buttons">
										<div className="audio-button volume"></div>
										<div className="audio-button playback"></div>
									</div>
								</div>
								<div className="col">
									Use these icons to control the sound.
								</div>
							</div>


						</div>

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

				{/*******Streams end*******/}
				<div
					role="dialog"
					className="alert big"
					id="alert-streams-end"
					aria-hidden="true">
					<div className="message" id="message-streams-end">
						<div className="row">
							<div className="col">
								<img id="selected-item" alt="" />
							</div>
							<div className="col">
								<h2>Recycled!</h2>
								One big recipient of our recycled cardboard is our City’s pizzerias. Next time you’re about to bite into some tasty pizza, remember that pizza box could have been recycled from New York’s paper.
								<div
									role="menu"
									className="alert-buttons"
									tabIndex={-1}
									aria-labelledby="message-streams-end">
									<button
										className="button okay start"
										role="menuitem">
										Restart
									</button>
								</div>
							</div>
						</div>
						<div
							role="menu"
							tabIndex={-1}>
							<h3>Explore further</h3>
							<a
								className=""
								href="https://www.sanitationfoundation.org/"
								target="_blank"
								rel="noreferrer"
								role="menuitem">
								Meet the workers
							</a>
							<a
								className=""
								href="https://www.sanitationfoundation.org/"
								target="_blank"
								rel="noreferrer"
								role="menuitem">
								Learning resources
							</a>
							<a
								className=""
								href="https://www.sanitationfoundation.org/"
								target="_blank"
								rel="noreferrer"
								role="menuitem">
								About the project
							</a>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
}