import React, { useEffect } from "react";
import AppToolbar from "../components/AppToolbar";
import Dexie from 'dexie';
import { useHistory } from "react-router";
import { Button, CircularProgress, List, ListItem, ListItemText, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    list: {
        paddingBottom: '100px'
    },
    progress: {
        color: 'blue',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    buttonDiv: {
        position: 'fixed',
        bottom: 20,
        textAlign: 'center',
        width: '100%'
    },

}));

function ListaCadastrosPage() {
    const classes = useStyles();
    const history = useHistory();
    const [cadastros, setCadastros] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const db = new Dexie('Cadastros');
    db.version(1).stores({
      cadastros: '++id, cpf, status'
    });

    useEffect(()=>{
        getCadastros();
    }, [])

    const getCadastros = async () => {
        setLoading(true);
        const cadastrosIdb = await db.cadastros.toArray();
        setCadastros(cadastrosIdb);
        setLoading(false);
    }

    const handleAdd = () => {
        history.push('/novocadastro');
    }

    return(
        <div>
            <AppToolbar logoutButton/>
            <div>
                <Typography variant="h6">Registros</Typography>
                <List dense className={classes.list} >
                    {cadastros.map((cadastro) => {
                        return (
                            <ListItem key={cadastro.id} button divider>
                                <ListItemText
                                    primary={cadastro.nome}
                                    secondary={'CPF: ' + cadastro.cpf + ' - ' + (cadastro.status === 'ok' ? 'Enviado' : 'Pendente')}
                                />
                            </ListItem>
                        )
                    })}      
                </List>
                {loading && <CircularProgress size={24} className={classes.progress} />}
            </div>
            <div className={classes.buttonDiv}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAdd}
                    >Adicionar
                </Button>
            </div>
        </div>
    )
}

export default ListaCadastrosPage;