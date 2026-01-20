import { useEffect, useState } from 'react';

import { useGetDetails } from './useGetDetails';
import { useSeachExpenses } from './useSeachExpenses';

const ITEMS_PER_PAGE = 5;

export const ExpenseReimbursementPortal = () => {
  const [form, setForm] = useState({
    email: '',
    from: '',
    to: '',
  });
  const [errors, setErrors] = useState({});
  const {
    isLoading: isLoadingExpenses,
    expenses,
    fetchExpenses,
  } = useSeachExpenses();
  const {
    isLoading: isDetailsLoading,
    expenseDetails,
    fetchExpenseDetails,
  } = useGetDetails();
  const [displayExpenses, setDisplayExpenses] = useState([]);
  const [page, setPage] = useState(0);
  useEffect(() => {
    setDisplayExpenses(
      expenses.slice(
        page * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
      ),
    );
  }, [page, expenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const compareDates = (d1, d2) => {
    return new Date(d1).getTime() < new Date(d2).getTime();
  };

  const handleExpenseDetails = (id) => {
    fetchExpenseDetails(id);
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((field) => {
      if (field === 'email' && !validateEmail(form[field]))
        newErrors[field] = 'Invalid email';
      if (field === 'to' && !compareDates(form.from, form.to))
        newErrors[field] = 'Should be after from';
      if (!form[field]) newErrors[field] = 'Required';
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
    } else {
      fetchExpenses(form.email, form.from, form.to);
      //   setForm({ email: '', from: '', to: '' });
      //   setErrors({});
    }
  };

  const renderDetails = () => {
    if (isDetailsLoading) return <div>Loading Details...</div>;

    // const hasFlightExpenses = expenseDetails.body.includes('dolorem');
    // if (hasFlightExpenses) return <div>Requires manager approval</div>;

    return (
      <div>
        <p>Details</p>
        <div>{expenseDetails.title}</div>
        <div>{expenseDetails.body}</div>
      </div>
    );
  };

  return (
    <div>
      <div>ExpenseReimbursementPortal</div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            name='email'
            value={form.email}
            onChange={(e) => handleChange(e)}
          />
          <div style={{ color: 'red' }}>{errors.email}</div>
        </div>
        <div>
          <label htmlFor='from'>From</label>
          <input
            id='from'
            name='from'
            value={form.from}
            type='date'
            onChange={(e) => handleChange(e)}
          />
          <div style={{ color: 'red' }}>{errors.from}</div>
        </div>
        <div>
          <label htmlFor='to'>To</label>
          <input
            id='to'
            name='to'
            value={form.to}
            type='date'
            onChange={(e) => handleChange(e)}
          />
          <div style={{ color: 'red' }}>{errors.to}</div>
        </div>
        <button
          type='submit'
          disabled={isDetailsLoading || isLoadingExpenses}
        >
          Search
        </button>
      </form>
      <div>
        <div>
          {isLoadingExpenses ? (
            <div>Loading expenses...</div>
          ) : (
            <div>
              {displayExpenses.map((expense) => {
                return (
                  <div
                    key={expense.id}
                    onClick={() => {
                      handleExpenseDetails(expense.id);
                    }}
                  >
                    {expense.title}
                  </div>
                );
              })}
            </div>
          )}
          <button
            disabled={page <= 0}
            onClick={() => {
              setPage((prev) => Math.max(prev - 1, 0));
            }}
          >
            Back
          </button>
          <button
            disabled={(page + 1) * ITEMS_PER_PAGE >= expenses.length}
            onClick={() => {
              setPage((prev) => prev + 1);
            }}
          >
            Next
          </button>
        </div>
        <div>{renderDetails()}</div>
      </div>
    </div>
  );
};
