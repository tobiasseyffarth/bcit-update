import { Component } from 'react';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types'; // ES6

import ProjectModel from '../../models/ProjectModel';

export default class StepITCompliance extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div>
                Zuordnung IT zu Compliance<br />
                {ProjectModel.getName()}
                <Button
                    label="Next"
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
