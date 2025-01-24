import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { capitalize } from '@mui/material';
import { useTranslation } from "react-i18next";


type NestedListProps = {
    children: React.ReactNode;
    text: string;
};
export default function NestedList(props: NestedListProps) {
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            aria-labelledby="nested-list-subheader"
        >
            <ListItemButton onClick={ handleClick }>
                <ListItemText primary={ props.text } />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={ open } timeout="auto" unmountOnExit>
                { props.children }
            </Collapse>
        </List>
    );
}
