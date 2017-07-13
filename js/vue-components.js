Vue.component('vue-rivi', {
                template: `
                    <div class="form-group">
                        <label>{{initialRivi.aihe_nimi}}</label>
                        <label class="radio-inline"><input @change="onInput()" type="radio" :name="radioname" value="1">1</label>
                        <label class="radio-inline"><input @change="onInput()" type="radio" :name="radioname" value="2">2</label>
                        <label class="radio-inline"><input @change="onInput()" type="radio" :name="radioname" value="3">3</label>
                        <label class="radio-inline"><input @change="onInput()" type="radio" :name="radioname" value="4">4</label>
                        <label class="radio-inline"><input @change="onInput()" type="radio" :name="radioname" value="5">5</label>
                        valittu: {{valittu}}
                    </div>
                `,
                props: ['rivi'],
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
                    }, 0);
                }
});

