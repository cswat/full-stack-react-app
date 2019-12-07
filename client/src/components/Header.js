//renders Header component with message and appropriate sign out/sign in status
import React from 'react';
import { Link } from 'react-router-dom';

const Header = (props) => {
    const authenticatedUser = props.context.authenticatedUser;
        
    return ( 
        <div className="header">
            <div className="bounds">
                <h1 className="header--logo">Courses</h1>
                <nav>
                    {authenticatedUser ? (
                        <React.Fragment>
                            <span>Welcome, {authenticatedUser.firstName} {authenticatedUser.lastName}!</span>
                            <Link to="/signout" className="signout">Sign Out</Link>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Link 
                                to={location => ({
                                    pathname: "/signup",
                                    state: { from: location.pathname }
                                })}
                                className="signup">Sign Up</Link>
                            <Link 
                                to={location => ({
                                    pathname: "/signin",
                                    state: { from: location.pathname }
                                })}
                                className="signin">Sign In</Link>
                        </React.Fragment>
                    )}
                </nav>
            </div>
        </div>
    );
}
 
export default Header;