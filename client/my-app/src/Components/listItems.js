import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import LayersIcon from '@mui/icons-material/Layers';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <React.Fragment>
    
    <ListItemButton component={Link} to="/system-user/items">
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Items" />
    </ListItemButton>
    <ListItemButton component={Link} to="/system-user/invoices">
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Invoices" />
    </ListItemButton>
  </React.Fragment>
);

export const adminListItems = (
  <React.Fragment>
    
    <ListItemButton component={Link} to="/admin">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Users" />
    </ListItemButton>
    
  </React.Fragment>
);

