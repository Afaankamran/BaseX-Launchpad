import Footer from '@/components/Footer';
import Header from '../../components/Header';
import Main from '../../components/Main';
import Popups from '../../components/Popups';

const Layout = ({ children, banner = undefined }) => {
  return (
    <body className="darkmode">
      <div className="z-0 flex flex-col items-center w-full min-h-screen pb-16 lg:pb-0 bg">
        <Main>{children}</Main>
        <Popups />
      </div>
    </body>
  );
};

export default Layout;
