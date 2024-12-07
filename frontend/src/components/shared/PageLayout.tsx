import { ReactNode } from 'react';
import NavBar from '../navigation/NavBar';
import './PageLayout.css';

type PageLayoutProps = {
  children: ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="w-full h-full">
      <NavBar />
      <div className="contents">{children}</div>
    </div>
  );
};

export default PageLayout;
