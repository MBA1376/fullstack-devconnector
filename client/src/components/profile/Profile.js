import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import ProfileHeader from './ProfileHeader';
import ProfileAbout from './ProfileAbout';
import ProfileGithub from './ProfileGithub';
import ProfileCreds from './ProfileCreds';
import Spinner from '../common/Spinner';
import {getProfileByHandle} from '../../actions/profileActions';

class Profile extends Component {

    componentDidMount() {
        /** to get handle from url : this.props.match.params.handle **/
        if(this.props.match.params.handle) {
            this.props.getProfileByHandle(this.props.match.params.handle);
        }
    }

    render() {
        return (
            <div>
                <ProfileHeader />
                <ProfileAbout />
                <ProfileCreds />
                <ProfileGithub />
            </div>
        );
    }
}

Profile.propTypes = {
    profile : PropTypes.object.isRequired ,
    getProfileByHandle : PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    profile : state.profile 
});

export default connect(mapStateToProps , {getProfileByHandle})(Profile);