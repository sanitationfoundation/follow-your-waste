import React from "react";
import { Helmet } from "react-helmet";

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

	const textObjs = { en: enText, es: esText, zh: zhText };
	Object.keys(textObjs).forEach((key) => {
		textObjs[key].system.forEach((textPair) => {
			langObjs[key].text.system[textPair.slug] = textPair.text;
		});
	});

	const text = langObjs[lang].text;

	return (
		<div>
			<Helmet
				title={text.system.title}
				bodyAttributes={{
					id: "intro",
					class: "",
				}}
				meta={[
					{
						name: text.system.title,
						content: text.system.tagline
					}
				]}
				link={[
					{
						"rel": "icon", 
						"type": "image/png", 
						"href": "../static/images/icon.png"
					}
				]}>
			</Helmet>

			<Header text={text} lang={lang} langObjs={langObjs} />

			<main id="main">
				<Intro text={text} />
				<Select text={text} data={data} />
				<Streams text={text} data={data} />
				<Alerts text={text} />
			</main>

			<button
				className="tool-button"
				id="help-toggle"
				tabIndex={0}
				aria-pressed={false}
				aria-hidden={true}>
			</button>

			<label
				htmlFor="full-toggle"
				className="screen-hidden">
				{text.system.aria_full_screen}
			</label>
			<button
				className="tool-button"
				id="full-toggle"
				tabIndex={0}
				aria-pressed={false}
				aria-hidden={true}>
			</button>

		</div>
	);
};
