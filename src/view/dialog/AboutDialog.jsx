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
    this.setState({ visibleDialog: nextProps.showAboutDialog });
  }

  onHide() {
    this.props.close();
    this.setState({ visibleDialog: false });
  }

  render() {
    const references = (
      <div>
        <p>Dependencies</p>
        <p>
          <dl>
            <dt>@fortawesome/fontawesome-svg-core</dt>
            <dd>Creators: </dd>
            <dd>Version: </dd>
            <dd>License: </dd>
            <dd>Repository: </dd>
          </dl>
        </p>
        <p>Development Dependencies</p>
      </div>
    );

    const footer = (
      <div>
        <Button
          label="close"
          onClick={this.onHide}
          tooltip="close dialog"
        />
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
          maximizable
        >
          <div>
            <p>Contributors: Tobias Seyffarth, Kai Raschke</p>
          </div>
          {references}
        </Dialog>
      </div>
    );
  }
}

export default AboutDialog;
