import React from 'react';
import { JsonViewer } from './interviewPrepTasks/ReactQuestions/JsonViewer';
import BookApp from './interviewPrepTasks/ReactQuestions/BookApp';
import { FormWithStateManagement } from './interviewPrepTasks/ReactQuestions/FormWithStateManagement';
import PostsComponent from './interviewPrepTasks/ReactQuestions/PostsComponent';
import { Layouts } from './interviewPrepTasks/ReactQuestions/Layouts';

function App() {
  return (
    <div className='App'>
      <Layouts />
      <JsonViewer />
      <BookApp />
      <FormWithStateManagement />
      <PostsComponent />
    </div>
  );
}

export default App;
