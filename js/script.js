var bus = new Vue({
    methods: {
        on: function(event, callback){
            this.$on(event, callback);
        },
        emit: function(event, payload){
            this.$emit(event, payload);
        }
    }
});

$(document).ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            dummy: [1, 2, 3, 4, 5],
            kaikki_tuomarit: [],
            aiheet: [],
            ptRivit: [],
            vtRivit: [],
            rivit: [],
            raportit: [],

            selectedReport: null,
            modal_raportti: new Raportti(),
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

            bus.on(EVENT_AVAA_RAPORTTI, this.modalReport);
        },
        computed: {
            tuomarit: function(){
                return this.kaikki_tuomarit.filter(function(tuomari){
                    return tuomari.rooli == ROOLI_TUOMARI;
                });
            },
            tarkkailijat: function(){
                return this.kaikki_tuomarit.filter(function(tuomari){
                    return tuomari.rooli == ROOLI_TARKKAILIJA;
                });
            }
        },
        methods: {
            modalReport: function(raportti_id){
                for(let raportti of this.raportit){
                    if(raportti.id == raportti_id){
                        this.modal_raportti = raportti;
                        this.modal_raportti.getRivit();
                    }
                }
                $("#myModal").modal();
            },
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
                    self.kaikki_tuomarit = [];
                    if(data.data == undefined){
                         console.log("loadTuomarit: data.data = null");
                         return;
                    }
                    for(let tuomari of data.data){
                        self.kaikki_tuomarit.push(new Tuomari(tuomari));
                    }
                    self.kaikki_tuomarit.sort(function(t1, t2){ 
                        if(t1.sukunimi < t2.sukunimi) return -1;
                        if(t1.sukunimi > t2.sukunimi) return 1;

                        if(t1.etunimi < t2.etunimi) return -1;
                        if(t1.etunimi > t2.etunimi) return 1;
                    
                        return 0;
                    }) 
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
                // Asetetaan uuden raportin rivit-muuttujille näiden vanhojen arvot
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
                    pt_score: self.uusi_raportti.pt_score,
                    vt_score: self.uusi_raportti.vt_score,
                    miehet: self.uusi_raportti.miehet,
                    tulos: self.uusi_raportti.tulos,
                    kesto_h: self.uusi_raportti.kesto_h,
                    kesto_min: self.uusi_raportti.kesto_min,
                    vaikeus: self.uusi_raportti.vaikeus,
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

