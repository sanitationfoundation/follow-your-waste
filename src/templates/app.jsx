import React from "react";
import { Helmet } from "react-helmet";
// import { withPrefix } from "gatsby";

import enText from "../content/en.json";
import esText from "../content/es.json";
import zhText from "../content/zh.json";
import data from "../content/data.json";

import Header from "../components/header.jsx";
import Intro from "../components/intro.jsx";
import Select from "../components/select.jsx";
import Streams from "../components/streams.jsx";
import Alerts from "../components/alerts.jsx";

export default ({ pageContext }) => {
	const { lang } = pageContext;

	const langObjs = {
		en: {
			long: "English",
			short: "eng",
			text: enText
		},
		// es: {
		// 	long: "Español",
		// 	short: "esp",
		// 	text: esText
		// },
		// zh: {
		// 	long: "简体",
		// 	short: "简体",
		// 	text: zhText
		// }
	};

	Object.keys(langObjs).map((lang) => {
		let newSysObj = {};
		const langObj = langObjs[lang],
					sysArr = langObj.text.system;
		sysArr.forEach((textObj) => {
			newSysObj[textObj.slug] = textObj.text;
		});
		langObj.text.system = newSysObj;
		return langObj;
	});

	const text = langObjs[lang].text;

	return (
		<div>
			<Helmet
				bodyAttributes={{
					id: "intro",
					class: "",
				}}
				script={[
					{
						"src": "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/gsap.min.js", 
						"type": "text/javascript"
					},
					{
						"src": "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/Draggable.min.js", 
						"type": "text/javascript"
					}
				]}>
			</Helmet>

			<main id="main">
				<Header text={text} lang={lang} langObjs={langObjs} />
				<Intro text={text} />
				<Select text={text} data={data} />
				<Streams text={text} data={data} />
				<Alerts text={text} />
			</main>

		</div>
	);
};
