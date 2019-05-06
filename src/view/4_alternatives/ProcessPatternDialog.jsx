import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import '../../App.css';

class ProcessPatternDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processName: null,
      processRule: null,
      processProps: null,
      visibleDialog: false,
    };

    this.onHide = this.onHide.bind(this);
    this.addCpPattern = this.addCpPattern.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({ visibleDialog: nextProps.showCpPatternDialog });
    this.setState({ processName: nextProps.name });
    this.setState({ processRule: nextProps.rule });
  }

  onHide() {
    this.props.close();
    this.setState({ visibleDialog: false });
  }

  addCpPattern(){
    const cpPattern ={
      name: this.state.processName,
      rule: this.state.rule,
      props: this.state.processProps,
      modeltype: 'complianceprocesspattern',
      nodetype: 'complianceprocesspattern'
    };

    this.props.addCpProcess(cpPattern);
    this.onHide();
  }

  render() {
    const footer = (
      <div>
        <Button label="Add" onClick={this.addCpPattern}/>
        <Button label="Abort" onClick={this.onHide}/>
      </div>
    );

    return (
      <div className="content-section implementation">
        <Dialog
          header="Create new compliance process pattern"
          footer={footer}
          visible={this.state.visibleDialog}
          style={{width: '80vw'}}
          onHide={this.onHide}
          maximizable
        >
          <div>
            <label htmlFor="processName">Name</label>
            <InputText
              id="processName"
              value={this.state.processName}
              onChange={e => this.setState({processName: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="processRule">Rule</label>
            <InputText
              id="processRule"
              value={this.state.processRule}
              onChange={e => this.setState({processRule: e.target.value})}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default ProcessPatternDialog;
