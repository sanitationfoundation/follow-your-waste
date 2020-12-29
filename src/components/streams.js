import React from "react";
// import { withPrefix } from "gatsby";

const streams = ["landfill","paper"];

export default function Streams({ data, text }) {
	return (
		<div id="streams-view" className="view">
			<div className="view-inner">
				{streams.map((stream, i) => {
					const streamText = text[stream],
								streamData = data[stream];
					return (
						<div className="stream" data-slug={stream} key={i}>
							<div className="scenes-wrap">
								{streamData.map((sceneData, j) => {
									const sceneText = streamText[j]
									return (
										<div className="scene" key={j}
											data-scene={sceneData.slug}
											data-color={sceneData.color}
											data-animated={sceneData.animated}
											data-looped={sceneData.looped}>
											{['paper', 'landfill', 'glass', 'plastic'].indexOf(stream) >= 0 ?
												<div className={`svg-wrap ${sceneData.orientation}`}>
												</div> : "" }
											<div className="factoids">
												{Array.apply(null, { length: 3 }).map((x, l) => {
													const vocab = sceneText["vocab"+l],
																fact = sceneText["fact"+l];
													if(fact) {
														return (
															<div className="factoid" data-index={l} data-vocab={vocab} key={l}>
																<div className="factoid-tab"></div>
																<div className="factoid-inner">
																	<p>
																		{vocab ? <span className="vocab">{vocab}</span> : ""}
																		{fact}
																	</p>
																</div>
															</div>
														)
													} else {
														return ""
													}
												})}
											</div>
										</div>
									)
								})}
							</div>
							<div className="chyron-wrap-wrap">
								<div className="arrow" data-dir="prev"></div>
								<div className="arrow" data-dir="next"></div>
								<div className="chyron-wrap">
									<div className="chyron">
										<div className="chyron-inner">
											<div className="portrait">
												<img src={`./assets/images/workers/${stream}.png`} alt="" />
											</div>
											<div className="captions">
												{streamData.map((sceneData, j) => {
													if(j < streamData.length - 1) {
														const sceneText = streamText[j];
														return (
															<div className="caption" data-scene={sceneData.slug} key={j}>
																<div className="text">
																	{sceneText.caption}
																</div>
																<audio controls={false} preload="none">
																	<source src={`./assets/audio/${stream}/${sceneData.slug}.wav`} type="audio/wav" />
																</audio>
															</div>
														);
													} else {
														return "";
													}
												})}
											</div>
											<button className="icon-button toggle"></button>
											<button className="icon-button replay"></button>
											<button className="icon-button volume"></button>
										</div>
									</div>
								</div>
							</div>
							<div className="progress">
								{streamData.map((sceneData, j) => {
									const sceneText = streamText[j];
									return (
										<div className="tick" data-scene={sceneData.slug} key={j}>
											<div className="label">
												{sceneText.label}
											</div>
										</div>
									)
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	)
};