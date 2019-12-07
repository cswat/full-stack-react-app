import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ErrorsDisplay from './ErrorsDisplay';

class UserSignIn extends Component {
    state = { 
        emailAddress: '',
        password: '',
        errors: []
    }

    handleCancel = e => {
        e.preventDefault();
        this.props.history.push('/courses');
    }

    handleChange = e => {
        const value = e.target.value;
        const name = e.target.name;
        this.setState({
            [name] : value
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        //sets redirect path
        const { from } = this.props.location.state || { from: { pathname: '/courses' } };
        
        const { emailAddress, password } = this.state
        //sign in user
        this.props.context.actions.signIn(emailAddress, password)
            .then( user => {
                if (user === null) {
                    //set error state on failure
                    this.setState({ 
                        errors: ['Sign-in was unsuccessful']
                    })
                } else {
                    //redirect on authentication
                    this.props.history.push(from);
                }
            })
            .catch( error => {
                console.log(error);
                this.props.history.push('/error');
            })
    }

    render() { 
        const {
            emailAddress,
            password,
            errors
        } = this.state;

        return ( 
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign In</h1>
                    <div>
                        <ErrorsDisplay errors={errors} />
                        <form onSubmit={this.handleSubmit}>
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
                            <div className="grid-100 pad-bottom">
                                <button className="button" type="submit">Sign In</button>
                                <button className="button button-secondary" onClick={this.handleCancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
                </div>
            </div>
        );
    }
}
 
export default UserSignIn;