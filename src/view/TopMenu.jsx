import { Menubar } from 'primereact/menubar';
import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.showAboutDialog = this.showAboutDialog.bind(this);
  }

  state = {
    // name: 'zeugnis',
  };

  showAboutDialog(event) {
    console.log('click');
    this.setState({ visible: true });
  }

  render() {
    const items = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            items: [
              {
                label: 'Bookmark',
                icon: 'pi pi-fw pi-bookmark',
              },
              {
                label: 'Video',
                icon: 'pi pi-fw pi-video',
              },

            ],
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash',
          },
          {
            separator: true,
          },
          {
            label: 'Export',
            icon: 'pi pi-fw pi-external-link',
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
