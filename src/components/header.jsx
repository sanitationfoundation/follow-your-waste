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
				<a href="#main">Skip to main content</a>
			</div>

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
					Switch language
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