import { Menubar } from 'primereact/menubar';
import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.exportBpmn = this.exportBpmn.bind(this);
    this.showAboutDialog = this.showAboutDialog.bind(this);
  }

  state = {
    // name: 'zeugnis',
  };

  showAboutDialog(/* event */) {
    console.log('click');
    this.setState({ visible: true });
  }

  exportBpmn(){
    console.log('export BPMN');
  }

  render() {
    const items = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'New Project',
          },
          {
            label: 'Open Project',
          },
          {
            label: 'Save Project',
          },
          {
            separator: true,
          },
          {
            label: 'View Graph',
          },
          {
            label: 'Export BPMN',
            command: () => { this.exportBpmn(); },
          },
        ],
      },
    ];

    return (
      <div>
        <Menubar model={items}>
          <p className="p-menuitem">
            <Link href="/about" to="/about" className="p-menuitem-link" onClick={this.showAboutDialog}>
              <span className="p-menuitem-text">About</span>
            </Link>
          </p>
        </Menubar>
      </div>
    );
  }
}
