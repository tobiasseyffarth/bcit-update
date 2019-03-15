import { Menubar } from 'primereact/menubar';
import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  state = {
    // name: 'zeugnis',
  };

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
          <li className="p-menuitem">
            <Link href="/wizard" to="/wizard" className="p-menuitem-link">
              <span className="p-menuitem-text">Wizard</span>
            </Link>
          </li>
        </Menubar>
      </div>
    );
  }
}
