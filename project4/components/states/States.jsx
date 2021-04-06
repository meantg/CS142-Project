import React from 'react';
import './States.css';

/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      stateModel: window.cs142models.statesModel(),
      result: []
    };
    this.handleInput = this.handleInput.bind(this);

    console.log('window.cs142models.statesModel()', window.cs142models.statesModel());
  }

  handleInput(event) {
    var allState = this.state.stateModel;
    var length = allState.length;
    var _result = [];
    for (var i = 0; i < length; i++) {
      if (allState[i].includes(event.target.value) == true) {
        _result.push(allState[i]);
      }
    }
    this.setState({ result: _result })
  }

  render() {
    return (
      <div>
        <form>
          <label> InputHere:
            <input type="text" name="location" onChange={this.handleInput} />
          </label>
        </form>
        {this.state.result.length == 0 ? <h4>Nothing match your input</h4> : <h4>{this.state.result+ ""}</h4>}

      </div>
    );
  }
}

export default States;
