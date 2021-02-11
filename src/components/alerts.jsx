import React from "react";

export default function Alerts({ text }) {
	return(
		<div id="alerts-view" className="view" aria-hidden="true">
			<div className="view-inner">


				{/*******Select intro*******/}
				<div
					role="dialog"
					className="alert big"
					id="alert-select-intro"
					aria-hidden="true">
					<div className="message" id="message-select-intro">
						<p>{text.system.select_intro}</p>
						<p>{text.system.select_prompt}</p>
					</div>
					<div
						role="menu"
						className="alert-buttons"
						tabIndex={-1}
						aria-labelledby="message-select-intro">
						<button
							className="button okay"
							role="menuitem">
							{text.system.im_ready}
						</button>
					</div>
				</div>



			{/******* Not trash *******/}
				<div
					role="dialog"
					className="alert"
				  id="alert-not-trash"
					aria-hidden="true">
					<div className="message" id="message-not-trash">
						<p>{text.system.select_not_trash}</p>
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
						<p>{text.system.select_wrong_recycle}</p>
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
						<p>{text.system.select_not_recycle}</p>
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
						<p>{text.system.select_correct_bin}</p>
					</div>
					<div
						role="menu"
						className="alert-buttons"
						tabIndex={-1}
						aria-labelledby="message-correct-bin">
						<button
							className="button cancel"
							role="menuitem">
							{text.system.try_another}
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
					className="alert"
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
									{text.system.help_progress}
								</div>
							</div>

							<div className="row">
								<div className="col">
									<div className="factoid-tab"></div>
								</div>
								<div className="col">
									{text.system.help_factoid}
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
									{text.system.help_audio}
								</div>
							</div>


						</div>

					</div>
					<div
						role="menu"
						className="alert-buttons"
						tabIndex={-1}>
						<button
							className="button okay"
							role="menuitem">
							{text.system.im_ready}
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
								<h2>{text.system.final_title}</h2>
								{text.system.final_statement}
								<div
									role="menu"
									className="alert-buttons"
									tabIndex={-1}
									aria-labelledby="message-streams-end">
									<button
										className="button okay start"
										role="menuitem">
										{text.system.final_restart}
									</button>
								</div>
							</div>
						</div>
						<div
							role="menu"
							id="menu-resources"
							tabIndex={-1}
							aria-labelledby="message-menu-resources">
							<h3 id="message-menu-resources">
								{text.system.final_resources}
							</h3>
							<a
								className=""
								href="https://www.sanitationfoundation.org/"
								target="_blank"
								rel="noreferrer"
								role="menuitem">
								{text.system.final_workers}
							</a>
							<a
								className=""
								href="https://www.sanitationfoundation.org/"
								target="_blank"
								rel="noreferrer"
								role="menuitem">
								{text.system.final_lessons}
							</a>
							<a
								className=""
								href="https://www.sanitationfoundation.org/"
								target="_blank"
								rel="noreferrer"
								role="menuitem">
								{text.system.final_about}
							</a>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
}