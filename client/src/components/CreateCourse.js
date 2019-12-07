import React, { Component } from 'react';
import ErrorsDisplay from './ErrorsDisplay';

class CreateCourse extends Component {
    state = { 
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        errors: []
    }

    //redirects to course list when cancel button is clicked
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
        if (this.props.context.authenticatedUser) {
            //if there is a user signed in sends a request to the API to create a course with user's input data
            const courseData = {
                title: this.state.title,
                description: this.state.description,
                estimatedTime: this.state.estimatedTime,
                materialsNeeded: this.state.materialsNeeded
            };
            this.props.context.actions.createCourse(courseData)
                .then( errors => {
                    if (errors.length) {
                        //if there are errors, sets the errors state
                        this.setState({ errors });
                    } else {
                        //if there aren't any errors, redirects to the course list
                        this.props.history.push('/courses');
                    }
                })
                .catch( error => {
                    console.log(error);
                    this.props.history.push('/error');
                })
        } else {
            //if there isn't a user signed in, redirects to the sign in page
            this.props.history.push('/signin');
        }
    }

    render() { 
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            errors
        } = this.state;

        return ( 
            <div className="bounds course--detail">
                <h1>Create Course</h1>
                <div>
                    <ErrorsDisplay errors={errors} />
                    <form onSubmit={this.handleSubmit}>
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <div>
                                    <input 
                                        id="title" 
                                        name="title" 
                                        type="text" 
                                        className="input-title course--title--input" 
                                        placeholder="Course title..."
                                        value={title}
                                        onChange={this.handleChange} />
                                </div>
                                <p>By {this.props.context.authenticatedUser.firstName} {this.props.context.authenticatedUser.lastName}</p>
                            </div>
                            <div className="course--description">
                                <div>
                                    <textarea 
                                        id="description" 
                                        name="description" 
                                        className="" 
                                        placeholder="Course description..."
                                        value={description}
                                        onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <div>
                                            <input 
                                                id="estimatedTime" 
                                                name="estimatedTime" 
                                                type="text" 
                                                className="course--time--input"
                                                placeholder="Hours" 
                                                value={estimatedTime}
                                                onChange={this.handleChange} />
                                        </div>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div>
                                            <textarea 
                                                id="materialsNeeded" 
                                                name="materialsNeeded" 
                                                className="" 
                                                placeholder="List materials..."
                                                value={materialsNeeded}
                                                onChange={this.handleChange} />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="grid-100 pad-bottom">
                            <button className="button" type="submit">Create Course</button>
                            <button className="button button-secondary" onClick={this.handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
 
export default CreateCourse;