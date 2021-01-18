import React from "react";
import { withPrefix } from "gatsby";

const streams = ["landfill", "metal", "glass", "paper", "plastic"],
			environs = ["traffic", "facility", "water"];

export default function Streams({ data, text }) {
	return (
		<div id="streams-view" className="view">
			<div className="view-inner">
				{streams.map((stream, i) => {
					const streamText = text[stream],
								streamData = data[stream];
					return (
						<div
							className="stream"
							tabIndex={-1}
							aria-hidden={true}
							data-slug={stream}
							key={i}>
							<div className="scenes-wrap">
								{streamData.map((sceneData, j) => {
									const sceneText = streamText[j];
									let svgSrc;
									if(sceneData.animated === "true") {
										svgSrc = withPrefix(`scenes/animate/${sceneData.slug}/${sceneData.slug}.json`);
									} else {
										svgSrc = withPrefix(`scenes/static/${sceneData.slug}/scene.svg`);
									}
									if(streams.indexOf(stream) > -1) {
										return (
											<div
												className="scene"
												aria-hidden={true}
												data-scene={sceneData.slug}
												data-color={sceneData.color}
												data-animated={sceneData.animated}
												data-looped={sceneData.looped}
												data-environ={sceneData.environment}
												data-src={svgSrc}
												key={j}>
												
												<div
													className={`svg-wrap ${sceneData.orientation}`}
													aria-hidden={true}>
												</div>

												<div className="factoids" aria-hidden={true}>
													{Array.apply(null, { length: 3 }).map((x, l) => {
														const vocab = sceneText["vocab" + l],
															fact = sceneText["fact" + l];
														if (fact) {
															return (
																<div
																	className="factoid"
																	data-index={l}
																	data-vocab={vocab}
																	key={l}>
																	<div className="factoid-tab"></div>
																	<div className="factoid-inner">
																		<p>
																			{vocab ? (
																				<span className="vocab">{vocab}</span>
																			) : (
																				false
																			)}
																			{fact}
																		</p>
																	</div>
																</div>
															);
														} else {
															return false;
														}
													})}
												</div>
											</div>
										)
									} else {
										return false;
									}
								})}
							</div>
							<div className="chyron-wrap-wrap">
								<div className="chyron-wrap">
									<div className="chyron">
										<div className="chyron-inner">
											<div className="portrait">
												<img
													src={withPrefix(`images/workers/${stream}.png`)}
													alt="" />
											</div>
											<div className="captions">
												{streamData.map((sceneData, j) => {
													if (j < streamData.length - 1) {
														const sceneText = streamText[j];
														return (
															<div
																className="caption"
																data-scene={sceneData.slug}
																key={j}>
																<div className="text" aria-hidden={true}>
																	{sceneText.caption}
																</div>
																<audio
																	data-type="voice"
																	preload="none"
																	controls={false}>
																	<source
																		src={withPrefix(`audio/${stream}/${sceneData.slug}.wav`)}
																		type="audio/wav" />
																	<track
																		src=""
																		srcLang="en"
																		kind="captions" />
																</audio>
															</div>
														);
													} else {
														return false;
													}
												})}
											</div>

											<div role="menu"
												className="icon-buttons"
												aria-label="Voiceover controls">
												<button
													className="icon-button volume"
													tabIndex={0}
													aria-label="Toggle volume"
													aria-pressed="false">
												</button>
												<button
													className="icon-button playback"
													tabIndex={0}
													aria-label="Toggle play/pause">
												</button>
											</div>
											
										</div>
									</div>
								</div>
							</div>

							<div role="menu"
								className="progress"
								aria-label="Progress controls">
								<button
									className="arrow"
									tabIndex={0}
									aria-label="Previous"
									data-dir="prev">
								</button>
								<button
									className="arrow"
									tabIndex={0}
									aria-label="Next"
									data-dir="next">
								</button>
								<div className="ticks-wrap" aria-hidden={true}>
									{streamData.map((sceneData, j) => {
										const sceneText = streamText[j];
										return (
											<div
												className="tick"
												data-scene={sceneData.slug}
												key={j}>
												<div
													className="label"
													aria-hidden={true}>
													{sceneText.label}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{environs.map((environ, i) => {
				return (
					<audio
						data-type="environ"
						data-environ={environ}
						preload="auto"
						controls={false}
						loop={true}
						key={i}>
						<source
							src={withPrefix(`audio/environs/${environ}.wav`)}
							type="audio/wav" />
					</audio>
				);
			})}

		</div>
	);
}
