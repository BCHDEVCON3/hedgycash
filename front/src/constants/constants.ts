import Home from '../pages/Home';
import Portfolio from '../pages/Portfolio/Portfolio';
import Book from '../pages/Book';
import User from '../pages/User';

export interface Page {
    title: string;
    path: string;
    component: any;
}

export const PAGES: Page[] = [
    { title: 'Home', path: '/home', component: Home },
    { title: 'Portfolio', path: '/portfolio', component: Portfolio },
    { title: 'Book', path: '/book', component: Book },
    { title: 'User', path: '/user', component: User },
];
