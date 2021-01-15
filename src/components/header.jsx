import React, { useState } from 'react';

export default function Header({ lang, langObjs }) {

// export default class Header extends React.Component {

	// constructor(props) {
	//   super(props);
	//   this.state = {
	//   	menu: true,
	//   	lang: true
	//   };
	// }
	// const [mainMenu, setMainMenu] = useState(false);
	const [langMenu, setLangMenu] = useState(false);

	// toggleDropdown(menuId) {
	// 	// this.setState({
	// 	// 	[menuId]: !this.state[menuId]
	// 	// });
 //  }

	const langKeys = Object.keys(langObjs).sort((a, b) => {
		return a === lang ? -1 : b === lang ? 1 : 0
	});

	const currLangKey = langKeys.shift(),
				currLangObj = langObjs[currLangKey];

	return (
		<header id="header">

			<div id="skip-to-intro">
				<a href="#intro-view">Skip to main content</a>
			</div>

			<div id="lang-switch" className={`dropdown ${langMenu ? "open" : ""}`}>

				<div className="option"
						 role="button"
						 title={currLangObj.long}
						 aria-hidden="true"
						 onClick={() => setLangMenu(!langMenu)}
						 onKeyPress={() => setLangMenu(!langMenu)}>
					{currLangObj.short}
				</div>

				<div id="lang-switch-label" className="aria-only" aria-hidden="true">
					Switch language
				</div>

				<div role="menu" aria-labelledby="lang-switch-label">
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

		</header>
	);
}