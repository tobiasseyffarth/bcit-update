import { Component } from 'react';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types'; // ES6

import ProjectModel from '../../models/ProjectModel';

export default class StepITCompliance extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.click= this.click.bind(this);
    }

    click(){
        console.log(ProjectModel.getBpmnXml());
    }

    render() {
        return (
            <div>
                Zuordnung IT zu Compliance<br />
                {ProjectModel.getName()}
                <Button
                    label="Next"
                    onClick={this.click}
                />
            </div>
        );
    }
}

StepITCompliance.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
};
