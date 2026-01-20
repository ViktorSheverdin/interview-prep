import './Navbar.css';
import './Navbar.css';

import React, { useState } from 'react';

import { ComponentWithObserver } from '../../interviewPrepTasks/FrontendPatterns/Observable/ComponentWithObserver';
import { Dropdown } from '../../interviewPrepTasks/ReactQuestions/Layouts/Dropdown/Dropdown';
import { Layouts } from '../../interviewPrepTasks/ReactQuestions/Layouts/Layouts';
import { AlbumPhotoApplication } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/AlbumPhotoApplication';
import { BookApp } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/BookApp';
import { ColorPickerWrapper } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/CssPractice/ColorPicker/ColorPickerWrapper';
import { CommonAnimations } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/CssPractice/CommonAnimations/CommonAnimations';
import { ProductShowcase } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/CssPractice/ProductShowcase/ProductShowcase';
import { DisplayString } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/DislpayString/DisplayString';
import { ExcelTable } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/ExcelTable/ExcelTable';
import { ExpenseReimbursementPortal } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/ExpenseReimbursementPortal/ExpenseReimbursementPortal';
import { DynamicForm } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/FormPrep/DynamicForm';
import { FormWithStateManagement } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/FormWithStateManagement';
import { GraphQlCrud } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/GraphQlCrud/GraphQlCrud';
import { HRInterviewTest } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/HRInterviewTest';
import { InputSanitizing } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/InputSanitizing/InputSanitizing';
import JobBoard from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/JobBoard';
import JobBoard2 from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/JobBoard2';
import { JobBoard3 } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/JobBoard3/JobBoard3';
import { JsonViewer } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/JsonViewer';
import { PhotoApp4 } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/PhotoApp4/PhotoApp4';
import { PostsComponent } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/PostsComponent';
import { ProductConfiguratorDashboardWrap } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/ProductConfiguratorDashboard/ProductConfiguratorDashboardWrap';
import { SearchBar } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/SearchBar/SearchBar';
import { StaticLogin } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/StaticLogin/StaticLogin';
import { TodoApp } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/TodoApp/TodoApp';
import { UserManagementDashboard } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/UserManagementDashboard/UserManagementDashboard';
import { UserRegistrationForm } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/UserRegistrationForm/UserRegistrationForm';
import { UserSeachAndDetailsDashboard } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/UserSeachAndDetailsDashboard/UserSeachAndDetailsDashboard';
import { WordOmitter } from '../../interviewPrepTasks/ReactQuestions/SinglePageApps/WordOmitter';

const PAGES: Record<string, React.ReactNode> = {
  'UserRegistrationForm': <UserRegistrationForm />,
  'Dropdown': <Dropdown />,
  'ProductConfiguratorDashboard': <ProductConfiguratorDashboardWrap />,
  'Color picker': <ColorPickerWrapper />,
  'Common Animations': <CommonAnimations />,
  'Product Showcase': <ProductShowcase />,
  'Display String with effect': <DisplayString />,
  'ExpenseReimbursementPortal': <ExpenseReimbursementPortal />,
  'User Search & Details Dashboard': <UserSeachAndDetailsDashboard />,
  'Photo App 4': <PhotoApp4 />,
  'User Management Dashboard': <UserManagementDashboard />,
  'Todo App': <TodoApp />,
  'Dynamic Form': <DynamicForm />,
  'Graph QL crud': <GraphQlCrud />,
  'Excel Table': <ExcelTable />,
  'Static Login': <StaticLogin />,
  'Search Bar': <SearchBar />,
  'Job Board 3': <JobBoard3 />,
  'Hacker Rand Interview Test': <HRInterviewTest />,
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
