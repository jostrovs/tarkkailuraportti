//const GET_DATA = 'http://www.lentopalloerotuomarit.fi/tark2343/tark/api/getData.php';
//const INSERT_REPORT = 'http://www.lentopalloerotuomarit.fi/tark2343/tark/api/insertReport.php';
const GET_DATA = './../api/getData.php';
const INSERT_REPORT = './../api/insertReport.php';

const EVENT_AVAA_RAPORTTI = "EVENT_AVAA_RAPORTTI";
const EVENT_RAPORTTI_VALITTU = "EVENT_RAPORTTI_VALITTU";
const EVENT_RAPORTIT_UPDATE = "EVENT_RAPORTIT_UPDATE";

const ROOLI_TUOMARI = 1;
const ROOLI_TARKKAILIJA = 0;

const API_HAE_TUOMARIT = 1;
const API_HAE_RAPORTIT = 2;
const API_HAE_RIVIT = 3;
const API_HAE_AIHEET = 4;
const API_HAE_RAPORTIN_RIVIT = 5;
const API_HAE_PT_RAPORTIT = 6;
const API_HAE_VT_RAPORTIT = 7;

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
        data: {cmd:cmd, arg1:arg1, token:getUserToken()}
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

class Referee {
      constructor(torneoReferee){
          this.id = torneoReferee.referee_id;
          this.name = torneoReferee.last_name + " " + torneoReferee.first_name;
          this.torneoReferee = torneoReferee;
          this.displayed = true;
          this.showWorkLoad = true;
          this.showDouble = true;
          this.href="https://lentopallo.torneopal.fi/taso/ottelulista.php?tuomari=" + torneoReferee.referee_id; 
    }  
}

class Tuomari {
    constructor(data_item){
        this.id = data_item.id;
        this.etunimi = data_item.etunimi;
        this.sukunimi = data_item.sukunimi;
        this.rooli = data_item.rooli;
    }
}

class Aihe {
    constructor(data_item){
        this.id = data_item.id;
        this.nimi = data_item.nimi;
        this.no = data_item.no;
        this.otsikko = data_item.otsikko;
        this.teksti = data_item.teksti;
    }
}

class Rivi {
    constructor(data_item){
        this.vanhat_rivit=[];

        if(data_item != null){
            this.id = data_item.id;
        } else {
            this.id = 0;
        }
        this.aihe_id = data_item.aihe_id;
        this.arvosana = data_item.arvosana;
        this.huom = data_item.huom;
        this.raportti_id = data_item.raportti_id;
        this.otsikko = data_item.otsikko;
        this.teksti = data_item.teksti;

        this.aihe_nimi = data_item.nimi;
        this.aihe_no = data_item.no;

        this.raportti_pvm = data_item.pvm;
        this.raportti_koti = data_item.koti;
        this.raportti_vieras = data_item.vieras;
        this.raportti_pt_score = data_item.pt_score;
        this.raportti_vt_score = data_item.vt_score;
    }
    tekstiDisplayed(){
        return this.teksti != undefined && this.teksti.length>0;
    }
    huomDisplayed(){
        return this.huom != undefined && this.huom.length>0;
    }
    getOttelu(){
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
}

class Huomautus {
    constructor(rivi){
        this.id = rivi.aihe_no;
        this.aihe = rivi.otsikko;
        this.teksti = rivi.huom;
    }
}

class Raportti {
    constructor(data_item){
        this.pt_score = -1;
        this.vt_score = -1;
        if(data_item != null){
            this.id = data_item.id;
            this.koti = data_item.koti;
            this.vieras = data_item.vieras;
            this.paikka = data_item.paikka;
            this.pvm = data_item.pvm;
            
            this.pt_id = data_item.pt_id;
            this.pt_nimi = `${data_item.pt_etunimi} ${data_item.pt_sukunimi}`;

            this.vt_id = data_item.vt_id;
            this.vt_nimi = `${data_item.vt_etunimi} ${data_item.vt_sukunimi}`;

            this.pt_huom = data_item.pt_huom;
            this.vt_huom = data_item.vt_huom;

            this.tark_id = data_item.tark_id;
            this.tark_nimi = `${data_item.tark_etunimi} ${data_item.tark_sukunimi}`;

            this.miehet = data_item.miehet;
            this.tulos = data_item.tulos;
            this.kesto_h = data_item.kesto_h;
            this.kesto_min = data_item.kesto_min;
            this.vaikeus = data_item.vaikeus;
        } else {
            this.id = "0";
            this.koti = "";
            this.vieras = "";
            this.paikka = "";
            this.pvm = "pvm";
            
            this.pt_id = "0";
            this.pt_nimi = "";

            this.vt_id = "0";
            this.vt_nimi = '';

            this.pt_huom = '',
            this.vt_huom = '',

            this.tark_id = "0";
            this.tark_nimi = '';

            this.miehet = true;
            this.tulos = "";
            this.kesto_h = 0;
            this.kesto_min = 0;
            this.vaikeus = NORMAALI;
        }
        this.rivit = [];
        this.laske();
    }

    palautaRivit(firstNo, lastNo){
        return this.rivit.filter(rivi => rivi.aihe_no >= firstNo && rivi.aihe_no <= lastNo);
    }

    palauta_pt_huomautukset(){
        let ret = [];
        for(let rivi of this.palautaRivit(1, 17))
        {
            if(rivi.huomDisplayed()){
                ret.push(new Huomautus(rivi));
            }
        }
        return ret;
    }
    palauta_vt_huomautukset(){
        let ret = [];
        for(let rivi of this.palautaRivit(101, 117))
        {
            if(rivi.huomDisplayed()){
                ret.push(new Huomautus(rivi));
            }
        }
        return ret;
    }


    laske(){
        let pt_score = 950;
        let vt_score = 950;
        for(let rivi of this.rivit){
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
    }

    getRivit(){
        let self = this;
        localGetData(API_HAE_RAPORTIN_RIVIT, function(data){
            self.rivit = [];
            if(data.data == undefined){
                    console.log("getRivit: data.data = null");
                    return;
            }
            for(let rivi of data.data){
                self.rivit.push(new Rivi(rivi));
            }
            self.laske();
        }, self.id);
    }

    title(){
        return this.koti + " - " + this.vieras + "   " + this.pvm;
    }
}