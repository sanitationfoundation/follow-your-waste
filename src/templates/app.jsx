import React from "react";
import { Helmet } from "react-helmet";
// import { withPrefix } from "gatsby";

import enText from "../content/en.json";
import esText from "../content/es.json";
import zhText from "../content/zh.json";
import data from "../content/data.json";

import Header from "../components/header.jsx";
import Intro from "../components/intro.jsx";
import Selection from "../components/selection.jsx";
import Streams from "../components/streams.jsx";

export default ({ pageContext }) => {
	const { lang } = pageContext,
				{ items } = data;

	const langObjs = {
		en: {
			long: "Español",
			short: "eng",
			text: enText
		},
		es: {
			long: "Español",
			short: "esp",
			text: esText
		},
		zh: {
			long: "简体",
			short: "简体",
			text: zhText
		}
	};


	const text = langObjs[lang].text,
				microText = text.micro[0],
				dialogText = text.dialog[0],
				itemsText = text.items;

	return (
		<div>
			<Helmet
				bodyAttributes={{
					id: "intro",
					class: "",
				}}>
			</Helmet>

			<Header lang={lang} langObjs={langObjs} />
			<Intro microText={microText} />
			<Selection itemsData={items} itemsText={itemsText} />
			<Streams data={data} text={text} />

			<div id="alerts-view" className="view">
				<div className="view-inner">
					<div className="alert" data-alert="select">
						<div className="portrait">
							<img src="./images/workers/renee.png" alt="" />
						</div>
						<div className="message">
							<p>Hi there, and welcome to Disposal Journey! I’m Renee, and I work
							at DSNY. Do you ever wonder what happens to your waste after you
							toss it in a bin? My team and I are here to teach you.</p>
						</div>
						<button className="button" aria-label="Close">
							Okay
						</button>
					</div>

					<div className="alert" data-alert="not-trash">
						<div className="message">
							<p>{dialogText.not_trash}</p>
							<button className="button" aria-label="Close">
								{microText.try_again}
							</button>
						</div>
					</div>

					<div className="alert" data-alert="wrong-recycle">
						<div className="message">
							<p>{dialogText.wrong_recycle}</p>
							<button className="button" aria-label="Close">
								{microText.try_again}
							</button>
						</div>
					</div>

					<div className="alert" data-alert="not-recycle">
						<div className="message">
							<p>{dialogText.not_recycle}</p>
							<button className="button" aria-label="Close">
								{microText.try_again}
							</button>
						</div>
					</div>

					<div className="alert" data-alert="correct-bin">
						<div className="message">
							<p>{dialogText.correct_bin}</p>
							<button className="button" aria-label="Start">
								{microText.lets_go}
							</button>
						</div>
					</div>
				</div>
			</div>

			<div id="full-toggle"></div>

		</div>
	);
};
