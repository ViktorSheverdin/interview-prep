import './Navbar.css';
import './Navbar.css';

import React, { useState } from 'react';

import { ComponentWithObserver } from '../../interviewPrepTasks/FrontendPatterns/Observable/ComponentWithObserver';
import { InputSanitizing } from '../../interviewPrepTasks/ReactQuestions/InputSanitizing/InputSanitizing';
import { Layouts } from '../../interviewPrepTasks/ReactQuestions/Layouts/Layouts';
import { AlbumPhotoApplication } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/AlbumPhotoApplication';
import { BookApp } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/BookApp';
import { FormWithStateManagement } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/FormWithStateManagement';
import JobBoard from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/JobBoard';
import JobBoard2 from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/JobBoard2';
import { JsonViewer } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/JsonViewer';
import { PostsComponent } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/PostsComponent';
import { WordOmitter } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/WordOmitter';

const PAGES: Record<string, React.ReactNode> = {
  'Hacker Rank: Word Omitter': <WordOmitter />,
  'Job Board 2': <JobBoard2 />,
  'Job Board': <JobBoard />,
  'Component with Observer': <ComponentWithObserver />,
  'Album Photo Application': <AlbumPhotoApplication />,
  'Layouts': <Layouts />,
  'Json Viewer': <JsonViewer />,
  'Book App': <BookApp />,
  'FormWith State Management': <FormWithStateManagement />,
  'Posts Component': <PostsComponent />,
  'Input Sanitizing': <InputSanitizing />,
};

export const Navbar = () => {
  const [currentPage, setCurrentPage] = useState<string>(Object.keys(PAGES)[0]);

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
