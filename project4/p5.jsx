import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";
import Example from "./components/example/Example";
import States from "./components/states/States";

class p5 extends React.Component {

    render() {
        return (
            <HashRouter>
                <Link to="/states">States</Link>
                <Link to="/example">Examples</Link>
            </HashRouter>
        )
    }
}

export default p5;