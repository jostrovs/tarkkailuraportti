Vue.component('vue-rivi', {
                template: `
                    <div class="form-group row">
                        <label class="col-xs-4">{{initialRivi.otsikko}}</label>
                        <div class="col-xs-3">
                            <label class="radio-inline"><input :id="inputId('1')" @change="onInput()" required type="radio" :name="radioname" value="1">1</label>
                            <label class="radio-inline"><input :id="inputId('2')" @change="onInput()" required type="radio" :name="radioname" value="2">2</label>
                            <label class="radio-inline"><input :id="inputId('3')" @change="onInput()" required type="radio" :name="radioname" value="3">3</label>
                            <label class="radio-inline"><input :id="inputId('4')" @change="onInput()" required type="radio" :name="radioname" value="4">4</label>
                            <label class="radio-inline"><input :id="inputId('5')" @change="onInput()" required type="radio" :name="radioname" value="5">5</label>
                        </div>
                        <div class="col-xs-3">
                            Edelliset: <span v-for="vanha_rivi in rivi.vanhat_rivit">{{vanha_rivi.arvosana}} </span>
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

