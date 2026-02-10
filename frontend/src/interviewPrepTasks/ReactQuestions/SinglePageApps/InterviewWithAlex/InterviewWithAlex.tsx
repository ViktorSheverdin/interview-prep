// TASK HERE https://gist.github.com/alexghenderson/6421b22ac741df37ac8aa74b80856ca5

// import { ChangeEvent, FormEvent, useState } from 'react';

// // Practice building with generics
// // Build Autocomplete with it

// type Theme = 'light' | 'dark' | 'system';
// type Language = 'en' | 'fr' | 'es';
// type AutoSaveInterval = 5 | 10 | 30;

// interface Settings {
//   username: string;
//   theme: Theme;
//   notifications: boolean;
//   language: Language;
//   autoSaveInterval: AutoSaveInterval;
//   experimental: boolean;
// }

// interface IToggle {
//   checked: boolean;
//   onChange: (value: boolean) => void;
//   name: string;
// }

// interface ISelect<T> {
//   value: T;
//   options: { label: string; value: T }[];
//   onChange: (value: T) => void;
// }

// interface IAccordion {
//   title: string

// children: React.ReactNode
// }

// const Toggle = (props: IToggle) => {
//   const { checked, onChange, name } = props;
//   return (
//     <div>
//       <input
//         type='checkbox'
//         name={name}
//         value={name}
//         checked={checked}
//         onChange={() => {}}
//       />
//     </div>
//   );
// };

// const Select = <T extends string>(props: ISelect<T>) => {
//   const { value, options, onChange } = props;

//   return (
//     <select
//       value={value}
//       onChange={(e) => {
//         onChange(e.target.value as T);
//       }}
//     >
//       {options.map((option) => {
//         return <option key={option.label}>{option.label}</option>;
//       })}
//     </select>
//   );
// };

// const Accordion = () => {
//   const [isOpen, setIsOpen] = useState(false)

//   return (
//   <div>
//     {isOpen ? {(<div>{children}</div>)} : null}
//   </div>
//   )
// }

// export const InterviewWithAlex = () => {
//   const [form, setForm] = useState<Settings>({
//     username: '',
//     theme: 'light',
//     notifications: false,
//     language: 'en',
//     autoSaveInterval: 5,
//     experimental: false,
//   });

//   // Insteadof doing this, I need to pass a parameter with the type that
//   // Form requires from this parameter.
//   // IE if form has a: string and b: number, handleChange should take
//   // const handleChange = <T>(name: value, value: T[name]) => void
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     console.log(form);
//   };

//   // const handleTheme = () => {

//   // }

//   return (
//     <div>
//       <h1>Interview with Alex</h1>
//       <form>
//         <button
//           type='submit'
//           onSubmit={(e) => {
//             handleSubmit(e);
//           }}
//         >
//           Submit
//         </button>
//         <label htmlFor='username'>User Name</label>
//         <input
//           id='username'
//           name='username'
//           value={form.username}
//           onChange={(e) => {
//             handleChange(e);
//           }}
//         />
//         <Select
//           value={form.theme}
//           onChange={handleChange}
//         />
//         <Toggle
//           checked={false}
//           onChange={() => {}}
//           name={'Notification'}
//         />
//       </form>
//     </div>
//   );
// };
export const InterviewWithAlex = () => {
  return <div></div>;
};
