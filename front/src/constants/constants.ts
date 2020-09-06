// import Home from '../pages/Home';
// import Portfolio from '../pages/Portfolio/Portfolio';
import OrderBook from '../pages/Book';
import History from '../pages/History';
import NewContract from '../pages/NewContract/NewContract';

export interface Page {
    title: string;
    path: string;
    component: any;
}

export const PAGES: Page[] = [
    { title: 'Contract List', path: '/contracts', component: OrderBook },
    { title: 'New Contract', path: '/trade', component: NewContract },
    { title: 'History', path: '/history', component: History },
];
