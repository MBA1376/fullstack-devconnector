import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';

import {createProfile} from '../../actions/profileActions';

class CreateProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displaySocialInputs : false ,
            handle : '' ,
            company : '' ,
            website : '' ,
            location : '' ,
            status : '' ,
            skills : '' ,
            githubusername : '' ,
            bio : '' ,
            twitter : '' ,
            facebook : '' ,
            instagram : '' ,
            linkedin : '' ,
            errors : {}
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
       
        const profileData = {
            handle : this.state.handle ,
            company : this.state.company ,
            website : this.state.website ,
            location : this.state.location ,
            status : this.state.status ,
            skills : this.state.skills ,
            githubusername : this.state.githubusername ,
            bio : this.state.bio ,
            twitter : this.state.twitter ,
            facebook : this.state.facebook ,
            instagram : this.state.instagram ,
            linkedin : this.state.linkedin ,
        };

        this.props.createProfile(profileData , this.props.history);
    }

    onChange(e) {
        this.setState({[e.target.name] : e.target.value});
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({
                errors : nextProps.errors
            });
        }
    }


    render() {
        const { errors , displaySocialInputs} = this.state;

        let socialInputs;

        if(displaySocialInputs) {
            socialInputs = (
                <div>
                    <InputGroup 
                        placeholder="Twitter Profile URL"
                        name="twitter"
                        icon="fab fa-twitter"
                        value={this.state.twitter}
                        onChange={this.onChange}
                        error = {errors.twitter}
                    />
                    <InputGroup 
                        placeholder="Facebook Profile URL"
                        name="facebook"
                        icon="fab fa-facebook"
                        value={this.state.facebook}
                        onChange={this.onChange}
                        error = {errors.facebook}
                    />
                    <InputGroup 
                        placeholder="Instagram Profile URL"
                        name="instagram"
                        icon="fab fa-instagram"
                        value={this.state.instagram}
                        onChange={this.onChange}
                        error = {errors.instagram}
                    />
                    <InputGroup 
                        placeholder="Linkedin Profile URL"
                        name="linkedin"
                        icon="fab fa-linkedin"
                        value={this.state.linkedin}
                        onChange={this.onChange}
                        error = {errors.linkedin}
                    />
                    <InputGroup 
                        placeholder="Youtube Profile URL"
                        name="youtube"
                        icon="fab fa-youtube"
                        value={this.state.youtube}
                        onChange={this.onChange}
                        error = {errors.youtube}
                    />
                </div>
            )
        }

        const options = [
            {label:'* Select Professienal Status' , value:0},
            {label : 'Developer' , value:'Developer'},
            {label : 'Joinor Developer' , value:'Jonior Developer'},
            {label : 'Senior Developer' , value:'Senior Developer'},
            {label : 'Manager' , value:'Manager'},
            {label : 'Sutudent or Learning' , value:'Sutudent or Learning'},
            {label : 'Instructor or Teacher' , value:'Instructor or Teacher'},
            {label : 'Intern' , value:'Intern'},
            {label : 'Other' , value:'Other'}
        ];
        return (
            <div className="create-profile">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Create Your Profile</h1>
                            <p className="lead text-center">Lets get some information to make your profile stand out</p>
                            <small className="d-blaok pb-3">* = required fields</small>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup 
                                    placeholder="Profile Handle"
                                    name="handle"
                                    value={this.state.handle}
                                    onChange={this.onChange}
                                    error = {errors.handle}
                                    info="A uniqe handle for your profile URL. your fullname , company name ,
                                     nickname , etc"
                                />

                                <SelectListGroup 
                                    placeholder="Status"
                                    name="status"
                                    value={this.state.status}
                                    onChange={this.onChange}
                                    error = {errors.status}
                                    options = {options}
                                    info="Give us an idea of where you are at in your career"
                                />
                                <TextFieldGroup 
                                    placeholder="Company"
                                    name="company"
                                    value={this.state.company}
                                    onChange={this.onChange}
                                    error = {errors.company}
                                    info="Could be your own company or one you work for"
                                />
                                <TextFieldGroup 
                                    placeholder="Website"
                                    name="website"
                                    value={this.state.website}
                                    onChange={this.onChange}
                                    error = {errors.website}
                                    info="Could be your own website or a company one"
                                />
                                <TextFieldGroup 
                                    placeholder="Location"
                                    name="location"
                                    value={this.state.location}
                                    onChange={this.onChange}
                                    error = {errors.location}
                                    info="city or City & state suggested (eg.Boston , MA)"
                                />
                                <TextFieldGroup 
                                    placeholder="* Skills"
                                    name="skills"
                                    value={this.state.skills}
                                    onChange={this.onChange}
                                    error = {errors.skills}
                                    info="Please use comma seperated values (eg. HTML,CSS,JavaScript,PHP)"
                                />
                                <TextFieldGroup 
                                    placeholder="Github Username"
                                    name="githubusername"
                                    value={this.state.githubusername}
                                    onChange={this.onChange}
                                    error = {errors.githubusername}
                                    info="If you want your latest repos and a Github link , include your username"
                                />
                                <TextAreaFieldGroup 
                                    placeholder="Short Bio"
                                    name="bio"
                                    value={this.state.bio}
                                    onChange={this.onChange}
                                    error = {errors.bio}
                                    info="Tell us a little about yourself"
                                />

                                <div className="mb-3">
                                    <button 
                                        type="button"
                                        onClick={() => { this.setState( prevState => ({
                                            displaySocialInputs : !prevState.displaySocialInputs
                                        }))} 
                                        }
                                        className="btn btn-light"
                                    >
                                         Add Social Network Links
                                    </button>
                                    <span className="text-muted">Optional</span>
                                    
                                    {socialInputs}
                                    <input name="submit" type="submit" value="Submit" className="btn btn-info btn-block mt-4"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CreateProfile.propTypes = {
    auth : PropTypes.object.isRequired ,
    errors : PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth : state.auth ,
    errors : state.errors
});

export default connect(mapStateToProps , {createProfile})(withRouter(CreateProfile));