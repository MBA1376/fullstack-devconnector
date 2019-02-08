import React , {Component} from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import classnames from 'classnames';
import {loginUser} from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            email : '' ,
            password : '' ,
            errors : {}
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        //if is authenticate then redirect to dashboard page
        if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }

        if(nextProps.errors) {
            this.setState({errors : nextProps.errors});
        }
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
    }

    onChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const userData = {
            email : this.state.email ,
            password : this.state.password
        }

        this.props.loginUser(userData);
    }

   render() {

    const {errors} = this.state;

       return (
        <div className="login">
            <div className="container">
            <div className="row">
                <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Log In</h1>
                <p className="lead text-center">
                    Sign in to your DevConnector account
                </p>
                <form onSubmit={this.onSubmit}>

                    <TextFieldGroup
                        placeholder = "Email"
                        type = "email"
                        name = "email"
                        error= {errors.email}
                        value = {this.state.email}
                        onChange = {this.onChange}
                    />
                    <TextFieldGroup
                        placeholder = "Password"
                        type = "password"
                        name = "password"
                        error = {errors.password}
                        value = {this.state.password}
                        onChange = {this.onChange}
                    />
                    <input type="submit" className="btn btn-info btn-block mt-4" />
                </form>
                </div>
            </div>
            </div>
        </div>
       );
   }
}

Login.propTypes = {
    loginUser : propTypes.func.isRequired ,
    errors : propTypes.object.isRequired ,
    auth : propTypes.object.isRequired
};


const mapStateToProps = (state) => ({
    auth : state.auth ,
    errors : state.errors
});

export default connect(mapStateToProps , {loginUser})(Login);