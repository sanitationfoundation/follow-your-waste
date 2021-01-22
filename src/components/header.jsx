import React, { useState } from 'react';
import { withPrefix } from "gatsby";

export default function Header({ text, lang, langObjs }) {

	const [langMenu, setLangMenu] = useState(false);

	const langKeys = Object.keys(langObjs).sort((a, b) => {
		return a === lang ? -1 : b === lang ? 1 : 0
	});

	const currLangKey = langKeys.shift(),
				currLangObj = langObjs[currLangKey];

	return (
		<header id="header">

			<div id="skip-to-intro">
				<a href="#main">{text.system.skip}</a>
			</div>

			{/*<div id="logo">
				<a href="https://sanitaionfoundation.org" target="_blank">
					<img src={withPrefix("images/logo.png")} alt="Sanitation Foundation" />
				</a>
			</div>*/}

			<div id="lang-switch" className={`dropdown ${langMenu ? "open" : ""}`}>

				<div role="button"
						className="option"
						title={currLangObj.long}
						aria-hidden={true}
						onClick={() => setLangMenu(!langMenu)}
						onKeyPress={() => setLangMenu(!langMenu)}>
					{currLangObj.short}
				</div>

				<div
					id="lang-switch-label"
					className="screen-hidden"
					aria-hidden={true}>
					{text.system.lang_switch}
				</div>

				<div role="menu"
					aria-labelledby="lang-switch-label">
					{langKeys.map((langKey, i) => {
						const langObj = langObjs[langKey];
						return (
							<div className="option" key={i}>
								<a role="menuitem"
									 lang={langKey}
									 href={"/"+langKey}
									 title={langObj.long}
									 aria-label={`Switch to ${langObj.long}`}
									 tabIndex="0">
									{langObj.short}
								</a>
							</div>
						);
					})}
				</div>

			</div>

			<button
				id="full-toggle"
				tabIndex={0}
				aria-hidden={true}>
			</button>

		</header>
	);
}