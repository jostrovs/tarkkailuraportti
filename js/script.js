
const API_HAE_TUOMARIT = 1;
const API_HAE_RAPORTIT = 2;
const API_HAE_RIVIT = 3;
const API_HAE_AIHEET = 4;
const API_HAE_RAPORTIN_RIVIT = 5;
const API_HAE_PT_RAPORTIT = 6;
const API_HAE_VT_RAPORTIT = 7;

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
    }

    palautaRivit(firstNo, lastNo){
        return this.rivit.filter(rivi => rivi.aihe_no >= firstNo && rivi.aihe_no <= lastNo);
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

