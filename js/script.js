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
            RADIO_MUU: RADIO_MUU,
            pikada_ready: false,

            keskeytynyt: localStorage.tark_save_report && localStorage.tark_save_report!== 'undefined',

            pt_huomautukset: [],
            vt_huomautukset: [],

            dummy: [1, 2, 3, 4, 5],
            kaikki_tuomarit: [],
            aiheet: [],
            ptRivit: [],
            vtRivit: [],
            rivit: [],
            raportit: [],
            
            report_date_filter:"ALL",
            report_user_filter:"ALL",

            user: {
                name: "Ei kirjauduttu",
                email: "",
                reportAuthorized: false,
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
                    { title: 'Ottelu', width: 340, key: 'ottelu', template: function(row){
                        let ret = row['koti'] + " - " + row['vieras']; 
                        if(row['is_new']) ret += " <span class='uusi'>uusi</span>";
                        return ret;
                    } },
                    { title: 'Pvm', key: 'pvm', width: 120, type: 'date'},
                    { title: 'Paikka', width: 250, key: 'paikka'},
                    { title: 'Tuomarit', width: 420, key: 'tuomarit', template: function(row){ return row['pt_nimi'] + " - " + row['vt_nimi']} },
                    { title: 'Tarkkailija', width: 230, key: 'tark_nimi'},
                    { title: 'id', key: 'id', hidden: true },
                ],
               
                generalFilter: true,
                columnFilters: true,

                initialSort: {
                    key: "pvm",
                    order: -1,
                },
                
                externalFilters: [], // Aseta uudestaan created-osuudessa; this-viittaukset toimivat vasta silloin.

                onCreated: function(component){
                    bus.on(EVENT_RAPORTIT_UPDATE, function(data){
                        component.setData(data);
                    })
                },

                onRowClick: function(row_item){
                    bus.emit(EVENT_RAPORTTI_VALITTU, row_item.id)
                }
            }, 

            jos: false, // debug-flägi
            debug: "Ei debuggia",
        },
        
        created: function () {
            let self=this;
            this.raportit_options.externalFilters = [
                function(data){
                    let ret = data;
                    if(self.report_user_filter=="MY"){
                        ret = ret.filter(item => {
                            return item.tuomarit.indexOf(self.user.name) > -1 || item.tark_nimi.indexOf(self.user.name) > -1;
                        });
                    }
                    return ret;
                },

                function(data){
                    let ret = data;
                    if(self.report_date_filter != "ALL"){
                        let limit = moment();
                        if(self.report_date_filter == "WEEK"){
                            limit.subtract(8, 'days');
                        }
                        if(self.report_date_filter == "MONTH"){
                            limit.subtract(1, 'month');
                        }
                        ret = ret.filter(item => {
                            return moment(item.pvm).isAfter(limit);
                        });
                    }
                    return ret;
                },
            ];
            
            this.login();

            bus.on(EVENT_AVAA_RAPORTTI, this.modalReport);
            bus.on(EVENT_RAPORTTI_VALITTU, this.reportSelected);
            bus.on(EVENT_LOGOUT, this.logout);
            bus.on(EVENT_SAVE_EMAIL, this.saveEmail);
            bus.on(EVENT_REQUEST_LINK, this.requestLink);
            bus.on(EVENT_CLOSE_REPORT, this.closeReport);
            bus.on(EVENT_DATE_FILTER, this.setReportDateFilter);
            bus.on(EVENT_USER_FILTER, this.setReportUserFilter);
            bus.on(EVENT_DOWNLOAD, this.pdf);
        },
        computed: {
            viimeisin_raportti: function(){
                if(this.raportit.length < 1) return "";
                let ret = [];
                for(let r of this.raportit) ret.push(r);
                ret = ret.sort((i1, i2)=>{
                    return moment(i1.updated).isSameOrAfter(moment(i2.updated)) ? -1:1;
                });

                let m = moment(ret[0].updated);
                return "Viimeisin raportti lisätty " + m.format("dd DD.MM.YYYY") + ": " + ret[0].koti + "-" + ret[0].vieras;
            },

            tuomarit: function(){
                return this.kaikki_tuomarit.filter(function(tuomari){
                    return tuomari.rooli == ROOLI_TUOMARI || tuomari.rooli == ROOLI_TUOMARI_JA_TARKKAILIJA;
                });
            },
            tarkkailijat: function(){
                return this.kaikki_tuomarit.filter(function(tuomari){
                    return tuomari.rooli == ROOLI_TARKKAILIJA || tuomari.rooli == ROOLI_TUOMARI_JA_TARKKAILIJA;
                });
            },
            joukkueet: function(){
                if(this.uusi_raportti.miehet===RADIO_MIEHET) return MIEHET;
                if(this.uusi_raportti.miehet===RADIO_NAISET) return NAISET;
                return [];
            },

            uuden_1_5: function(){
                if(this.uusi_raportti.rivit.length < 34) return [];
                return [ this.uusi_raportti.rivit[0], this.uusi_raportti.rivit[1], this.uusi_raportti.rivit[2], this.uusi_raportti.rivit[3], this.uusi_raportti.rivit[4]];
            },

            uuden_6_10: function(){
                if(this.uusi_raportti.rivit.length < 34) return [];
                return [ this.uusi_raportti.rivit[5], this.uusi_raportti.rivit[6], this.uusi_raportti.rivit[7], this.uusi_raportti.rivit[8], this.uusi_raportti.rivit[9]];
            },

            uuden_11_13: function(){
                if(this.uusi_raportti.rivit.length < 34) return [];
                return [ this.uusi_raportti.rivit[10], this.uusi_raportti.rivit[11], this.uusi_raportti.rivit[12]];
            },

            uuden_14_17: function(){
                if(this.uusi_raportti.rivit.length < 34) return [];
                return [ this.uusi_raportti.rivit[13], this.uusi_raportti.rivit[14], this.uusi_raportti.rivit[15], this.uusi_raportti.rivit[16]];
            },

            uuden_101_106: function(){
                if(this.uusi_raportti.rivit.length < 34) return [];
                return [ this.uusi_raportti.rivit[17], this.uusi_raportti.rivit[18], this.uusi_raportti.rivit[19], this.uusi_raportti.rivit[20], this.uusi_raportti.rivit[21], this.uusi_raportti.rivit[22]];
            },

            uuden_107_111: function(){
                if(this.uusi_raportti.rivit.length < 34) return [];
                return [ this.uusi_raportti.rivit[23], this.uusi_raportti.rivit[24], this.uusi_raportti.rivit[25], this.uusi_raportti.rivit[26], this.uusi_raportti.rivit[27]];
            },

            uuden_112_113: function(){
                if(this.uusi_raportti.rivit.length < 34) return [];
                return [ this.uusi_raportti.rivit[28], this.uusi_raportti.rivit[29]];
            },

            uuden_114_117: function(){
                if(this.uusi_raportti.rivit.length < 34) return [];
                return [ this.uusi_raportti.rivit[30], this.uusi_raportti.rivit[31], this.uusi_raportti.rivit[32], this.uusi_raportti.rivit[33]];
            },

        },
        methods: {
            pikada: function(){
                autosize($('textarea'));

                
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
            
            setReportDateFilter(f){
                this.report_date_filter = f;
            },

            setReportUserFilter(f){
                this.report_user_filter = f;
            },

            pdf: function(){
                let p = new printReport(this.raportti);
                p.pdf();
            },

            onPrint: function(){
                let title1 = this.raportti.pvm + " ";
                    title1 += this.raportti.koti + "-" + this.raportti.vieras + " ";
                    title1 += this.raportti.pt_nimi.split(" ")[1] + "-";
                    title1 += this.raportti.vt_nimi.split(" ")[1] + "-"; 
                    title1 += this.raportti.tark_nimi.split(" ")[1];
                document.title = title1;
            },

            afterLogin: function(){
                toastr.info("Haetaan tietoja...");
                this.loadTuomarit();
                this.loadAiheet();
                //this.loadRivit();
                this.loadRaportit();
                this.newReport();
            },
            
            modalReport: function(raportti_id){
                for(let i=0;i<this.raportit.length;++i){
                let raportti = this.raportit[i];
                    if(raportti.id == raportti_id){
                        this.raportti.getRivit();
                        this.modal_raportti = raportti;

                        autosize($('textarea'));
                    }
                }
                $("#myModal").modal();
            },
            getData: function(cmd, callback, arg1) {
                let self=this;
                $.ajax({
                    dataType: 'json',
                    url: GET_DATA,
                    data: {cmd:cmd, arg1:arg1, token: self.token, browser: BROWSER}
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
                return this.uusi_raportti.rivit.filter(function(rivi){ return rivi.aihe_no >= firstNo && rivi.aihe_no <= lastNo});
            },

            valitunRivit: function(firstNo, lastNo){
                return this.raportti.rivit.filter(function(rivi){ return rivi.aihe_no >= firstNo && rivi.aihe_no <= lastNo});
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
                        login_time: d.login_time,
                        last_login: d.last_login,
                        reportAuthorized: d.rooli == ROOLI_TARKKAILIJA || d.rooli == ROOLI_ADMIN || d.rooli == ROOLI_TUOMARI_JA_TARKKAILIJA,
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
                    data: {cmd:API_SAVE_EMAIL, arg1:user.email, token: self.token, browser: BROWSER}
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
                    data: {email:email, browser: BROWSER}
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
                    for(let i=0;i<data.data.length;++i){
                    let tuomari=data.data[i];
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
                    for(let i=0;i<data.data.length;++i){
                        let aihe = data.data[i];
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
                    for(let i=0;i< data.data.length;++i){
                        let raportti = data.data[i];
                        self.raportit.push(Raportti(raportti, self.user.last_login));
                    }

                    bus.emit(EVENT_RAPORTIT_UPDATE, self.raportit);
                    toastr.clear();
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
                    for(let i=0;i<data.data.length;++i){
                        let rivi = data.data[i];
                        self.rivit.push(Rivi(rivi));
                    }
                })
            },

            ptChanged: function(){
                let self=this;
                if(self.uusi_raportti == undefined || self.uusi_raportti.pt_id == undefined) return;
                toastr.info("Haetaan päätuomarin edellisiä otteluita...");
                this.getData(API_HAE_PT_RAPORTIT, function(data){
                    self.ptRivit = [];
                    if(data.data == null) return;
                    for(let i=0;i<data.data.length;++i){
                        let rivi = data.data[i];
                        self.ptRivit.push(Rivi(rivi));
                    }
                    self.asetaVanhatRivit();
                    toastr.clear();
                }, self.uusi_raportti.pt_id);
            },

            vtChanged: function(){
                let self=this;
                if(self.uusi_raportti == undefined || self.uusi_raportti.vt_id == undefined) return;
                toastr.info("Haetaan verkkotuomarin edellisiä otteluita...");
                this.getData(API_HAE_VT_RAPORTIT, function(data){
                    self.vtRivit = [];
                    if(data.data == null) return;
                    for(let i=0;i<data.data.length;++i){
                        let rivi = data.data[i];
                        self.vtRivit.push(Rivi(rivi));
                    }
                    self.asetaVanhatRivit();
                    toastr.clear();
                }, self.uusi_raportti.vt_id);
            },

            asetaVanhatRivit: function(){
                // ptRivit- ja vtRivit-muuttujissa on nyt tiedot tuomareiden vanhoista peleistä.
                // Asetetaan uuden raportin rivit-muuttujille näiden vanhojen arvot
                for(let i=0;i<this.uusi_raportti.rivit.length;++i){
                    let rivi = this.uusi_raportti.rivit[i];
                    if(rivi.aihe_no < 100){
                        rivi.vanhat_rivit = this.ptRivit.filter(function(r){ return r.aihe_no == rivi.aihe_no});
                    }
                    else {
                        rivi.vanhat_rivit = this.vtRivit.filter(function(r){ return r.aihe_no == rivi.aihe_no});
                    }
                }
            },

            reportSelected: function(raportti_id){
                toastr.info("Haetaan raportin tietoja...");
                $("#reportGrid").hide(400)
                let self = this;
                if(raportti_id == undefined) return;
                
                for(let i=0;i<this.raportit.length;++i){
                    let raportti = this.raportit[i];
                    if(raportti.id == raportti_id){
                        self.raportti = raportti;
                        self.selectedReport = raportti_id;
                        
                        raportti.getRivit(function(){
                            toastr.clear();
                        });
                    }
                }

            },

            closeReport: function(){
                this.selectedReport = 0;
                $("#reportGrid").show(400);
            },

            newReport: function(){
               
                this.uusi_raportti = Raportti();
                this.uusi_raportti.rivit = [];
                this.uusi_raportti.tark_id = this.user.id;


                for(let i=0;i<this.aiheet.length;++i){
                    let aihe = this.aiheet[i];
                    this.uusi_raportti.rivit.push(Rivi({
                        aihe_id: aihe.id,
                        nimi: aihe.nimi,
                        no: aihe.no,
                        otsikko: aihe.otsikko,
                        teksti: aihe.teksti,
                        huom: "",
                    }));
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

            save_temp: function(){
                localStorage.tark_save_report = JSON.stringify(this.uusi_raportti);
            },

            load_temp: function(){
                var self = this;
                if(localStorage.tark_save_report && localStorage.tark_save_report!== 'undefined'){
                    let r = JSON.parse(localStorage.tark_save_report);

                    this.uusi_raportti.pvm = r.pvm;
                    this.uusi_raportti.paikka = r.paikka;
                    
                    this.uusi_raportti.miehet = r.miehet;
                    if(r.miehet == RADIO_MIEHET) $("#miehet").prop("checked", true);
                    else if(r.miehet == RADIO_NAISET) $("#naiset").prop("checked", true);
                    else $("#muu").prop("checked", true);

                    self.uusi_raportti.koti = r.koti;
                    self.uusi_raportti.vieras = r.vieras;

                    this.uusi_raportti.pt_id = r.pt_id;
                    this.uusi_raportti.vt_id = r.vt_id;

                    this.uusi_raportti.tulos = r.tulos;
                    this.uusi_raportti.kesto_h = r.kesto_h;
                    this.uusi_raportti.kesto_min = r.kesto_min;

                    if(r.vaikeus == 0) $("#helppo").prop("checked", true);
                    if(r.vaikeus == 1) $("#normaali").prop("checked", true);
                    if(r.vaikeus == 2) $("#vaikea").prop("checked", true);

                    this.uusi_raportti.pt_huom = r.pt_huom;
                    this.uusi_raportti.vt_huom = r.vt_huom;
                    this.uusi_raportti.raportti_huom = r.raportti_huom;

                    for(let i=0;i<r.rivit.length;++i){
                        let rivi = r.rivit[i];

                        if(typeof(rivi) !== 'undefined' && typeof(rivi.arvosana) !== 'undefined'){
                            bus.emit(EVENT_CHANGE, { aihe_no: rivi.aihe_no, arvosana: rivi.arvosana});
                        }

                        //console.log("i: " + i + "  uusi_rivit: " + this.uusi_raportti.rivit.length + "     rivit: " + r.rivit.length);
                        this.uusi_raportti.rivit[i].huom = rivi.huom;
                    }

                    this.keskeytynyt = false;
                    return true;
                } 
                return false;
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
                    data: {data: JSON.stringify(formdata), token: self.token, browser: BROWSER},
                }).done(function(data){
                    toastr.clear();
                    if(data.error == 1){
                        toastr.error("Käyttäjää ei ole autentikoitu. (3)");
                        return;
                    }
                    self.debug = JSON.stringify(data.debug, undefined, 2);
                    self.newReport();
                    toastr.success("Raportti on talletettu tietokantaan.");
                    
                    localStorage.tark_save_report = undefined;
                    
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

