import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useEffect, useState } from "react";
import { useHistory } from "react-router";

function AppToolbar(props) {

    const [backButton, setBackButton] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if(props.backButton){
            setBackButton(true);
        }
    }, [])

    const handleBack = () => {
        history.goBack();
    }

    return(
        <AppBar position="static">
            <Toolbar>
                {backButton ? 
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleBack}>
                        <ArrowBackIcon />
                    </IconButton> : null}
                <Typography variant="h6">
                    Vacinas
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default AppToolbar;