import {Switch, Route} from "react-router-dom";
import LoginPage from './pages/LoginPage'
import SelecaoPage from './pages/SelecaoPage'
import ListaVacinadosPage from './pages/ListaVacinadosPage'
import VacinarPage from "./pages/VacinarPage";

export const Routes = () => {
    return (
        <Switch>
            <Route path={'/'} component={LoginPage} exact />
            <Route path={'/selecao'} component={SelecaoPage} />
            <Route path={'/listavacinados'} component={ListaVacinadosPage} />
            <Route path={'/vacinar'} component={VacinarPage} />
        </Switch>
    )
}