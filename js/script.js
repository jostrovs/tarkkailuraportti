
const API_HAE_TUOMARIT = 1;
const API_HAE_RAPORTIT = 2;
const API_HAE_RIVIT = 3;
const API_HAE_AIHEET = 4;
const API_HAE_RAPORTIN_RIVIT = 5;

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
    }
}

class Rivi {
    constructor(data_item){
        if(data_item != null){
            this.id = data_item.id;
            this.aihe_id = data_item.aihe_id;
            this.arvosana = data_item.arvosana;
            this.huom = data_item.huom;
            this.raportti_id = data_item.raportti_id;

            this.aihe_nimi = data_item.nimi;
            this.aihe_no = data_item.no;
        } else {
            this.id = 0;
            this.aihe_id = data_item.aihe_id;
            this.arvosana = data_item.arvosana;
            this.huom = data_item.huom;
            this.raportti_id = data_item.raportti_id;

            this.aihe_nimi = data_item.nimi;
            this.aihe_no = data_item.no;
        }
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

    getRivit(){
        let self = this;
        getData(API_HAE_RAPORTIN_RIVIT, function(data){
            self.rivit = [];
            for(let rivi of data.data){
                self.rivit.push(new Rivi(rivi));
            }
        }, self.id);
    }
}

var getData = function(cmd, callback, arg1) {
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

$(document).ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            dummy: [1, 2, 3, 4, 5],
            tuomarit: [],
            aiheet: [],
            rivit: [],
            raportit: [],

            selectedReport: null,
            raportti: new Raportti(),
            uusi_raportti: new Raportti(),

            postResponse: "Tänne tulee response",
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
            loadTuomarit: function(){
                let self=this;
                getData(API_HAE_TUOMARIT, function(data){
                    self.tuomarit = [];
                    for(let tuomari of data.data){
                        self.tuomarit.push(new Tuomari(tuomari));
                    }
                })
            },

            loadAiheet: function(){
                let self=this;
                getData(API_HAE_AIHEET, function(data){
                    self.aiheet = [];
                    for(let aihe of data.data){
                        self.aiheet.push(new Aihe(aihe));
                    }
                    self.newReport();
                })
            },

            loadRaportit: function(){
                let self=this;
                getData(API_HAE_RAPORTIT, function(data){
                    self.raportit = [];
                    for(let raportti of data.data){
                        self.raportit.push(new Raportti(raportti));
                    }
                })
            },

            loadRivit: function(){
                let self=this;
                getData(API_HAE_RIVIT, function(data){
                    self.rivit = [];
                    for(let rivi of data.data){
                        self.rivit.push(new Rivi(rivi));
                    }
                })
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
                    }))
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

                    aihe_1_id: self.uusi_raportti.rivit[0].aihe_id,
                    aihe_1_arvosana: self.uusi_raportti.rivit[0].arvosana,

                    aihe_2_id: self.uusi_raportti.rivit[1].aihe_id,
                    aihe_2_arvosana: self.uusi_raportti.rivit[1].arvosana,
                };
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    //url: './../api/setData.php',
                    url: './../api/insertReport.php',
                    data: {data: JSON.stringify(formdata)},
                });
                // .done(function(data){
                //     self.postResponse = data;
                // });
            }
        }
    });
});

