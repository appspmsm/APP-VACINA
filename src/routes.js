import {Switch, Route} from "react-router-dom";
import LoginPage from './pages/LoginPage'
import SelecaoPage from './pages/SelecaoPage'
import ListaVacinadosPage from './pages/ListaVacinadosPage'
import VacinarPage from "./pages/VacinarPage";

export const Routes = () => {
    return (
        <Switch>
            <Route path={process.env.PUBLIC_URL + '/'} component={LoginPage} exact />
            <Route path={process.env.PUBLIC_URL + '/selecao'} component={SelecaoPage} />
            <Route path={process.env.PUBLIC_URL + '/listavacinados'} component={ListaVacinadosPage} />
            <Route path={process.env.PUBLIC_URL + '/vacinar'} component={VacinarPage} />
        </Switch>
    )
}