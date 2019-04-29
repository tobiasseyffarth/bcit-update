import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import '../../App.css';

class AboutDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleDialog: false,
    };
    this.onHide = this.onHide.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({visibleDialog: nextProps.showAboutDialog});
  }

  onHide() {
    this.props.close();
    this.setState({visibleDialog: false});
  }

  render() {
    const footer = (
        <div>
          <Button label="close" onClick={this.onHide} />
        </div>
    );

    return (
      <div className="content-section implementation">
        <Dialog
          header="About BCIT 2.0"
          visible={this.state.visibleDialog}
          footer={footer}
          style={{ width: '50vw' }}
          onHide={this.onHide}
          maximizable>
          About
          ...
        </Dialog>
      </div>
    );
  }
}

export default AboutDialog;
