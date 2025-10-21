// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import * as api from './api';
// import { JobBoard3 } from './JobBoard3';
// import { fireEvent, render, screen } from '@testing-library/react';

// const mockIds = Array.from({ length: 12 }, (_, i) => i++);
// const makeJob = (id: number) => {
//   return {
//     id,
//     text: `Job text ${id}`,
//     title: `Job title ${id}`,
//     url: 'url',
//     type: 'type',
//     time: new Date().getTime() + id,
//     score: id,
//     by: 'by',
//   };
// };

// const renderWithClient = (ui: React.ReactNode) => {
//   const client = new QueryClient();
//   return render(
//     <QueryClientProvider client={client}>{ui}</QueryClientProvider>
//   );
// };

// describe('Interview perp', () => {
//   beforeEach(() => {
//     vi.resetAllMocks();
//   });

//   it('Loads first six jobs', async () => {
//     vi.spyOn(api, 'getJobIds').mockResolvedValue(mockIds);
//     vi.spyOn(api, 'getJobDetails').mockImplementation(async (id) =>
//       makeJob(id)
//     );

//     renderWithClient(<JobBoard3 />);
//     expect(await screen.findByText('Job text 1')).toBeInTheDocument();
//     expect(await screen.queryByText('Job text 7')).not.toBeInTheDocument();

//     fireEvent.click(screen.getByText('Load more'));

//     expect(await screen.findByText('Job text 7')).toBeInTheDocument();
//   });
// });

export {};
