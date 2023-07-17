// import * as React from 'react';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import PeopleIcon from '@mui/icons-material/People';
// import LayersIcon from '@mui/icons-material/Layers';
// import { Link } from 'react-router-dom';

// export const mainListItems = (
//   <React.Fragment>
    
//     <ListItemButton component={Link} to="/system-user/items">
//       <ListItemIcon>
//         <ShoppingCartIcon />
//       </ListItemIcon>
//       <ListItemText primary="Items" />
//     </ListItemButton>
//     <ListItemButton component={Link} to="/system-user/invoices">
//       <ListItemIcon>
//         <LayersIcon />
//       </ListItemIcon>
//       <ListItemText primary="Invoices" />
//     </ListItemButton>
//   </React.Fragment>
// );

// export const adminListItems = (
//   <React.Fragment>
    
//     <ListItemButton component={Link} to="/admin">
//       <ListItemIcon>
//         <PeopleIcon />
//       </ListItemIcon>
//       <ListItemText primary="Users" />
//     </ListItemButton>
    
//   </React.Fragment>
// );

import React, { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import LayersIcon from '@mui/icons-material/Layers';
import { Link } from 'react-router-dom';

const ListItems = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <React.Fragment>
      {items.map((item) => (
        <ListItemButton
          key={item.route}
          component={Link}
          to={item.route}
          selected={selectedItem === item.label}
          onClick={() => handleItemClick(item.label)}
          style={{ backgroundColor: selectedItem === item.label ? '#bbdbf9' : 'transparent' }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </React.Fragment>
  );
};

export const mainListItems = (
  <ListItems
    items={[
      { label: 'Items', icon: <ShoppingCartIcon />, route: '/system-user/items' },
      { label: 'Invoices', icon: <LayersIcon />, route: '/system-user/invoices' }
    ]}
  />
);

export const adminListItems = (
  <ListItems
    items={[
      { label: 'Users', icon: <PeopleIcon />, route: '/admin' }
    ]}
  />
);


