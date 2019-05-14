import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import '../../App.css';

class ReqDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      header: 'Add new compliance requirement',
      reqName: null,
    };

    this.onShow = this.onShow.bind(this);
    this.onHide = this.onHide.bind(this);
    this.getReq = this.getReq.bind(this);
    this.editReq = this.editReq.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({ visibleDialog: nextProps.showCpPatternDialog });
    this.setState({ pattern: nextProps.pattern });
  }

  onShow(){
    const { req } = this.state;
    if (req !== undefined){
      this.setState({ header: 'Edit compliance process pattern' });
      this.setState({ mode: 'edit' });
    }
  }

  onHide() {
    this.props.close();
    this.setState({ visibleDialog: false });
  }

  getReq(pattern){
    const props = this.getProps();
    let req;

    if (pattern === undefined){
      req = {
        name: this.state.patternName,
        props: this.state.patternProps,
        modeltype: 'compliance',
        nodetype: 'compliance',
      };
    } else {
      req = pattern;
      req.props = props;
    }
    return req;
  }

  editReq(){
    const cpPattern = this.getCpPattern(this.state.pattern);
    this.props.edit(cpPattern);
  }

  render() {
    const footer = (
      <div>
        <Button label="Ok" onClick={this.editReq} />
        <Button label="Abort" onClick={this.onHide} />
      </div>
    );

    return (
      <div className="content-section implementation">
        <Dialog
          header={this.state.header}
          footer={footer}
          visible={this.state.visibleDialog}
          style={{ width: '80vw' }}
          onShow={this.onShow}
          onHide={this.onHide}
          maximizable
        >
          <div>
            <label htmlFor="reqName">Name</label>
            <InputText
              id="reqName"
              value={this.state.reqName}
              readonly
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default ReqDialog;
