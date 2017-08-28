
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

var localGetData=function(cmd, callback, arg1) {
    $.ajax({
        dataType: 'json',
        url: './../api/getData.php',
        data: {cmd:cmd, arg1:arg1}
    }).done(function(data){
        if(callback != undefined){
            callback(data);
        }
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
        } else {
            this.id = 0;
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
        }
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
        return `${pvm} ${this.raportti_koti}-${this.raportti_vieras}`;
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

            this.tark_id = data_item.tark_id;
            this.tark_nimi = `${data_item.tark_etunimi} ${data_item.tark_sukunimi}`;
        } else {
            this.id = "0";
            this.koti = "koti";
            this.vieras = "vieras";
            this.paikka = "ottelupaikka";
            this.pvm = "pvm";
            
            this.pt_id = "0";
            this.pt_nimi = "";

            this.vt_id = "0";
            this.vt_nimi = '';

            this.tark_id = "0";
            this.tark_nimi = '';
        }
        this.rivit = [];
        this.laske();
    }

    palautaRivit(firstNo, lastNo){
        return this.rivit.filter(rivi => rivi.aihe_no >= firstNo && rivi.aihe_no <= lastNo);
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
        if(this.rivit.length < 1 || this.pt_score > 100) this.pt_score = "<puuttuu>";
        if(this.rivit.length < 1 || this.vt_score > 100) this.vt_score = "<puuttuu>";
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
        }, self.id);
    }
}

$(document).ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            dummy: [1, 2, 3, 4, 5],
            tuomarit: [],
            aiheet: [],
            ptRivit: [],
            vtRivit: [],
            rivit: [],
            raportit: [],

            selectedReport: null,
            raportti: new Raportti(),
            uusi_raportti: new Raportti(),

            postResponse: "Tänne tulee response",

            jos: false, // debug-flägi
            debug: "Ei debuggia",
        },
        
        created: function () {
            this.loadTuomarit();
            this.loadAiheet();
            this.loadRivit();
            this.loadRaportit();
            this.newReport();
        },
        computed: {
        },
        methods: {
            getData: function(cmd, callback, arg1) {
                let self=this;
                $.ajax({
                    dataType: 'json',
                    url: './../api/getData.php',
                    data: {cmd:cmd, arg1:arg1}
                }).done(function(data){
                    self.debug = JSON.stringify(data.debug, undefined, 2);
                    if(callback != undefined){
                        callback(data);
                    }
                });
            },

            uudenRivit: function(firstNo, lastNo){
                return this.uusi_raportti.rivit.filter(rivi => rivi.aihe_no >= firstNo && rivi.aihe_no <= lastNo);
            },

            valitunRivit: function(firstNo, lastNo){
                return this.raportti.rivit.filter(rivi => rivi.aihe_no >= firstNo && rivi.aihe_no <= lastNo);
            },

            loadTuomarit: function(){
                let self=this;
                this.getData(API_HAE_TUOMARIT, function(data){
                    self.tuomarit = [];
                    if(data.data == undefined){
                         console.log("loadTuomarit: data.data = null");
                         return;
                    }
                    for(let tuomari of data.data){
                        self.tuomarit.push(new Tuomari(tuomari));
                    }
                })
            },

            loadAiheet: function(){
                let self=this;
                this.getData(API_HAE_AIHEET, function(data){
                    self.aiheet = [];
                    if(data.data == undefined){
                         console.log("loadAiheet: data.data = null");
                         return;
                    }
                    for(let aihe of data.data){
                        self.aiheet.push(new Aihe(aihe));
                    }
                    self.newReport();
                })
            },

            loadRaportit: function(){
                let self=this;
                this.getData(API_HAE_RAPORTIT, function(data){
                    self.raportit = [];
                    if(data.data == undefined){
                         console.log("loadRaportit: data.data = null");
                         return;
                    }
                    for(let raportti of data.data){
                        self.raportit.push(new Raportti(raportti));
                    }
                })
            },

            loadRivit: function(){
                let self=this;
                this.getData(API_HAE_RIVIT, function(data){
                    self.rivit = [];
                    if(data.data == undefined){
                         console.log("loadRivit: data.data = null");
                         return;
                    }
                    for(let rivi of data.data){
                        self.rivit.push(new Rivi(rivi));
                    }
                })
            },

            ptChanged: function(){
                let self=this;
                if(self.uusi_raportti == undefined || self.uusi_raportti.pt_id == undefined) return;
                this.getData(API_HAE_PT_RAPORTIT, function(data){
                    self.ptRivit = [];
                    if(data.data == null) return;
                    for(let rivi of data.data){
                        self.ptRivit.push(new Rivi(rivi));
                    }
                    self.asetaVanhatRivit();
                }, self.uusi_raportti.pt_id);
            },

            vtChanged: function(){
                let self=this;
                if(self.uusi_raportti == undefined || self.uusi_raportti.vt_id == undefined) return;
                this.getData(API_HAE_VT_RAPORTIT, function(data){
                    self.vtRivit = [];
                    if(data.data == null) return;
                    for(let rivi of data.data){
                        self.vtRivit.push(new Rivi(rivi));
                    }
                    self.asetaVanhatRivit();
                }, self.uusi_raportti.vt_id);
            },

            asetaVanhatRivit: function(){
                // ptRivit- ja vtRivit-muuttujissa on nyt tiedot tuomareiden vanhoista peleistä.
                // Asetetaan rrden raportin rivit-muuttujille näiden vanhojen arvot
                for(let rivi of this.uusi_raportti.rivit){
                    if(rivi.aihe_no < 100){
                        rivi.vanhat_rivit = this.ptRivit.filter(r => r.aihe_no == rivi.aihe_no);
                    }
                    else {
                        rivi.vanhat_rivit = this.vtRivit.filter(r => r.aihe_no == rivi.aihe_no);
                    }
                }
            },

            reportSelected: function(){
                if(this.selectedReport == undefined) return;
                
                for(let raportti of this.raportit){
                    if(raportti.id == this.selectedReport){
                        this.raportti = raportti;
                        this.raportti.getRivit();
                    }
                }
            },

            newReport: function(){
                this.uusi_raportti = new Raportti();
                this.uusi_raportti.rivit = [];
                
                for(let aihe of this.aiheet){
                    this.uusi_raportti.rivit.push(new Rivi({
                        aihe_id: aihe.id,
                        nimi: aihe.nimi,
                        no: aihe.no,
                        otsikko: aihe.otsikko,
                        teksti: aihe.teksti,
                        huom: "",
                    }))
                }
            },

            test_fill: function(){
                let now = moment(Date.now());
                let pvm = now.format("YYYY-MM-DD") + "T" + now.format("hh:mm");
                console.log(pvm);
                $("#pvm").val(pvm);
                $("#pt").val("1");
                $("#vt").val("1");
                $("#tark").val("1");
                
                let as = 1;
                for(let i=1;i<118;++i){
                    let id = i.toString() + "_" + as++;
                    if(as > 5) as = 1;
                    $("#" + id).trigger("click");
                    if(i == 17) i = 100;
                }


            },

            postData: function(){
                let self = this;
                let formdata= {
                    pvm: self.uusi_raportti.pvm,
                    paikka: self.uusi_raportti.paikka,
                    koti: self.uusi_raportti.koti,
                    vieras: self.uusi_raportti.vieras,
                    pt_id: self.uusi_raportti.pt_id,
                    vt_id: self.uusi_raportti.vt_id,
                    tark_id: self.uusi_raportti.tark_id,

                    // aihe_1_id: self.uusi_raportti.rivit[0].aihe_id,
                    // aihe_1_arvosana: self.uusi_raportti.rivit[0].arvosana,

                    // aihe_2_id: self.uusi_raportti.rivit[1].aihe_id,
                    // aihe_2_arvosana: self.uusi_raportti.rivit[1].arvosana,

                    // aihe_3_id: self.uusi_raportti.rivit[1].aihe_id,
                    // aihe_3_arvosana: self.uusi_raportti.rivit[1].arvosana,

                    // aihe_4_id: self.uusi_raportti.rivit[1].aihe_id,
                    // aihe_4_arvosana: self.uusi_raportti.rivit[1].arvosana,
                };

                let i_rivi=0;

                for(let i=1;i<118;++i){
                    let key = "aihe_" + i.toString();
                    console.log(key);
                    formdata[key+"_id"] = self.uusi_raportti.rivit[i_rivi].aihe_id;
                    formdata[key+"_arvosana"] = self.uusi_raportti.rivit[i_rivi].arvosana;
                    formdata[key+"_huom"] = self.uusi_raportti.rivit[i_rivi].huom;
                    ++i_rivi;
                    if(i==17) i=100;
                }

                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    //url: './../api/setData.php',
                    url: './../api/insertReport.php',
                    data: {data: JSON.stringify(formdata)},
                }).done(function(data){
                    self.debug = JSON.stringify(data.debug, undefined, 2);
                    self.postResponse = data;
                });
            }
        }
    });
});

