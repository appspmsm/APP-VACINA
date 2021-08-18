import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, makeStyles } from "@material-ui/core";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { ArrowBack, ExitToApp } from '@material-ui/icons';
import { useEffect, useState } from "react";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
    title: {
      flexGrow: 1
    }
  }));

function AppToolbar(props) {

    const classes = useStyles();
    const [backButton, setBackButton] = useState(false);
    const [logoutButton, setLogoutButton] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if(props.backButton){
            setBackButton(true);
        }
        if(props.logoutButton){
            setLogoutButton(true);
        }
    }, [props.backButton, props.logoutButton])

    const handleBack = () => {
        history.goBack();
    }

    const handleLogoutDialog = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    }

    const handleLogout = () => {
        setDialogOpen(false);
        localStorage.removeItem('token');
        history.push('/');
    }

    return(
        <AppBar position="static">
            <Toolbar>
                {backButton ? 
                    <IconButton edge="start" color="inherit" aria-label="voltar" onClick={handleBack}>
                        <ArrowBack />
                    </IconButton> : null}
                <Typography variant="h6" className={classes.title}>
                    Vacina SM
                </Typography>
                
                {logoutButton ? 
                    <div>
                        <IconButton edge="end" color="inherit" aria-label="sair" onClick={handleLogoutDialog}>
                            <ExitToApp />
                        </IconButton> 
                        <Dialog
                            open={dialogOpen}
                            onClose={handleDialogClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Sair"}</DialogTitle>
                            <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Deseja realmente sair?
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleDialogClose} color="primary">
                                Cancelar
                            </Button>
                            <Button onClick={handleLogout} color="primary" autoFocus>
                                Sair
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </div>: null}
                    
            </Toolbar>
        </AppBar>
    )
}

export default AppToolbar;