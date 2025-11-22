import Header from './Header';
import Footer from './Footer';
import ScrollTop from '../components/ScrollTop';


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
