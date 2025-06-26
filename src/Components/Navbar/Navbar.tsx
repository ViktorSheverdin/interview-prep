import './Navbar.css';

import React, { useState } from 'react';

import { AlbumPhotoApplication } from '../../interviewPrepTasks/ReactQuestions/AlbumPhotoApplication';
import { BookApp } from '../../interviewPrepTasks/ReactQuestions/BookApp';
import { FormWithStateManagement } from '../../interviewPrepTasks/ReactQuestions/FormWithStateManagement';
import { JsonViewer } from '../../interviewPrepTasks/ReactQuestions/JsonViewer';
import { Layouts } from '../../interviewPrepTasks/ReactQuestions/Layouts';
import { PostsComponent } from '../../interviewPrepTasks/ReactQuestions/PostsComponent';

const PAGES: Record<string, React.ReactNode> = {
  'Album Photo Application': <AlbumPhotoApplication />,
  'Layouts': <Layouts />,
  'Json Viewer': <JsonViewer />,
  'Book App': <BookApp />,
  'FormWith State Management': <FormWithStateManagement />,
  'Posts Component': <PostsComponent />,
};

export const Navbar = () => {
  const [currentPage, setCurrentPage] = useState<string>(
    'Album Photo Application'
  );

  return (
    <div className='app-container'>
      <aside className='sidebar'>
        {Object.keys(PAGES).map((label: string) => {
          return (
            <div
              key={label}
              onClick={() => setCurrentPage(label)}
              className={`sidebar-item ${
                currentPage === label ? 'active' : ''
              }`}
            >
              {label}
            </div>
          );
        })}
      </aside>
      <main className='main-content'>{PAGES[currentPage]}</main>
    </div>
  );
};
