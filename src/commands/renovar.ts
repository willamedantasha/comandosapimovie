import { buscarLogin, updateLogin } from "../controller/loginDBController";
import { buscarUser } from "../controller/userDBController";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { Login } from "../type/login";
import { User } from "../type/user";

export default async ({ sendText, reply, remoteJid, args, owner }: IBotData) => {
    const user: User = buscarUser(remoteJid)
    if (user || owner) {
        let credito: number = owner ? 1 : user.credito;
        if (credito <= 0) {
            return reply(StringsMsg.errorSaldo);
        }

        let usrLogin = user.nome;
        if (args) {
            if (args.length < 8) {
                return await reply(StringsMsg.errorLoginSize);
            }
            usrLogin = StringClean(args);
        }


        let login: Login = buscarLogin(usrLogin);
        if (login) {

            const agora = new Date();
            let vencimento = new Date(login.vencimento);
            if (agora > vencimento) {
                vencimento.setDate(agora.getDate() + 30);
            }

            vencimento.setDate(vencimento.getDate() + 30);
            login.vencimento = vencimento.toISOString();
            updateLogin(login)
            let msg = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n          📺 *MOVNOW* 📺 \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n \n';
            msg += `Seu usuário ${login.user} foi renovado com sucesso! Para mais informações digite o comando #info.`;
            return await sendText(true, msg);
        }
        reply(StringsMsg.errorLogin);
    } else {
        await reply(StringsMsg.errorUser);
    }
}