import React from 'react';
 import { NavLink } from 'react-router-dom';
 import { 
   Home, 
   PenSquare, 
   ListFilter, 
   Activity, 
   Map, 
   BarChart3, 
   Settings, 
   HelpCircle, 
   User
 } from 'lucide-react';
 
 const Sidebar = ({ isOpen }) => {
   const navItems = [
     { path: '/', icon: <Home size={20} />, label: 'Home' },
     { path: '/report', icon: <PenSquare size={20} />, label: 'Report Issue' },
     { path: '/issues', icon: <ListFilter size={20} />, label: 'Issue Feed' },
     { path: '/status', icon: <Activity size={20} />, label: 'Status Tracking' },
     { path: '/map', icon: <Map size={20} />, label: 'Map View' },
     { path: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
   ];
 
   const sidebarClasses = 
     `fixed left-0 top-0 z-20 h-full pt-16 transition-all duration-300 ease-in-out 
     bg-sidebar border-r border-white/5 
     ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0 md:w-20'}`;
 
   return (
     <aside className={sidebarClasses}>
       <div className="flex flex-col justify-between h-full py-6 overflow-y-auto">
         <nav className="space-y-2 px-3">
           {navItems.map((item) => (
             <NavLink
               key={item.path}
               to={item.path}
               className={({ isActive }) => 
                 `flex items-center p-3 rounded-md transition-colors
                 ${isActive 
                   ? 'bg-primary/20 text-primary' 
                   : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                 }`
               }
             >
               <span className="mr-3">{item.icon}</span>
               <span className={`${!isOpen ? 'md:hidden' : ''}`}>{item.label}</span>
             </NavLink>
           ))}
         </nav>

       </div>
     </aside>
   );
 };
 
 export default Sidebar;