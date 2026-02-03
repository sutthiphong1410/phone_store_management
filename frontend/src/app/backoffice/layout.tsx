'use client'

import { useState } from "react";
import Sidebar from "../components/sidebar/page";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex h-screen gap-2">
        <div className="w-54 top-0 bottom-0 fixed">
             <Sidebar onSelect={() => setOpen(false)} />
        </div>
           <div className="ml-55 flex-1 p-6  shadow-2xl overflow-y-auto">
            {children}
           </div>
        </div>
    )
}

export default Layout;