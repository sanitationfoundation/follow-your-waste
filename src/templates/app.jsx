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
import Alerts from "../components/alerts.jsx";

export default ({ pageContext }) => {
	const { lang } = pageContext,
				{ items } = data;

	const langObjs = {
		en: {
			long: "English",
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
			<Alerts dialogText={dialogText} microText={microText} />

			<div id="full-toggle"></div>

		</div>
	);
};
