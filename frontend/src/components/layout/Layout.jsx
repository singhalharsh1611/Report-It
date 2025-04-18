import React, { useState } from 'react';
 import Navbar from './Navbar';
 import Sidebar from './Sidebar';
 
 const Layout = ({ children }) => {
   const [sidebarOpen, setSidebarOpen] = useState(false);
 
   const toggleSidebar = () => {
     setSidebarOpen(!sidebarOpen);
   };
 
   return (
     <div className="flex h-screen overflow-hidden">
       {/* Fixed navbar at top */}
       <Navbar toggleSidebar={toggleSidebar} />
       
       {/* Sidebar */}
       <Sidebar isOpen={sidebarOpen} />
       
       {/* Main content */}
       <main className="flex-1 overflow-auto pt-16 md:pl-20">
         <div className="container mx-auto p-4 md:p-6">{children}</div>
       </main>
 
       {/* Mobile sidebar*/}
       {sidebarOpen && (
         <div
           className="fixed inset-0 z-10 bg-black/50 md:hidden"
           onClick={toggleSidebar}
         ></div>
       )}
     </div>
   );
 };
 
 export default Layout;