Vue.component('vue-edellinen-label', {
                template: `
                    <div :id="randomId" class="label" data-toggle="tooltip" :title="html">
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
                computed: {
                    html: function(){
                        let huom = "&lt;ei huomautusta&gt;";
                        if(this.rivi.huom != undefined && this.rivi.huom.length > 0) huom = this.rivi.huom;
                        return `${this.rivi.getOttelu()}: ${huom}`;
                    }
                },
                created: function(){
                    $(".label").tooltip({html: true});
                }
});

Vue.component('vue-rivi-edit', {
                template: `
                    <div class="form-group row" :style="{'border-left': leftBorder}">
                        <div class="col-xs-3">
                            <span class="rivi-label">{{initialRivi.otsikko}}</span>
                            <template v-if="initialRivi.tekstiDisplayed()"><br>{{initialRivi.teksti}}</template>
                        </div>
                        <div class="col-xs-3" style="max-width: 230px; min-width: 230px;">
                            <div class="radio-div ruutu1">   <label class="radio-inline"><input :id="inputId('1')" @change="onInput()" required type="radio" :name="radioname" value="1">1</label>   </div>
                            <div class="radio-div ruutu2">   <label class="radio-inline"><input :id="inputId('2')" @change="onInput()" required type="radio" :name="radioname" value="2">2</label>   </div>
                            <div class="radio-div ruutu3">   <label class="radio-inline"><input :id="inputId('3')" @change="onInput()" required type="radio" :name="radioname" value="3">3</label>   </div>
                            <div class="radio-div ruutu4">   <label class="radio-inline"><input :id="inputId('4')" @change="onInput()" required type="radio" :name="radioname" value="4">4</label>   </div>
                            <div class="radio-div ruutu5" style="border-right: 0;">   <label class="radio-inline"><input :id="inputId('5')" @change="onInput()" required type="radio" :name="radioname" value="5">5</label>   </div>
                        </div>
                        <div class="col-xs-4">
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
                props: ['rivi', 'jos'],
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
                        <div class="col-xs-3">
                            <span class="rivi-label">{{initialRivi.otsikko}}</span>
                            <template v-if="initialRivi.tekstiDisplayed()"><br>{{initialRivi.teksti}}</template>
                        </div>
                        <div class="col-xs-2">
                            <div class="ruutu ruutu1"> <span v-if="initialRivi.arvosana=='1'">X</span> <span v-else>&nbsp;</span></div>
                            <div class="ruutu ruutu2"> <span v-if="initialRivi.arvosana=='2'">X</span> <span v-else>&nbsp;</span> </div>
                            <div class="ruutu ruutu3"> <span v-if="initialRivi.arvosana=='3'">X</span> <span v-else>&nbsp;</span> </div>
                            <div class="ruutu ruutu4"> <span v-if="initialRivi.arvosana=='4'">X</span> <span v-else>&nbsp;</span> </div>
                            <div class="ruutu ruutu5"> <span v-if="initialRivi.arvosana=='5'">X</span> <span v-else>&nbsp;</span> </div>
                        </div>

                        <div class="col-xs-4" v-if="initialRivi.huomDisplayed()">
                            <span class="rivi-label">Huom{{rivi.aihe_no}}: </span> {{rivi.huom}}
                        </div>
                    </div>
                `,
                props: ['rivi', 'jos'],
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

