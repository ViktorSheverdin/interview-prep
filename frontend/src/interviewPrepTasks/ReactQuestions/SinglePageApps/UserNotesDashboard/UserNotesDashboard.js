import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useAddPost } from './useAddPost';
import { useGetDetails } from './useGetDetails';
import { useGetPosts } from './useGetPosts';

export const UserNotesDashboard = () => {
  const { isLoading: isLoadingPosts, posts, setPosts } = useGetPosts();
  const {
    isLoading: isLoadingDetails,
    details,
    fetchDetails,
  } = useGetDetails();
  const [isOpen, setIsOpen] = useState(false);
  const { addPost } = useAddPost();

  const [form, setForm] = useState({ title: '', body: '' });
  const [formErrors, setFormErrors] = useState({});

  const handleDetails = (id) => {
    setIsOpen(true);
    fetchDetails(id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((field) => {
      if (!form[field]) newErrors[field] = 'required';
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length !== 0) {
      setFormErrors(errors);
    } else {
      const newPost = {
        title: form.title,
        body: form.body,
        userId: uuid(),
      };
      setPosts((prev) => [newPost, ...prev]);
      addPost(form.title, form.body);
      setForm({ title: '', body: '' });
      setFormErrors({});
    }
  };

  return (
    <div>
      <h3>User Notes Dashboard</h3>
      <div
        style={{
          display: 'grid',
          gap: '10px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        }}
      >
        <form
          style={{
            border: '1px solid black',
            marginTop: '10px',
            padding: '10px',
          }}
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div>
            <label htmlFor='title'>Title</label>
            <input
              id='title'
              name='title'
              value={form.title}
              onChange={(e) => handleChange(e)}
              placeholder='Title'
            />
            {formErrors?.title && (
              <p style={{ color: 'red' }}>{formErrors.title}</p>
            )}
          </div>
          <div>
            <label htmlFor='body'>Body</label>
            <input
              id='body'
              name='body'
              value={form.body}
              onChange={(e) => handleChange(e)}
              placeholder='body'
            />
            {formErrors?.body && (
              <p style={{ color: 'red' }}>{formErrors.body}</p>
            )}
          </div>
          <button type='submit'>Submit</button>
        </form>
        {isLoadingPosts ? (
          <div>Is Loading...</div>
        ) : (
          posts.map((post) => {
            return (
              <div
                style={{
                  border: '1px solid black',
                  marginTop: '10px',
                  padding: '10px',
                }}
                key={post.id}
              >
                <p>{post.title}</p>
                <p>{post.body}</p>
                <button
                  onClick={() => {
                    handleDetails(post.id);
                  }}
                >
                  View Details
                </button>
              </div>
            );
          })
        )}
      </div>
      {isOpen && (
        <div
          style={{
            width: '300px',
            height: '300px',
            position: 'fixed',
            left: '50%',
            top: '30%',
            overflow: 'auto',
            zIndex: '1',
            backgroundColor: 'white',
            boxShadow: '0 5px 8px black',
            padding: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>{details.title}</div>
            <button onClick={() => setIsOpen(false)}>X</button>
          </div>
          {isLoadingDetails || !details?.id ? (
            <div>Loading details...</div>
          ) : (
            <div style={{ marginTop: '10px' }}>
              {details.userId}
              {details.body}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
