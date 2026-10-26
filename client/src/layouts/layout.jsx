import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ScrollTop from '../components/ScrollTop.jsx';


export default function Layout({ children }) {

    return (
        <>
            <Header />
            <ScrollTop/>
            <main>{children}</main>
            <Footer />
        </>
    );
}
