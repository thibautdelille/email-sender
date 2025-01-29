import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from '../components/Home';
import { ContactsPage } from '../components/ContactsPage';
import { ContactPage } from '../components/ContactPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/contact/:id" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
};
