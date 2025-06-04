import React from 'react';
import { JsonViewer } from './interviewPrepTasks/ReactQuestions/JsonViewer';
import BookApp from './interviewPrepTasks/ReactQuestions/BookApp';
import { FormWithStateManagement } from './interviewPrepTasks/ReactQuestions/FormWithStateManagement';
import PostsComponent from './interviewPrepTasks/ReactQuestions/PostsComponent';
import { Layouts } from './interviewPrepTasks/ReactQuestions/Layouts';
import { AlbumPhotoApplication } from './interviewPrepTasks/ReactQuestions/AlbumPhotoApplication';

function App() {
  return (
    <div className='App'>
      <AlbumPhotoApplication />
      <Layouts />
      <JsonViewer />
      <BookApp />
      <FormWithStateManagement />
      <PostsComponent />
    </div>
  );
}

export default App;
