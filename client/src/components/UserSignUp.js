import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ErrorsDisplay from './ErrorsDisplay';

export default class UserSignUp extends Component {
    state = { 
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: '',
        confirmPassword: '',
        errors: []
    }

    //redirects to the course list when cancel button is clicked
    handleCancel = e => {
        e.preventDefault();
        this.props.history.push('/courses');
    }

    //updates state with the value of each input element
    handleChange = e => {
        const value = e.target.value;
        const name = e.target.name;
        this.setState({
            [name] : value
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        //sets redirect path to either the protected route the user just navigated from or to the course list
        const { from } = this.props.location.state || { from: { pathname: '/courses' } };

        if (this.state.password === this.state.confirmPassword) {
            //if the two passwords entered by the user match, set the user data to the user's input
            const userData = { 
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                emailAddress: this.state.emailAddress,
                password: this.state.password
            }
            //send a request to sign up the user
            this.props.context.actions.signUp(userData)
                .then( errors => {
                    if (errors.length) {
                        //if there are errors, set the errors state
                        this.setState({ errors });
                    } else {
                        //if there are no errors, send a request to sign in the new user and redirect the user
                        this.props.context.actions.signIn(userData.emailAddress, userData.password);
                        this.props.history.push(from);
                    }
                })
                .catch( error => {
                    console.log(error);
                    this.props.history.push('/error');
                })
        } else {
            //if the two passwords entered by the user do not match, set the errors state
            this.setState({
                errors: ['Passwords do not match']
            })
        }
    }



    render() { 
        const {
            firstName,
            lastName,
            emailAddress,
            password,
            confirmPassword,
            errors
        } = this.state;

        return ( 
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign Up</h1>
                    <div>
                        <ErrorsDisplay errors={errors} />
                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <input 
                                    id="firstName" 
                                    name="firstName" 
                                    type="text" 
                                    className="" 
                                    placeholder="First Name" 
                                    value={firstName}
                                    onChange={this.handleChange} />
                            </div>
                            <div>
                                <input 
                                    id="lastName" 
                                    name="lastName" 
                                    type="text" 
                                    className="" 
                                    placeholder="Last Name" 
                                    value={lastName}
                                    onChange={this.handleChange} />
                            </div>
                            <div>
                                <input 
                                    id="emailAddress" 
                                    name="emailAddress" 
                                    type="text" 
                                    className="" 
                                    placeholder="Email Address" 
                                    value={emailAddress}
                                    onChange={this.handleChange} />
                            </div>
                            <div>
                                <input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    className="" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={this.handleChange} />
                            </div>
                            <div>
                                <input 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    type="password" 
                                    className="" 
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={this.handleChange} />
                            </div>
                            <div className="grid-100 pad-bottom">
                                <button className="button" type="submit">Sign Up</button>
                                <button className="button button-secondary" onClick={this.handleCancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
                </div>
            </div>
         );
    }
}