
Vue.component('vue-kokonaisarvio', {
    template: `
        <div class="panel-group">
            <div class="panel panel-primary">
                <div class="panel-heading">Lopullinen tuomariarvio</div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-xs-2"></div>
                        <div class="col-xs-4">Päätuomari</div>
                        <div class="col-xs-4">Verkkotuomari</div>
                    </div>
                    <div class="row">
                        <div class="col-xs-2">Pisteet</div>
                        <div class="col-xs-4" style="text-align: center">{{raportti.pt_score}}</div>
                        <div class="col-xs-4" style="text-align: center">{{raportti.vt_score}}</div>
                    </div>

                </div>
            </div>
        </div>
    `,
    props: ['raportti', 'jos'],
    data: function(){
        return {
            initRaporti: this.raportti,
        }
    }
});

Vue.component('vue-edellinen-label', {
                template: `
                    <div :id="randomId" class="label" @click="onClick()" data-toggle="tooltip" :title="html">
                        <span v-if="initialRivi.arvosana=='6'" class="label-dark-red">{{rivi.arvosana}}</span>
                        <span v-if="initialRivi.arvosana=='5'" class="label-red">{{rivi.arvosana}}</span>
                        <span v-if="initialRivi.arvosana=='4'" class="label-orange">{{rivi.arvosana}}</span>
                        <span v-if="initialRivi.arvosana=='3'" class="label-yellow">{{rivi.arvosana}}</span>
                        <span v-if="initialRivi.arvosana=='2'" class="label-white">{{rivi.arvosana}}</span>
                        <span v-if="initialRivi.arvosana=='1'" class="label-green">{{rivi.arvosana}}</span>
                    </div>
                `,
                props: ['rivi', 'jos'],
                data: function () {
                    return {
                        randomId: "label" + this._uid,
                        initialRivi: this.rivi,
                    }
                },
                methods: {
                    onClick: function(){
                        bus.emit(EVENT_AVAA_RAPORTTI, this.initialRivi.raportti_id);
                    }
                },
                computed: {
                    html: function(){
                        let ottelu = this.rivi.getOttelu();
                        let ret = `<p>${ottelu.pvm}</p>`;
                        ret += `<p>${ottelu.koti}-${ottelu.vieras}</p>`;
                        if(this.rivi.aihe_no < 100){
                            ret += `<p>PT pisteet: ${ottelu.pt_score}</p>`;
                        } else {
                            ret += `<p>VT pisteet: ${ottelu.vt_score}</p>`;
                        }

                        let huom = "&lt;ei huomautusta&gt;";
                        if(this.rivi.huom != undefined && this.rivi.huom.length > 0){
                            huom = this.rivi.huom;
                            
                            let no = this.rivi.aihe_no;
                            if(no > 100) no -= 100;
                            ret += `<p>${no} Huomautus: ${huom}</p>`;
                        }

                        return ret;
                    }
                },
                created: function(){
                    $(".label").tooltip({html: true});
                }
});

Vue.component('vue-radio-miehet', {
    template: `
        <div>
                <div> <label class="radio-inline"><input id="miehet" @change="onInput()" required type="radio" :name="radioname" value="true">Miehet</label>   </div>
                <div> <label class="radio-inline"><input id="naiset" @change="onInput()" required type="radio" :name="radioname" value="false">Naiset</label>   </div>
        </div>
    `,
    props: ['raportti', 'jos'],
    data: function () {
        return {
            randomId: this._uid,
            initialRaportti: this.raportti,
            valittu: 0,
            radioname: "optMiehet",
            inputPlaceholder: "",
        }
    },
    methods: {
        onInput: function () {
            let val = $(`input[name=${this.radioname}]:checked`).val();
            this.raportti.miehet = (val=="true");
            this.valittu = val;
        },
    },
    created: function(){
        let self=this;
        setTimeout(function(){
            let $radios = $(`input[name=${self.radioname}]`);
            let radios = $.makeArray($radios);
            for(let radio of radios){
                if(radio.value == "true" && self.initialRaportti.miehet){
                    $(radio).prop("checked", true);
                }
                if(radio.value == "false" && !self.initialRaportti.miehet){
                    $(radio).prop("checked", true);
                }
            }
        }, 10);
    }
});

Vue.component('vue-rivi-edit', {
                template: `
                    <div class="form-group row" :style="{'border-left': leftBorder}">
                        <div class="col-xs-1" style="max-width: 20px;">
                            {{initialRivi.aihe_no>100?initialRivi.aihe_no-100:initialRivi.aihe_no}}
                        </div>
                        <div class="col-xs-3">
                            <span class="rivi-label">{{initialRivi.otsikko}}</span>
                            <template v-if="initialRivi.tekstiDisplayed()"><br>{{initialRivi.teksti}}</template>
                        </div>
                        <div class="col-xs-3" style="max-width: 260px; min-width: 260px;">
                            <div class="radio-div ruutu1">   <label class="radio-inline"><input :id="inputId('1')" @change="onInput()" required type="radio" :name="radioname" value="1">1</label>   </div>
                            <div class="radio-div ruutu2">   <label class="radio-inline"><input :id="inputId('2')" @change="onInput()" required type="radio" :name="radioname" value="2">2</label>   </div>
                            <div class="radio-div ruutu3">   <label class="radio-inline"><input :id="inputId('3')" @change="onInput()" required type="radio" :name="radioname" value="3">3</label>   </div>
                            <div class="radio-div ruutu4">   <label class="radio-inline"><input :id="inputId('4')" @change="onInput()" required type="radio" :name="radioname" value="4">4</label>   </div>
                            <div class="radio-div ruutu5">   <label class="radio-inline"><input :id="inputId('5')" @change="onInput()" required type="radio" :name="radioname" value="5">5</label>   </div>
                            <div class="radio-div ruutu6" style="border-right: 0;">   <label class="radio-inline"><input :id="inputId('6')" @change="onInput()" required type="radio" :name="radioname" value="6">6</label>   </div>
                        </div>
                        <div class="col-xs-3">
                            <input class="form-control" 
                                  :placeholder="inputPlaceholder" 
                                  :style="{'background-color': inputBG}" 
                                  v-model="rivi.huom" type="text">
                        </div>

                        <div class="col-xs-2">
                            <vue-edellinen-label v-for="vanha_rivi in rivi.vanhat_rivit" :rivi="vanha_rivi" :jos="jos" :key="vanha_rivi.id"></vue-edellinen-label>
                        </div>
                        <span v-if="jos" style="margin-left: 23px;"> (valittu: {{valittu}})</span>
                    </div>
                `,
                props: ['raportti', 'rivi', 'jos'],
                data: function () {
                    return {
                        randomId: this._uid,
                        initialRivi: this.rivi,
                        valittu: 0,
                        radioname: "opt" + this.rivi.aihe_no,
                        inputPlaceholder: "",
                    }
                },
                methods: {
                    onInput: function () {
                        let val = $(`input[name=${this.radioname}]:checked`).val();
                        this.rivi.arvosana = val;
                        this.valittu = val;
                        this.raportti.laske();
                    },
                    inputId: function(no){
                        return this.rivi.aihe_no + '_' + no;
                    }
                },
                computed: {
                    leftBorder: function(){
                        if(this.valittu == 0) return "5px solid red";
                        return "5px solid white";
                    },
                    inputBG: function(){
                        if(this.valittu != "0" && this.valittu != "2" && (this.rivi.huom == "" || this.rivi.huom == undefined) ) {
                            this.inputPlaceholder = "<Huomautus puuttuu>"
                            return "#fcc";
                        }
                        this.inputPlaceholder = "";
                        return "white";
                    }
                },

                created: function(){
                    let self=this;
                    setTimeout(function(){
                        let $radios = $(`input[name=${self.radioname}]`);
                        let radios = $.makeArray($radios);
                        for(let radio of radios){
                            if(radio.value == self.initialRivi.arvosana){
                                $(radio).prop("checked", true);
                            }
                        }
                    }, 10);
                }
});


Vue.component('vue-rivi', {
                template: `
                    <div class="form-group row"">
                        <div class="col-xs-1" style="max-width: 20px;">
                            {{initialRivi.aihe_no>100?initialRivi.aihe_no-100:initialRivi.aihe_no}}
                        </div>
                        <div class="col-xs-4">
                            <span class="rivi-label">{{initialRivi.otsikko}}</span>
                            <template v-if="tila!='pieni' && initialRivi.tekstiDisplayed()"><br>{{initialRivi.teksti}}</template>
                        </div>
                        <div class="col-xs-3">
                            <div class="ruutu ruutu1"> <span v-if="initialRivi.arvosana=='1'">X</span> <span v-else>&nbsp;</span></div>
                            <div class="ruutu ruutu2"> <span v-if="initialRivi.arvosana=='2'">X</span> <span v-else>&nbsp;</span> </div>
                            <div class="ruutu ruutu3"> <span v-if="initialRivi.arvosana=='3'">X</span> <span v-else>&nbsp;</span> </div>
                            <div class="ruutu ruutu4"> <span v-if="initialRivi.arvosana=='4'">X</span> <span v-else>&nbsp;</span> </div>
                            <div class="ruutu ruutu5"> <span v-if="initialRivi.arvosana=='5'">X</span> <span v-else>&nbsp;</span> </div>
                            <div class="ruutu ruutu6"> <span v-if="initialRivi.arvosana=='6'">X</span> <span v-else>&nbsp;</span> </div>
                        </div>

                        <div class="col-xs-3" v-if="initialRivi.huomDisplayed()">
                            <span class="rivi-label">Huom{{rivi.aihe_no}}: </span> {{rivi.huom}}
                        </div>
                    </div>
                `,
                props: ['rivi', 'tila', 'jos'],
                data: function () {
                    return {
                        randomId: this._uid,
                        initialRivi: this.rivi,
                        valittu: 0,
                        radioname: "opt" + this.rivi.aihe_no,
                        inputPlaceholder: "",
                    }
                },
});


Vue.component('vue-raportti', {
                template: `
                    <div>
                        <hr>
                        <h1>Valittu raportti</h1> 
                        <span v-if="jos">Id: {{raportti.id}}</span>
                    
                        <h3>Ottelu:</h3>
                        <p  >Pvm: {{raportti.pvm}}<br>
                            Paikka: {{raportti.paikka}}<br>
                            Ottelu: {{raportti.koti}}-{{raportti.vieras}}, 
                            <span v-if="raportti.miehet">Miehet</span><br>
                            <span v-if="!raportti.miehet">Naiset</span><br>
                            Kesto: {{raportti.kesto_h}} h {{raportti.kesto_min}} min<br>
                            Vaikeusaste: <span v-if="raportti.vaikeus==1">Helppo</span>
                                         <span v-if="raportti.vaikeus==2">Normaali</span>
                                         <span v-if="raportti.vaikeus==4">Vaikea</span>
                        </p>
                        <h3>Tuomarit:</h3>
                        <p>PT: {{raportti.pt_nimi}}<br>
                        VT: {{raportti.vt_nimi}}<br>
                        Tarkkailija: {{raportti.tark_nimi}}</p>

                        <h2>Päätuomari</h2>
                        <p>Pisteet: {{raportti.pt_score}}</p>
                        <div class="panel-group">
                            <div class="panel panel-primary">
                                <div class="panel-heading">Tuomaritekniikka ja suoritustaito</div>
                                <div class="panel-body">
                                    <vue-rivi v-for="rivi in raportti.palautaRivit(1,5)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :jos="jos" :tila="'pieni'"></vue-rivi>
                                </div>
                            </div>
                        
                            <div class="panel panel-primary">
                                <div class="panel-heading">Sääntöjen sekä ohjeiden ja tulkintojen soveltaminen</div>
                                <div class="panel-body">
                                    <vue-rivi v-for="rivi in raportti.palautaRivit(6,10)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="'pieni'" :jos="jos"></vue-rivi>
                                </div>
                            </div>

                            <div class="panel panel-primary">
                                <div class="panel-heading">Vuorovaikutus joukkueiden kanssa</div>
                                <div class="panel-body">
                                    <vue-rivi v-for="rivi in raportti.palautaRivit(11,13)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="'pieni'" :jos="jos"></vue-rivi>
                                </div>
                            </div>

                            <div class="panel panel-primary">
                                <div class="panel-heading">Ottelun johtaminen ja persoonallisuus</div>
                                <div class="panel-body">
                                    <vue-rivi v-for="rivi in raportti.palautaRivit(14,17)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="'pieni'" :jos="jos"></vue-rivi>
                                </div>
                            </div>

                            <div class="panel panel-primary">
                                <div class="panel-heading">Loppupisteet</div>
                                <div class="panel-body">
                                    <p style="font-size: larger;">Päätuomarin pisteet: {{raportti.pt_score}}</p>
                                </div>
                            </div>
                        </div>

                        <h2>Verkkotuomari</h2>
                        <p>Pisteet: {{raportti.vt_score}}</p>
                        <div class="panel-group">

                            <div class="panel panel-primary">
                                <div class="panel-heading">Tuomaritekniikka ja suoritustaito</div>
                                <div class="panel-body">
                                    <vue-rivi v-for="rivi in raportti.palautaRivit(101,106)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="'pieni'" :jos="jos"></vue-rivi>
                                </div>
                            </div>
                            
                            <div class="panel panel-primary">
                                <div class="panel-heading">x</div>
                                <div class="panel-body">
                                    <vue-rivi v-for="rivi in raportti.palautaRivit(107,111)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="'pieni'" :jos="jos"></vue-rivi>
                                </div>
                            </div>

                            <div class="panel panel-primary">
                                <div class="panel-heading">Vuorovaikutus joukkueiden kanssa</div>
                                <div class="panel-body">
                                    <vue-rivi v-for="rivi in raportti.palautaRivit(112,113)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="'pieni'" :jos="jos"></vue-rivi>
                                </div>
                            </div>

                            <div class="panel panel-primary">
                                <div class="panel-heading">Ottelun johtaminen ja persoonallisuus</div>
                                <div class="panel-body">
                                    <vue-rivi v-for="rivi in raportti.palautaRivit(114,117)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="'pieni'" :jos="jos"></vue-rivi>
                                </div>
                            </div>

                            <div class="panel panel-primary">
                                <div class="panel-heading">Loppupisteet</div>
                                <div class="panel-body">
                                    <p style="font-size: larger;">Verkkotuomarin pisteet: {{raportti.vt_score}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                props: ['raportti', 'jos'],
                data: function () {
                    return {
                        randomId: this._uid,
                        initialRaportti: this.raportti,
                    }
                },
});

