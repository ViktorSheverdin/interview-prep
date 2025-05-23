import React from 'react';
import { JsonViewer } from './interviewPrepTasks/ReactQuestions/JsonViewer';
import BookApp from './interviewPrepTasks/ReactQuestions/BookApp';
import { FormWithStateManagement } from './interviewPrepTasks/ReactQuestions/FormWithStateManagement';

function App() {
  return (
    <div className='App'>
      <JsonViewer />
      <BookApp />
      <FormWithStateManagement />
    </div>
  );
}

export default App;
