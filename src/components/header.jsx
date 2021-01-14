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
	const [mainMenu, setMainMenu] = useState(false);
	const [langMenu, setLangMenu] = useState(false);

	// toggleDropdown(menuId) {
	// 	// this.setState({
	// 	// 	[menuId]: !this.state[menuId]
	// 	// });
 //  }

	const langKeys = Object.keys(langObjs).sort((a, b) => {
		return a === lang ? -1 : b === lang ? 1 : 0
	});

	return (
		<header id="header">

			<div className={`dropdown ${mainMenu ? "open" : ""}`}>
				<div className="option" onClick={() => setMainMenu(!mainMenu)}>
					Menu
				</div>
				<div className="option">
					<a href="https://www.sanitationfoundation.org/" title="Meet The Workers">
						Meet The Workers
					</a>
				</div>
				<div className="option">
					<a href="https://www.sanitationfoundation.org/" title="Teaching Resources">
						Teaching Resources
					</a>
				</div>
				<div className="option">
					<a href="https://www.sanitationfoundation.org/" title="About The Site">
						About The Site
					</a>
				</div>
			</div>

			<div className={`dropdown ${langMenu ? "open" : ""}`}>

				{langKeys.map((langKey, i) => {
					const langObj = langObjs[langKey];
					return (
						<React.Fragment key={i}>
							{ i === 0 ?
								<div className="option" onClick={() => setLangMenu(!langMenu)}>
									{langObj.short}
								</div>
							: <div className="option">
									<a lang={langKey} href={"/"+langKey} title={langObj.long}>
										{langObj.short}
									</a>
								</div>
							}
						</React.Fragment>
					);
				})}

			</div>

		</header>
	);
}