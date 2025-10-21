// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { render, screen } from '@testing-library/react';

// import { AlbumPhotoApp2 } from './AlbumPhotoApp2';
// import * as api from './api';
// const mockAlbumsList = [
//   {
//     userId: 0,
//     id: 0,
//     title: 'Title 1',
//   },
//   {
//     userId: 0,
//     id: 1,
//     title: 'Title 2',
//   },
// ];

// const renderWithClient = () => {
//   const queryClient = new QueryClient();
//   return render(
//     <QueryClientProvider client={queryClient}>
//       <AlbumPhotoApp2 />
//     </QueryClientProvider>
//   );
// };

// describe('Interview prep', () => {
//   it('Renders album list', async () => {
//     vi.spyOn(api, 'getAlbums').mockResolvedValue(mockAlbumsList);

//     renderWithClient();
//     expect(await screen.findByText('Interview prep')).toBeInTheDocument();
//     expect(await screen.findByText('Title 1')).toBeInTheDocument();
//   });
// });

export {};
