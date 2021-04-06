import React from 'react';
import ReactDOM from 'react-dom';

import Example from './components/example/Example';
import Header from './components/header/Header';
import States from './components/states/States';


ReactDOM.render(
    <div id="mainp4">
        <h1>This is P4</h1>
        <Header />
        <button onClick={toggleSwitch} id="btn"> Switch to States</button>
        <div id="ex" style={{ display: "none" }}>
            <States></States>
        </div>
        <div id="st" style={{ display: "block" }}>
            <Example></Example>
        </div>
    </div>,
    document.getElementById('p4'),
);

function toggleSwitch() {
    var ex = document.getElementById('ex');
    var st = document.getElementById('st');
    var btn = document.getElementById('btn');

    if (ex.style.display === "none") {
        ex.style.display = "block";
        st.style.display = "none"
        btn.innerText = "Switch to Examples"
    } else {
        ex.style.display = "none";
        st.style.display = "block";
        btn.innerText = "Switch to States"
    }
}

