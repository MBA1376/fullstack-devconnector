/**if we want to redirect from an action then we have to bring in withRouter */
import React, { Component } from 'react';
import {Link , withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import {addExperience} from '../../actions/profileActions';

class AddExperience extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company : '' ,
            title : '' ,
            location : '' ,
            from : '' ,
            to : '' ,
            current : false ,
            disabled : false ,
            description : '',
            errors : {}
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCheck = this.onCheck.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({
                errors : nextProps.errors
            });
        }
    }

    onSubmit(e) {
        e.preventDefault();
        //call action to add experience
        const expData = {
            company : this.state.company ,
            title : this.state.title ,
            location : this.state.location ,
            from : this.state.from ,
            to : this.state.to ,
            current : this.state.current ,
            description : this.state.description
        }

        this.props.addExperience(expData , this.props.history);
    }

    onChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    onCheck (e) {
        this.setState({
            disabled : !this.state.disabled ,
            current : !this.state.current
        });
    }

    render() {
        const {errors} = this.state;

        return (
            <div className="add-experience">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <Link to="/dashboard" className="btn btn-light">Go Back</Link>
                            <h1 className="display-4 text-center">Add Expriece</h1>
                            <p className="lead text-center">Add any job or position that you have had before or current</p>
                            <small className="d-block pb-3">* = required fields</small>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup 
                                    placeholder="* Company"
                                    name="company"
                                    value={this.state.company}
                                    onChange={this.onChange}
                                    error={errors.company}
                                />
                                <TextFieldGroup 
                                    placeholder="* Job Title"
                                    name="title"
                                    value={this.state.title}
                                    onChange={this.onChange}
                                    error={errors.title}
                                />
                                <TextFieldGroup 
                                    placeholder="Location"
                                    name="location"
                                    value={this.state.location}
                                    onChange={this.onChange}
                                    error={errors.location}
                                />
                                <h6>From Date</h6>
                                <TextFieldGroup 
                                    name="from"
                                    type="date"
                                    value={this.state.from}
                                    onChange={this.onChange}
                                    error={errors.from}
                                />
                                <h6>To Date</h6>
                                <TextFieldGroup 
                                    name="to"
                                    type="date"
                                    value={this.state.to}
                                    onChange={this.onChange}
                                    error={errors.to}
                                    disabled={this.state.disabled ? 'disabled' : ''}
                                />
                                <div className="from-check mb-4">
                                    <input 
                                        type="checkbox"
                                        name="current"
                                        className="from-check-input"
                                        value={this.state.current}
                                        checked={this.state.current}
                                        onChange={this.onCheck}
                                        id="current"
                                    />
                                    <label className="fro-check-label" htmlFor="current">Current Job</label>
                                </div>
                                <TextAreaFieldGroup 
                                    placeholder="Job Decription"
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.onChange}
                                    info="Tell us about the position"
                                    error={errors.description}
                                />

                                <input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AddExperience.propTypes = {
    addExperience : PropTypes.func.isRequired ,
    errors : PropTypes.object.isRequired ,
    profile : PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    errors : state.errors ,
    profile : state.profile
});

export default connect(mapStateToProps , {addExperience})(withRouter(AddExperience));