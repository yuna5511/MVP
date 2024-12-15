import { ReactNode } from 'react';
import NavBar from '../navigation/NavBar';

type PageLayoutProps = {
  children: ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="w-full h-full">
      <NavBar />
      <div className="flex h-full w-full pt-[64px]">{children}</div>
    </div>
  );
};

export default PageLayout;
