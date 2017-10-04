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

NAISET = ["HPK", "LP Kangasala", "LP Viesti", "LP-Vampula", "LiigaPloki", "Nurmon Jymy", "Oriveden Ponnistus", "Pölkky Kuusamo", "WoVo Rovaniemi"];
MIEHET = ["Akaa-Volley", "Etta", "Hurrikaani Loimaa", "Kokkolan Tiikerit", "LEKA Volley", "Raision Loimu", "Rantaperkiön Isku", "Sampo Volley", "Team Lakkapää", "VaLePa", "Vantaa Ducks"];

$(document).ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            pikada_ready: false,

            dummy: [1, 2, 3, 4, 5],
            kaikki_tuomarit: [],
            aiheet: [],
            ptRivit: [],
            vtRivit: [],
            rivit: [],
            raportit: [],
            
            user: {
                name: "Ei kirjauduttu",
                email: "",
            },
            token: getUserToken(),

            selectedReport: null,
            modal_raportti: Raportti(),
            raportti: Raportti(),
            uusi_raportti: Raportti(),

            postResponse: "Tänne tulee response",

            raportit_options: 
            { 
                columns: [
                    { title: 'Ottelu', width: 340, key: 'ottelu', template: function(row){ return row['koti'] + " - " + row['vieras']; } },
                    { title: 'Päivämäärä', key: 'pvm'},
                    { title: 'Paikka', width: 250, key: 'paikka'},
                    { title: 'Tuomarit', width: 420, key: 'tuomarit', template: (row)=>{ return row['pt_nimi'] + " - " + row['vt_nimi']} },
                    { title: 'Tarkkailija', width: 230, key: 'tark_nimi'},
                    { title: 'id', key: 'id', hidden: true },
                ], 
            }, 

            jos: false, // debug-flägi
            debug: "Ei debuggia",
        },
        
        created: function () {
            this.login();

            bus.on(EVENT_AVAA_RAPORTTI, this.modalReport);
            bus.on(EVENT_RAPORTTI_VALITTU, this.reportSelected);
            bus.on(EVENT_LOGOUT, this.logout);
            bus.on(EVENT_SAVE_EMAIL, this.saveEmail);
            bus.on(EVENT_REQUEST_LINK, this.requestLink);
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
            },
            joukkueet: function(){
                if(this.uusi_raportti.miehet) return MIEHET;
                return NAISET;
            }
        },
        methods: {
            pikada: function(){
                if(this.pikada_ready) return;
                var picker = new Pikaday(
                    {
                        field: document.getElementById('pvm'),
                        firstDay: 1,
                        minDate: new Date(2017, 1, 1),
                        maxDate: new Date(2025, 12, 31),
                        yearRange: [2017,2020],
                        i18n: {
                            previousMonth : 'Edellinen kk',
                            nextMonth     : 'Seuraava kk',
                            months        : ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'],
                            weekdays      : ['Sunnuntai','Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai','Lauantai'],
                            weekdaysShort : ['Su','Ma','Ti','Ke','To','Pe','La']
                        }
                    });                
            },
            
            
            afterLogin: function(){
                toastr.info("Haetaan tietoja...");
                this.loadTuomarit();
                this.loadAiheet();
                //this.loadRivit();
                this.loadRaportit();
                this.newReport();
                toastr.clear();
            },
            
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
                    url: GET_DATA,
                    data: {cmd:cmd, arg1:arg1, token: self.token}
                }).done(function(data){
                    if(data.error == 1){
                        toastr.error("Käyttäjää ei ole autentikoitu. (2)");
                        return;
                    }

                    self.debug = JSON.stringify(data.debug, undefined, 2);
                    if(callback != undefined){
                        callback(data);
                    }
                }).fail(function(){
                    toastr.error("Tietojen haku tietokannasta epäonnistui.");  
                });
            },

            uudenRivit: function(firstNo, lastNo){
                return this.uusi_raportti.rivit.filter(rivi => rivi.aihe_no >= firstNo && rivi.aihe_no <= lastNo);
            },

            valitunRivit: function(firstNo, lastNo){
                return this.raportti.rivit.filter(rivi => rivi.aihe_no >= firstNo && rivi.aihe_no <= lastNo);
            },

            login: function(){
                let self=this;
                if(this.token == undefined || this.token == 'undefined' || this.token == null || this.token.length < 1) return;
                toastr.info("Kirjaudutaan sisään...");
                this.getData(API_LOGIN, function(data){
                    toastr.clear();
                    if(data.error == 1){
                         toastr.error("Kirjautuminen epäonnistui.");
                         return;
                    }
                    let d = data.data[0];
                    self.user = { 
                        name: d.etunimi + " " + d.sukunimi,
                        email: d.email,
                        token: d.token,
                        rooli: d.rooli,
                        id: d.id,
                        login: true,
                    };

                    self.afterLogin();
                })
            },

            logout: function(){
                localStorage.lentopalloerotuomarit_tarkUserToken = undefined;
                this.user.login = false;

                let href = location.href;
                let pos = href.indexOf("?");
                if(pos > 0){
                    href=href.split("?")[0];
                    location.assign(href);
                    return;
                }
                location.reload();
            },

            saveEmail: function(user){
                let self = this;

                $.ajax({
                    dataType: 'json',
                    url: GET_DATA,
                    data: {cmd:API_SAVE_EMAIL, arg1:user.email, token: self.token}
                }).done(function(data){
                    if(data.error == 1){
                        toastr.error("Käyttäjää ei ole autentikoitu. (2)");
                        return;
                    }

                    bus.emit(EVENT_EMAIL_SAVED);
                    toastr.clear();
                    toastr.success("Sähköpostiosoite on vaihdettu.");  
                }).fail(function(){
                    toastr.error("Sähköpostin talletus tietokantaan epäonnistui.");  
                });
            },

            requestLink: function(email){
                $.ajax({
                    dataType: 'json',
                    url: REQUEST_LINK,
                    data: {email:email}
                }).done(function(data){
                    toastr.clear();
                    if(data.error == 1){
                        toastr.error("Linkin tilaaminen epäonnistui; käyttäjää ei löytynyt.");
                        return;
                    }
                    toastr.success("Linkin sisältävä viesti on lähetetty.");  
                }).fail(function(){
                    toastr.clear();
                    toastr.error("Linkin tilaaminen epäonnistui.");  
                });
            },

            loadTuomarit: function(){
                let self=this;
                this.getData(API_HAE_TUOMARIT, function(data){
                    self.kaikki_tuomarit = [];
                    if(data.data == undefined){
                         console.log("loadTuomarit: data.data = null");
                         toastr.clear();
                         toastr.error("Tuomarien lataus epäonnistui.");
                         return;
                    }
                    for(let tuomari of data.data){
                        self.kaikki_tuomarit.push(Tuomari(tuomari));
                    }
                    self.kaikki_tuomarit.sort(function(t1, t2){ 
                        if(t1.sukunimi < t2.sukunimi) return -1;
                        if(t1.sukunimi > t2.sukunimi) return 1;

                        if(t1.etunimi < t2.etunimi) return -1;
                        if(t1.etunimi > t2.etunimi) return 1;
                    
                        return 0;
                    }) ;
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
                        self.aiheet.push(Aihe(aihe));
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
                        self.raportit.push(Raportti(raportti));
                    }

                    bus.emit(EVENT_RAPORTIT_UPDATE, self.raportit);
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

            reportSelected: function(raportti_id){
                this.selectedReport = raportti_id;
                if(this.selectedReport == undefined) return;
                
                for(let raportti of this.raportit){
                    if(raportti.id == this.selectedReport){
                        this.raportti = raportti;
                        this.raportti.getRivit();
                    }
                }
            },

            newReport: function(){
                this.uusi_raportti = Raportti();
                this.uusi_raportti.rivit = [];
                this.uusi_raportti.tark_id = this.user.id;


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
                let pvm = now.format("YYYY-MM-DD");

                this.uusi_raportti.pvm = pvm;
                this.uusi_raportti.paikka = "Pelipaikka";
                this.uusi_raportti.koti = "Etta";
                this.uusi_raportti.vieras = "Etta";
                this.uusi_raportti.pt_id = "1";
                this.uusi_raportti.vt_id = "4";
                this.uusi_raportti.tark_id = "3";

                let as = 1;
                for(let i=1;i<118;++i){
                    let id = i.toString() + "_" + as++;
                    if(as > 5) as = 1;
                    $("#" + id).trigger("click");
                    if(i == 17) i = 100;
                }


            },

            postData: function(){
                toastr.info("Talletetaan raporttia...");
                let self = this;
                let formdata= {
                    pvm: self.uusi_raportti.pvm,
                    paikka: self.uusi_raportti.paikka,
                    koti: self.uusi_raportti.koti,
                    vieras: self.uusi_raportti.vieras,
                    pt_id: self.uusi_raportti.pt_id,
                    vt_id: self.uusi_raportti.vt_id,
                    tark_id: self.user.id,
                    pt_score: self.uusi_raportti.pt_score,
                    vt_score: self.uusi_raportti.vt_score,
                    miehet: self.uusi_raportti.miehet,
                    tulos: self.uusi_raportti.tulos,
                    kesto_h: self.uusi_raportti.kesto_h,
                    kesto_min: self.uusi_raportti.kesto_min,
                    vaikeus: self.uusi_raportti.vaikeus,
                    pt_huom: self.uusi_raportti.pt_huom,
                    vt_huom: self.uusi_raportti.vt_huom,
                    raportti_huom: self.uusi_raportti.raportti_huom,
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
                    url: INSERT_REPORT,
                    data: {data: JSON.stringify(formdata), token: self.token},
                }).done(function(data){
                    toastr.clear();
                    if(data.error == 1){
                        toastr.error("Käyttäjää ei ole autentikoitu. (3)");
                        return;
                    }
                    self.debug = JSON.stringify(data.debug, undefined, 2);
                    self.newReport();
                    toastr.success("Raportti on talletettu tietokantaan.");
                    setTimeout(function(){location.reload();}, 2000);

                }).fail(function(){
                    toastr.error("Raportin talletus tietokantaan epäonnistui.");
                });
            },

            koklaa: function(){
                location.reload()
                // this.newReport();
                // toastr.success("Raportti on talletettu tietokantaan.");
                // $("#etusivuLink").trigger('click');
                // selectLastReport();
            },
        }
    });
});

