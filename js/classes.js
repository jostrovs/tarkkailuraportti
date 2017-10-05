var GET_DATA = 'http://www.lentopalloerotuomarit.fi/tark2343/tark/api/getData.php';
var INSERT_REPORT = 'http://www.lentopalloerotuomarit.fi/tark2343/tark/api/insertReport.php';
var REQUEST_LINK = 'http://www.lentopalloerotuomarit.fi/tark2343/tark/api/requestLink.php';
if(location.href.indexOf("localhost")>-1){
    GET_DATA = './../api/getData.php';
    INSERT_REPORT = './../api/insertReport.php';
    REQUEST_LINK = './../api/requestLink.php';
}

var BROWSER= (function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

const EVENT_AVAA_RAPORTTI = "EVENT_AVAA_RAPORTTI";
const EVENT_RAPORTTI_VALITTU = "EVENT_RAPORTTI_VALITTU";
const EVENT_RAPORTIT_UPDATE = "EVENT_RAPORTIT_UPDATE";
const EVENT_LOGOUT = "EVENT_LOGOUT";
const EVENT_SAVE_EMAIL = "EVENT_SAVE_EMAIL";
const EVENT_EMAIL_SAVED = "EVENT_EMAIL_SAVED";
const EVENT_REQUEST_LINK = "EVENT_REQUEST_LINK";

const ROOLI_ADMIN = 2;
const ROOLI_TUOMARI = 1;
const ROOLI_TARKKAILIJA = 0;

const API_HAE_TUOMARIT = 1;
const API_HAE_RAPORTIT = 2;
const API_HAE_RIVIT = 3;
const API_HAE_AIHEET = 4;
const API_HAE_RAPORTIN_RIVIT = 5;
const API_HAE_PT_RAPORTIT = 6;
const API_HAE_VT_RAPORTIT = 7;
const API_LOGIN = 8;
const API_SAVE_EMAIL = 9;

var kertoimet = [];
kertoimet["1"]  = [20000, 5,  0,  -5, -10, -20, -100];
kertoimet["2"]  = [20000, 2,  0,  -5, -10, -30, -100];
kertoimet["3"]  = [20000, 2,  0, -10, -20, -40, -100];
kertoimet["4"]  = [20000, 2,  0,  -5, -10, -30, -100];
kertoimet["5"]  = [20000, 2,  0,  -5, -10, -30, -100];
kertoimet["6"]  = [20000, 10, 0, -10, -30, -60, -400];
kertoimet["7"]  = [20000, 10, 0, -10, -30, -60, -400];
kertoimet["8"]  = [20000,  5, 0,  -5, -20, -60, -400];
kertoimet["9"]  = [20000,  5, 0,  -5, -10, -30, -400];
kertoimet["10"] = [20000,  5, 0,  -5, -10, -20, -100];
kertoimet["11"] = [20000, 10, 0, -10, -30, -60, -400];
kertoimet["12"] = [20000,  5, 0,  -5, -10, -30, -400];
kertoimet["13"] = [20000,  5, 0,  -5, -10, -30, -100];
kertoimet["14"] = [20000,  5, 0,  -5, -10, -20, -100];
kertoimet["15"] = [20000, 10, 0, -10, -20, -50, -400];
kertoimet["16"] = [20000, 10, 0,  -5, -20, -40, -100];
kertoimet["17"] = [20000, 10, 0, -10, -20, -40, -100];

kertoimet["101"] = [20000,  5,  0,  -5, -10, -20, -100];
kertoimet["102"] = [20000,  2,  0, -10, -30, -60, -400];
kertoimet["103"] = [20000,  2,  0,  -5, -10, -30, -100];
kertoimet["104"] = [20000, 10,  0, -10, -20, -40, -100];
kertoimet["105"] = [20000,  2,  0,  -5, -10, -30, -100];
kertoimet["106"] = [20000, 10,  0,  -5, -10, -30, -100];
kertoimet["107"] = [20000, 10, 0, -10, -30, -60, -400];
kertoimet["108"] = [20000, 10, 0, -10, -30, -60, -400];
kertoimet["109"] = [20000,  5, 0,  -5, -20, -60, -400];
kertoimet["110"] = [20000,  5, 0,  -5, -10, -30, -400];
kertoimet["111"] = [20000,  5, 0, - 5, -10, -20, -100];
kertoimet["112"] = [20000,  5, 0,  -5, -10, -30, -400];
kertoimet["113"] = [20000,  5, 0,  -5, -10, -30, -100];
kertoimet["114"] = [20000,  5, 0,  -5, -10, -20, -100];
kertoimet["115"] = [20000, 10, 0, -10, -20, -50, -400];
kertoimet["116"] = [20000, 10, 0,  -5, -20, -40, -100];
kertoimet["117"] = [20000, 10, 0, -10, -20, -40, -100];

const HELPPO = 1;
const NORMAALI = 2;
const VAIKEA = 3;

function getQueryString() {
    var result = {}, queryString = location.search.slice(1),
        re = /([^&=]+)=([^&]*)/g, m;
  
    while (m = re.exec(queryString)) {
      result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
  
    return result;
}

function getUserToken(){
    let token = getQueryString()['token'];
    if(token == undefined || token == null || token.length < 1){
        if(localStorage.lentopalloerotuomarit_tarkUserToken){
            return localStorage.lentopalloerotuomarit_tarkUserToken;
        }
    }
    localStorage.lentopalloerotuomarit_tarkUserToken = token;
    return token;
}

var localGetData=function(cmd, callback, arg1, token) {
    $.ajax({
        dataType: 'json',
        url: GET_DATA,
        data: {cmd:cmd, arg1:arg1, token:getUserToken(), browser: BROWSER}
    }).done(function(data){
        if(data.error == 1){
            toastr.error("Käyttäjää ei ole autentikoitu. (1)");
            return;
        }
        if(callback != undefined){
            callback(data);
        }
    }).fail(function(){
        toastr.error("Tietojen haku kannasta epäonnistui.")
    });
}

function Referee(torneoReferee){
    return {
        id : torneoReferee.referee_id,
        name : torneoReferee.last_name + " " + torneoReferee.first_name,
        torneoReferee : torneoReferee,
        displayed : true,
        showWorkLoad : true,
        showDouble : true,
        href:"https://lentopallo.torneopal.fi/taso/ottelulista.php?tuomari=" + torneoReferee.referee_id,
    }
}

function Tuomari(data_item){
    return {
        id : data_item.id,
        etunimi : data_item.etunimi,
        sukunimi : data_item.sukunimi,
        rooli : data_item.rooli,
    }
}

function Aihe(data_item){
    return {
        id : data_item.id,
        nimi : data_item.nimi,
        no : data_item.no,
        otsikko : data_item.otsikko,
        teksti : data_item.teksti,
    }
}

function Rivi(data_item){
    ret = {
        vanhat_rivit:[],
        
        aihe_id : data_item.aihe_id,
        arvosana : data_item.arvosana,
        huom : data_item.huom,
        raportti_id : data_item.raportti_id,
        otsikko : data_item.otsikko,
        teksti : data_item.teksti,

        aihe_nimi : data_item.nimi,
        aihe_no : data_item.no,

        raportti_pvm : data_item.pvm,
        raportti_koti : data_item.koti,
        raportti_vieras : data_item.vieras,
        raportti_pt_score : data_item.pt_score,
        raportti_vt_score : data_item.vt_score,

        tekstiDisplayed: function(){
            return this.teksti != undefined && this.teksti.length>0;
        },
        huomDisplayed: function(){
            return this.huom != undefined && this.huom.length>0;
        },
        getOttelu: function(){
            let pvm = "&lt;ei pvm&gt;";
            if(this.raportti_pvm != undefined) pvm = this.raportti_pvm.split(" ")[0];
            return {
                pvm: pvm,
                koti: this.raportti_koti,
                vieras: this.raportti_vieras,
                pt_score: this.raportti_pt_score,
                vt_score: this.raportti_vt_score,
            };
        }
    
    };
    if(data_item != null){
        ret.id = data_item.id;
    } else {
        ret.id = 0;
    }
    return ret;
}

function Huomautus(rivi){
    return {
        id : rivi.aihe_no,
        aihe : rivi.otsikko,
        teksti : rivi.huom,
    }
}

function Raportti(data_item){
    ret = {
        id : "0",
        koti : "",
        vieras : "",
        paikka : "",
        pvm : "",
        
        pt_id : "0",
        pt_nimi : "",

        vt_id : "0",
        vt_nimi : '',

        pt_huom : '',
        vt_huom : '',
        raportti_huom : '',

        tark_id : "0",
        tark_nimi : '',

        miehet : true,
        tulos : "",
        kesto_h : 0,
        kesto_min : 0,
        vaikeus : NORMAALI,

        pt_score: -1,
        vt_score: -1,
    
        rivit: [],

        palautaRivit: function(firstNo, lastNo){
            return this.rivit.filter(function(rivi){rivi.aihe_no >= firstNo && rivi.aihe_no <= lastNo});
        },
    
        palauta_pt_huomautukset: function(){
            let ret = [];
            let rivit = this.palautaRivit(1, 17);
            for(let i=0;i<rivit.length;i++){
                let rivi=rivit[i];
                if(rivi.huomDisplayed()){
                    ret.push(Huomautus(rivi));
                }
            }
            return ret;
        },
        palauta_vt_huomautukset: function(){
            let ret = [];
            let rivit = this.palautaRivit(100, 117);
            for(let i=0;i<rivit.length;i++){
                let rivi=rivit[i];
                if(rivi.huomDisplayed()){
                    ret.push(Huomautus(rivi));
                }
            }
            return ret;
        },
    
        laske: function(){
            let pt_score = 950;
            let vt_score = 950;
            for(let i=0;i<this.rivit.length;++i){
                let rivi = this.rivit[i];
                let index = rivi.arvosana;
                if(index == undefined) index = 2;
                let k_rivi = kertoimet[rivi.aihe_no];
                if(k_rivi==undefined){
                    let breaker=0;
                }
                let k_a = k_rivi[index];
                
                if(rivi.aihe_no < 100){
                    pt_score += k_a;
                } else {
                    vt_score += k_a;
                }
            }
    
            this.pt_score = pt_score/10;
            this.vt_score = vt_score/10;
            if(this.rivit.length < 1 || this.pt_score > 200) this.pt_score = "<puuttuu>";
            if(this.rivit.length < 1 || this.vt_score > 200) this.vt_score = "<puuttuu>";
        },
    
        getRivit: function(){
            let self = this;
            localGetData(API_HAE_RAPORTIN_RIVIT, function(data){
                self.rivit = [];
                if(data.data == undefined){
                        console.log("getRivit: data.data = null");
                        return;
                }
                for(let i=0;i<data.data.length;++i){
                    let rivi=data.data[i];
                    self.rivit.push(Rivi(rivi));
                }
                self.laske();
            }, self.id);
        },
    
        title: function(){
            return this.koti + " - " + this.vieras + "   " + this.pvm;
        }
    };

    if(data_item != null){
        ret.id = data_item.id;
        ret.koti = data_item.koti;
        ret.vieras = data_item.vieras;
        ret.paikka = data_item.paikka;
        ret.pvm = data_item.pvm;
        
        ret.pt_id = data_item.pt_id;
        ret.pt_nimi = data_item.pt_etunimi + ' ' + data_item.pt_sukunimi;

        ret.vt_id = data_item.vt_id;
        ret.vt_nimi = data_item.vt_etunimi + ' ' + data_item.vt_sukunimi;

        ret.pt_huom = data_item.pt_huom;
        ret.vt_huom = data_item.vt_huom;

        ret.raportti_huom = data_item.raportti_huom;

        ret.tark_id = data_item.tark_id;
        ret.tark_nimi = data_item.tark_etunimi + " " + data_item.tark_sukunimi;

        ret.miehet = data_item.miehet;
        ret.tulos = data_item.tulos;
        ret.kesto_h = data_item.kesto_h;
        ret.kesto_min = data_item.kesto_min;
        ret.vaikeus = data_item.vaikeus;
    }
    
    ret.laske();

    return ret;
}