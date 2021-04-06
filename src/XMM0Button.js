import './XMM0Variables.css';
import './XMM0Button.css';
import React from 'react';

class XMM0Button extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<button onClick={ (e) => { this.props.onClick(); } } className={`XMM0Button-Button ${this.props.className || ""}`} disabled={ this.props.disabled || false }>
				{ this.props.label || "None" }
			</button>
		);
	}

}

export default XMM0Button;