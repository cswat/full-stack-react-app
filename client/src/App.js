import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import withContext from './Context';

//components
import PrivateRoute from './PrivateRoute';
import Courses from "./components/Courses";
import CourseDetail from "./components/CourseDetail";
import UserSignIn from "./components/UserSignIn";
import CreateCourse from "./components/CreateCourse";
import UpdateCourse from "./components/UpdateCourse";
import UserSignUp from "./components/UserSignUp";
import Header from "./components/Header";
import UserSignOut from './components/UserSignOut';
import NotFound from './components/NotFound';
import UnhandledError from './components/UnhandledError';
import Forbidden from './components/Forbidden';

//links components to context
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const HeaderWithContext = withContext(Header);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const CourseDetailWithContext = withContext(CourseDetail);
const CoursesWithContext = withContext(Courses);

const App = () => (
  <BrowserRouter>
    <div>
      <HeaderWithContext />
      <hr></hr>
      <Switch>
        <Route exact path="/" render={() => <Redirect to ="/courses" />} />
        <Route exact path="/courses" component={CoursesWithContext} />
        <PrivateRoute path="/courses/create" component={CreateCourseWithContext} />
        <PrivateRoute path="/courses/:id/update" component={UpdateCourseWithContext} />
        <Route exact path="/courses/:id" component={CourseDetailWithContext} />
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOutWithContext} />
        <Route path="/notfound" component={NotFound} />
        <Route path="/error" component={UnhandledError} />
        <Route path="/forbidden" component={Forbidden} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </BrowserRouter>
  
)

export default App;
