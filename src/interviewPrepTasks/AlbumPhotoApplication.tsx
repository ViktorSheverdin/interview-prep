import * as React from 'react';
import './App.css';

/**
 * We want to create a album photos application:
 * here is the mockup 👉 https://iili.io/gFL3TQ.png
 *
 * INSTRUCTIONS
 *
 * 1- Fetch a list of albums and render for each album its title
 * // create a method to fetch
 * 2- When clicking on an album title, render the photos for that album
 * 3- Display a loading message beside the header when we are fetching albums or photos
 * 4- (Bonus) Add a delete button underneath the photos to be able to delete the current album locally
 * 5- (Bonus) Add a text field underneath the header to filter albums per title
 *
 * ENDPOINTS
 *
 * List of albums: https://jsonplaceholder.typicode.com/albums
 *
 * type Album = {
 *  userId: number;
 *  id: number;
 *  title: string;
 * }
 *
 * List of photos for an album: https://jsonplaceholder.typicode.com/albums/{albumId}/photos
 *
 * type Photo = {
 *  albumId: number;
 *  id: number;
 *  title: string;
 *  url: string;
 *  thumbnailUrl: string;
 * }
 *
 *
 */

interface Album {
  userId: number;
  id: number;
  title: string;
}

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const BASE_FETCH_URL = 'https://jsonplaceholder.typicode.com/albums';
