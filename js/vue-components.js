

Vue.component('vue-jos-grid', {
    template: 
      '  <div class="jos-table-container">                                                                                 ' + 
      '  <table :class="options.luokka">                                                                                   ' + 
      '      <thead>                                                                                                       ' + 
      '          <tr>                                                                                                      ' + 
      '              <th v-for="column in shownColumns" :class="{active: sortCol == column.key}" :width="column.width">    ' + 
      '                  <span @click="column.sortable != false && sortBy(column.key)">{{column.title}}</span>             ' + 
      '                  <span v-if="sortIndicators[column.key]==1">Up</span>                                              ' + 
      '                  <span v-if="sortIndicators[column.key]==-1">Down</span>                                           ' + 
      '                                                                                                                    ' + 
      '                  <template v-if="column.filterable != false">                                                      ' + 
      '                      <br><input style="width: 80%;" type="text" v-model="filters[column.key]">                     ' + 
      '                  </template>                                                                                       ' + 
      '              </th>                                                                                                 ' + 
      '          </tr>                                                                                                     ' + 
      '      </thead>                                                                                                      ' + 
      '      <tbody>                                                                                                       ' + 
      '          <tr v-for="entry in filteredSortedData" :key="entry.josOrder" @click="rowClick(entry.id)">                ' + 
      '              <td v-for="column in shownColumns">                                                                   ' + 
      '                  <template v-if="column.type == \'text\'">                                                         ' + 
      '                      {{entry[column.key]}}                                                                         ' + 
      '                  </template>                                                                                       ' + 
      '                  <template v-if="column.type == \'number\'">                                                       ' + 
      '                      {{entry[column.key]}}                                                                         ' +                      
      '                  </template>                                                                                       ' +  
      '                  <template v-if="column.type == \'link\'">                                                         ' + 
      '                      <a :href="entry[column.key].href">{{entry[column.key].text}}</a>                              ' + 
      '                  </template>                                                                                       ' + 
      '              </td>                                                                                                 ' + 
      '          </tr>                                                                                                     ' + 
      '      </tbody>                                                                                                      ' + 
      '  </table>                                                                                                          ' + 
      '  </div>                                                                                                            '
    ,
    props: ['data', 'options'],

    // columnSetting:
    // {
    //     title: "Pitkä nimi",
    //     key: "nimi",
    //     type: text / number / date / jotain ihan muuta
    // }

    data: function () {
        let self = this;
        let localData = [];
        this.options.luokka = {
            'table': false,
            'table-striped': false,
            'table-bordered': false,
            'table-hover': false,
            'table-condensed': false,

            'jos-table': true,
        };
        
        let columns = [];
        let filters = {};
        let sortIndicators = {};
        if(this.options && this.options.columns){
            this.options.columns.forEach(function (column) {
                let localColumn = column;
                localColumn.josSortOrder=0;
                if(column.type == undefined) localColumn.type = "text";
                if(column.name == undefined) localColumn.name = column.key;
                columns.push(localColumn);
                sortIndicators[column.key]=0;
            });
        }

        let c=1;
        if(this.data){
            this.data.forEach(function(item){
                item['josOrder'] = c++;

                self.options.columns.forEach(function (column) {
                    if(column.template != undefined){
                        item[column.key] = column.template(item);
                    }
                });
                localData.push(item);
            });
        }

        bus.on(EVENT_RAPORTIT_UPDATE, function(data){
            self.setData(data);
        })

        return {
            localData: localData,
            sortCol: '',
            sortOrder: 0,
            columns: columns,
            sortIndicators: sortIndicators,
            filters: filters,
        }
    },

    computed: {
        shownColumns: function(){
            return this.columns.filter(function(item){ return item.hidden != true});
        },
        
        filteredSortedData: function(){
            let self = this;
            let ret = this.localData;
            for(let i=0;i<this.columns.length;++i){
                let column = this.columns[i];
                ret = this.filterByColumn(column, ret);
            }

            for(let i=0;i<this.columns.length;++i){
                let column = this.columns[i];
                if(column.name == this.sortCol){
                    if(this.sortOrder == 0){
                        ret = ret.sort(function(a,b){
                            return a.josOrder-b.josOrder;
                        });
                    } else {
                        ret = ret.sort(function(a,b){
                            let r = 0;
                            let v1 = self.getVal(column, a[column.key]);
                            let v2 = self.getVal(column, b[column.key]); 

                            if(v1 < v2) r=-1;    
                            else if(v1 > v2) r=1;
                            return r*this.sortOrder;
                        });    
                    }
                }
            }

            return ret;
        },
    },
    methods: {
        rowClick: function(raportti_id){
            bus.emit(EVENT_RAPORTTI_VALITTU, raportti_id)
        },
        
        setData: function(data){
            let self=this;
            let localData = [];
            let c=1;
            if(data){
                data.forEach(function(item){
                    let ni = {};
                    ni['josOrder'] = c++;
    
                    var col = 0;
                    self.options.columns.forEach(function (column) {
                        if(column.template != undefined){
                            ni[column.key] = column.template(item);
                        } else {
                            ni[column.key] = item[column.key];
                        }
                    });
                    localData.push(ni);
                });
            }
    
            self.localData = localData;
        },
        
        sortBy: function (key) {
            this.sortIndicators = {};
            if(this.sortCol != key){
                this.sortCol = key;
                this.sortOrder = 1;
            } else {
                if(this.sortOrder == 1) this.sortOrder = -1;
                else if(this.sortOrder == -1) this.sortOrder = 0;
                else if(this.sortOrder == 0) this.sortOrder = 1;
            }
            this.sortIndicators[key] = this.sortOrder;
        },
        getVal: function(column, entry){
            if(column.type == 'link') return entry.text;
            return entry;
        },
        filterByColumn: function(column, data){
            let filter = this.filters[column.key];
            if(filter == undefined || filter.length < 1) return data;
            let ret = data; 
          
            ret = ret.filter(function(item){
                let val = this.getVal(column, item[column.key]);
                if(val == undefined) val = "";
                val=val.toString();
                return val.indexOf(this.filters[column.key]) > -1;
            });
            return ret;
        }
    },
});

Vue.component('vue-kokonaishuomautus', {
    template: 
    '   <div class="panel-group">                                                                         ' +                 
    '       <div class="panel panel-primary">                                                             ' + 
    '           <div class="panel-heading" v-if="isPT">Kehityssuositukset (PT)</div>                      ' + 
    '           <div class="panel-heading" v-else>Kehityssuositukset (VT)</div>                           ' + 
    '           <div class="panel-body" style="font-size: 18px;">                                         ' + 
    '               <textarea class="form-control" v-if="isPT" v-model="raportti.pt_huom"></textarea>     ' + 
    '               <textarea class="form-control" v-else v-model="raportti.vt_huom"></textarea>          ' + 
    '           </div>                                                                                    ' + 
    '       </div>                                                                                        ' + 
    '   </div>                                                                                            '
    ,
    props: ['pt_tai_vt', 'raportti', 'jos'],
    data: function(){
        return {
            initRaporti: this.raportti,
            isPT: this.pt_tai_vt.toLowerCase() == 'pt',
        }
    },
});

Vue.component('vue-otteluhuomautus', {
    template: 
    '  <div class="panel-group">                                                                    ' +    
    '      <div class="panel panel-primary">                                                        ' +    
    '          <div class="panel-heading">Muita huomioita ottelusta</div>                           ' +         
    '          <div class="panel-body" style="font-size: 18px;">                                    ' +        
    '              <textarea class="form-control" v-model="raportti.raportti_huom"></textarea>      ' +      
    '          </div>                                                                               ' +     
    '      </div>                                                                                   ' +       
    '  </div>                                                                                       '   
    ,
    props: ['raportti', 'jos'],
    data: function(){
        return {
            initRaporti: this.raportti,
        }
    },
});


Vue.component('vue-kokonaisarvio', {
    template: 
     '   <div class="panel-group">                                                                                                   ' +  
     '       <div class="panel panel-primary">                                                                                       ' +   
     '           <div class="panel-heading">Lopullinen tuomariarvio</div>                                                            ' +          
     '           <div class="panel-body" style="font-size: 18px;">                                                                   ' +             
     '               <div class="row">                                                                                               ' +     
     '                   <div class="col-xs-2"></div>                                                                                ' +          
     '                   <div class="col-xs-4" style="text-align: center; font-size: 24px;">Päätuomari</div>                         ' +               
     '                   <div class="col-xs-4" style="text-align: center; font-size: 24px;">Verkkotuomari</div>                      ' +                  
     '               </div>                                                                                                          ' +              
     '               <div class="row">                                                                                               ' +               
     '                   <div class="col-xs-2" style="text-align: right;">Pisteet</div>                                              ' +    
     '                   <div class="col-xs-4" style="text-align: center">                                                           ' +           
     '                       <div v-show="raportti.pt_score!=\'<puuttuu>\'" style="min-width: 65px;" class="ruutuIsoAla ruutuVika">    ' +      
     '                           {{raportti.pt_score}}                                                                               ' +           
     '                        </div>                                                                                                 ' +             
     '                   </div>                                                                                                      ' +                  
     '                   <div class="col-xs-4" style="text-align: center">                                                           ' +           
     '                       <div v-show="raportti.pt_score!=\'<puuttuu>\'" style="min-width: 65px;" class="ruutuIsoAla ruutuVika">    ' +                
     '                           {{raportti.vt_score}}                                                                               ' +           
     '                       </div>                                                                                                  ' +            
     '                   </div>                                                                                                      ' +        
     '               </div>                                                                                                          ' +    
     '               <div class="row">                                                                                               ' +     
     '                   <div class="col-xs-2" style="text-align: right;">&nbsp;</div>                                               ' +             
     '                   <div class="col-xs-4" style="text-align: center">                                                           ' +           
     '                       <div class="ruutuIsoYla"> Erinomainen</div>                                                             ' +                             
     '                       <div class="ruutuIsoYla"> Erittäin hyvä</div>                                                           ' +                               
     '                       <div class="ruutuIsoYla"> Hyvä</div>                                                                    ' +                      
     '                       <div class="ruutuIsoYla"> Välttävä</div>                                                                ' +                          
     '                       <div class="ruutuIsoYla"> Huono</div>                                                                   ' +                       
     '                   </div>                                                                                                      ' +                                 
     '                   <div class="col-xs-4" style="text-align: center">                                                           ' +                               
     '                       <div class="ruutuIsoYla"> Erinomainen</div>                                                             ' +                             
     '                       <div class="ruutuIsoYla"> Erittäin hyvä</div>                                                           ' +                               
     '                       <div class="ruutuIsoYla"> Hyvä</div>                                                                    ' +                      
     '                       <div class="ruutuIsoYla"> Välttävä</div>                                                                ' +                          
     '                       <div class="ruutuIsoYla"> Huono</div>                                                                   ' +                       
     '                   </div>                                                                                                      ' +                                 
     '               </div>                                                                                                          ' +                             
     '               <div class="row">                                                                                               ' +                                        
     '                   <div class="col-xs-2" style="text-align: right;">Lopullinen arvio</div>                                     ' +                                                     
     '                   <div class="col-xs-4" style="text-align: center">                                                           ' +                               
     '                       <div class="ruutuIsoAla ruutu1"> <span v-if="pt1">X</span> <span v-else>&nbsp;</span></div>             ' +                                
     '                       <div class="ruutuIsoAla ruutu2"> <span v-if="pt2">X</span> <span v-else>&nbsp;</span></div>             ' +                                
     '                       <div class="ruutuIsoAla ruutu3"> <span v-if="pt3">X</span> <span v-else>&nbsp;</span></div>             ' +                                
     '                       <div class="ruutuIsoAla ruutu4"> <span v-if="pt4">X</span> <span v-else>&nbsp;</span></div>             ' +                                
     '                       <div class="ruutuIsoAla ruutu5 ruutuVika"> <span v-if="pt5">X</span> <span v-else>&nbsp;</span></div>   ' +                                          
     '                   </div>                                                                                                      ' +                                 
     '                   <div class="col-xs-4" style="text-align: center">                                                           ' +                               
     '                       <div class="ruutuIsoAla ruutu1"> <span v-if="vt1">X</span> <span v-else>&nbsp;</span></div>             ' +                                
     '                       <div class="ruutuIsoAla ruutu2"> <span v-if="vt2">X</span> <span v-else>&nbsp;</span></div>             ' +                                
     '                       <div class="ruutuIsoAla ruutu3"> <span v-if="vt3">X</span> <span v-else>&nbsp;</span></div>             ' +                                
     '                       <div class="ruutuIsoAla ruutu4"> <span v-if="vt4">X</span> <span v-else>&nbsp;</span></div>             ' +                                
     '                       <div class="ruutuIsoAla ruutu5 ruutuVika"> <span v-if="vt5">X</span> <span v-else>&nbsp;</span></div>   ' +                                          
     '                   </div>                                                                                                      ' +                                 
     '               </div>                                                                                                          ' +                             
     '                                                                                                                               ' +                                                                                                  
     '               <div class="row">                                                                                               ' +                                                                                     
     '                   <div class="col-xs-2" style="text-align: right; margin-top: 20px;">Kehityssuositukset</div>                 ' +                                                                         
     '                   <pre class="col-xs-4" style="font-family: Arial,sans-serif; text-align: left; min-height: 30px; font-size: 16px; border: 1px solid black; margin: 20px;">{{raportti.pt_huom}}</pre>                               ' +              
     '                   <pre class="col-xs-4" style="font-family: Arial,sans-serif; text-align: left; min-height: 30px; font-size: 16px; border: 1px solid black; margin: 20px;">{{raportti.vt_huom}}</pre>                               ' +              
     '               </div>                                                                                                                                                                                                                ' +
     '                                                                                                                                                                                                                                     ' +
     '               <div class="row">                                                                                                                                                                                                     ' +                            
     '                   <div class="col-xs-2" style="text-align: right; margin-top: 20px;">Muita huomioita</div>                                                                                                                          ' +             
     '                   <pre class="col-xs-8" style="font-family: Arial,sans-serif; text-align: left; min-height: 30px; font-size: 16px; border: 1px solid black; margin: 20px;">{{raportti.raportti_huom}}</pre>                         ' +                    
     '               </div>                         ' +                                                                                                                                                                
     '           </div>                             ' +                                                                                                                                                    
     '       </div>                                 ' +                                                         
     '   </div>                                     '
    ,
    props: ['raportti', 'jos'],
    data: function(){
        return {
            initRaporti: this.raportti,

        }
    },
    computed: {
         pt1: function(){return this.raportti.pt_score >= 97; },
         pt2: function(){return this.raportti.pt_score >= 90 && this.raportti.pt_score < 97; },
         pt3: function(){return this.raportti.pt_score >= 75 && this.raportti.pt_score < 90; },
         pt4: function(){return this.raportti.pt_score >= 60 && this.raportti.pt_score < 75; },
         pt5: function(){return this.raportti.pt_score < 60},

         vt1: function(){return this.raportti.vt_score >= 97; },
         vt2: function(){return this.raportti.vt_score >= 90 && this.raportti.vt_score < 97; },
         vt3: function(){return this.raportti.vt_score >= 75 && this.raportti.vt_score < 90; },
         vt4: function(){return this.raportti.vt_score >= 60 && this.raportti.vt_score < 75; },
         vt5: function(){return this.raportti.vt_score < 60},
    }        
});

Vue.component('vue-edellinen-label', {
                template: 
                    ' <div :id="randomId" class="label" @click="onClick()" data-toggle="tooltip" :title="html">   ' +
                    '     <span v-if="initialRivi.arvosana==\'6\'" class="label-dark-red">{{rivi.arvosana}}</span>  ' +
                    '     <span v-if="initialRivi.arvosana==\'5\'" class="label-red">{{rivi.arvosana}}</span>       ' +
                    '     <span v-if="initialRivi.arvosana==\'4\'" class="label-orange">{{rivi.arvosana}}</span>    ' +
                    '     <span v-if="initialRivi.arvosana==\'3\'" class="label-yellow">{{rivi.arvosana}}</span>    ' +
                    '     <span v-if="initialRivi.arvosana==\'2\'" class="label-white">{{rivi.arvosana}}</span>     ' +
                    '     <span v-if="initialRivi.arvosana==\'1\'" class="label-green">{{rivi.arvosana}}</span>     ' +
                    ' </div>'
                ,
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
                        let ret = '<p>' + ottelu.pvm + '</p>';
                        ret += '<p>' + ottelu.koti + '-' + ottelu.vieras + '</p>';
                        if(this.rivi.aihe_no < 100){
                            ret += '<p>PT pisteet: ' + ottelu.pt_score + '</p>';
                        } else {
                            ret += '<p>VT pisteet: ' + ottelu.vt_score + '</p>';
                        }

                        let huom = "&lt;ei huomautusta&gt;";
                        if(this.rivi.huom != undefined && this.rivi.huom.length > 0){
                            huom = this.rivi.huom;
                            
                            let no = this.rivi.aihe_no;
                            if(no > 100) no -= 100;
                            ret += '<p>' + no + ' Huomautus: ' + huom + '</p>';
                        }

                        return ret;
                    }
                },
                created: function(){
                    $(".label").tooltip({html: true});
                }
});

Vue.component('vue-radio-miehet', {
    template: 
        ' <div> ' +
        '     <div> <label class="radio-inline"><input id="miehet" @change="onInput()" required type="radio" :name="radioname" value="true">Miehet</label>   </div>  ' +
        '     <div> <label class="radio-inline"><input id="naiset" @change="onInput()" required type="radio" :name="radioname" value="false">Naiset</label>   </div> ' +
        ' </div>'
    ,
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
            let val = $('input[name=' + this.radioname + ']:checked').val();
            this.raportti.miehet = (val=="true");
            this.valittu = val;
        },
    },
    created: function(){
        let self=this;
        setTimeout(function(){
            let $radios = $('input[name=' + self.radioname + ']');
            let radios = $.makeArray($radios);
            for(let i=0;i<radios.length;++i){
                let radio = radios[i];
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
                template: 
                  '  <div class="form-group row" :style="{\'border-left\': leftBorder}">                                   ' +
                  '      <div class="col-xs-1" style="max-width: 20px;">                                                   ' +
                  '          {{initialRivi.aihe_no>100?initialRivi.aihe_no-100:initialRivi.aihe_no}}                       ' +
                  '      </div>                                                                                            ' +
                  '      <div class="col-xs-3">                                                                            ' +
                  '          <span class="rivi-label">{{initialRivi.otsikko}}</span>                                       ' +
                  '          <template v-if="initialRivi.tekstiDisplayed()"><br>{{initialRivi.teksti}}</template>          ' +
                  '      </div>                                                                                            ' +
                  '      <div class="col-xs-3" style="max-width: 265px; min-width: 265px;">                                ' +
                  '          <div class="radio-div ruutu1">   <label class="radio-inline"><input :id="inputId(\'1\')" @change="onInput()" required type="radio" :name="radioname" value="1">A</label>   </div> ' +
                  '          <div class="radio-div ruutu2">   <label class="radio-inline"><input :id="inputId(\'2\')" @change="onInput()" required type="radio" :name="radioname" value="2">B</label>   </div> ' +
                  '          <div class="radio-div ruutu3">   <label class="radio-inline"><input :id="inputId(\'3\')" @change="onInput()" required type="radio" :name="radioname" value="3">C</label>   </div> ' +
                  '          <div class="radio-div ruutu4">   <label class="radio-inline"><input :id="inputId(\'4\')" @change="onInput()" required type="radio" :name="radioname" value="4">D</label>   </div> ' +
                  '          <div class="radio-div ruutu5">   <label class="radio-inline"><input :id="inputId(\'5\')" @change="onInput()" required type="radio" :name="radioname" value="5">E</label>   </div> ' +
                  '          <div class="radio-div ruutu6" style="border-right: 0;">   <label class="radio-inline"><input :id="inputId(\'6\')" @change="onInput()" required type="radio" :name="radioname" value="6">F</label>   </div> ' +
                  '      </div>                                                                            ' +
                  '      <div class="col-xs-3">                                                            ' +
                  '          <input class="form-control"                                                   ' +
                  '                :placeholder="inputPlaceholder"                                         ' +
                  '                :style="{\'background-color\': inputBG}"                                ' +
                  '                v-model="rivi.huom" type="text">                                        ' +
                  '      </div>                                                                            ' +
                  '                                                                                        ' +
                  '      <div class="col-xs-2">                                                            ' +
                  '          <vue-edellinen-label v-for="vanha_rivi in rivi.vanhat_rivit" :rivi="vanha_rivi" :jos="jos" :key="vanha_rivi.id"></vue-edellinen-label> ' +
                  '      </div>                                                                            ' +
                  '      <span v-if="jos" style="margin-left: 23px;"> (valittu: {{valittu}})</span>        ' +
                  '  </div>                                                                                '
                ,
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
                        let val = $('input[name=' + this.radioname + ']:checked').val();
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
                        let $radios = $('input[name=' + self.radioname + ']');
                        let radios = $.makeArray($radios);
                        for(let i=0;i<radios.length;++i){
                            let radio = radios[i];
                            if(radio.value == self.initialRivi.arvosana){
                                $(radio).prop("checked", true);
                            }
                        }
                    }, 10);
                }
});


Vue.component('vue-koontihuomautus', {
    template: 
        ' <div class="row" style="margin-bottom: 10px;">                                ' +
        '     <div class="col-xs-1" style="max-width: 20px;">{{huomautus.id}}</div>     ' +
        '     <div class="col-xs-4 rivi-label">{{huomautus.aihe}}</div>                 ' +
        '     <div class="col-xs-7">{{huomautus.teksti}}</div>                          ' +
        ' </div>                                                                        '
    ,
    props: ['huomautus', 'jos'],
    data: function () {
        return {
            initial_huomautus: this.huomautus,
        }
    },
});
Vue.component('vue-rivi', {
                template: 
                    ' <div class="form-group row"">                                                                                             ' +
                    '     <div class="col-xs-1" style="max-width: 20px;">                                                                       ' +
                    '         {{initialRivi.aihe_no>100?initialRivi.aihe_no-100:initialRivi.aihe_no}}                                            ' +
                    '     </div>                                                                                                                 ' +
                    '     <div class="col-xs-4">                                                                                                 ' +
                    '         <span class="rivi-label">{{initialRivi.otsikko}}</span>                                                            ' +
                    '         <template v-if="tila!=\'pieni\' && initialRivi.tekstiDisplayed()"><br>{{initialRivi.teksti}}</template>              ' +
                    '     </div>                                                                                                                 ' +
                    '     <div class="col-xs-3">                                                                                                 ' +
                    '         <div class="ruutu ruutu1"> <span v-if="initialRivi.arvosana==\'1\'">X</span> <span v-else>&nbsp;</span></div>        ' +
                    '         <div class="ruutu ruutu2"> <span v-if="initialRivi.arvosana==\'2\'">X</span> <span v-else>&nbsp;</span> </div>       ' +
                    '         <div class="ruutu ruutu3"> <span v-if="initialRivi.arvosana==\'3\'">X</span> <span v-else>&nbsp;</span> </div>       ' +
                    '         <div class="ruutu ruutu4"> <span v-if="initialRivi.arvosana==\'4\'">X</span> <span v-else>&nbsp;</span> </div>       ' +
                    '         <div class="ruutu ruutu5"> <span v-if="initialRivi.arvosana==\'5\'">X</span> <span v-else>&nbsp;</span> </div>       ' +
                    '         <div class="ruutu ruutu6"> <span v-if="initialRivi.arvosana==\'6\'">X</span> <span v-else>&nbsp;</span> </div>       ' +
                    '     </div>                                                                                                                 ' +
                    '                                                                                                                            ' +
                    '     <div class="col-xs-3" v-if="initialRivi.huomDisplayed()">                                                              ' +
                    '         <span class="rivi-label">Huom{{rivi.aihe_no}}: </span> {{rivi.huom}}                                               ' +
                    '     </div>                                                                                                                 ' +
                    ' </div>                                                                                                                     '
                ,
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
                template: 
                '    <div>                                                                                                                                                                   ' +
                '        <hr>                                                                                                                                                                ' +
                '        <h1>Valittu raportti</h1>                                                                                                                                           ' +
                '        <span v-if="jos">Id: {{raportti.id}}</span>                                                                                                                         ' +
                '                                                                                                                                                                            ' +
                '        <h3>Ottelu:</h3>                                                                                                                                                    ' +
                '        <p  >Pvm: {{raportti.pvm}}<br>                                                                                                                                      ' +
                '            Paikka: {{raportti.paikka}}<br>                                                                                                                                 ' +
                '            Ottelu: {{raportti.koti}}-{{raportti.vieras}},                                                                                                                  ' +
                '            <span v-if="raportti.miehet">Miehet</span><br>                                                                                                                  ' +
                '            <span v-if="!raportti.miehet">Naiset</span><br>                                                                                                                 ' +
                '            Tulos: {{raportti.tulos}}<br>                                                                                                                                   ' +
                '            Kesto: {{raportti.kesto_h}} h {{raportti.kesto_min}} min<br>                                                                                                    ' +
                '            Vaikeusaste: <span v-if="raportti.vaikeus==1">Helppo</span>                                                                                                     ' +
                '                         <span v-if="raportti.vaikeus==2">Normaali</span>                                                                                                   ' +
                '                         <span v-if="raportti.vaikeus==4">Vaikea</span>                                                                                                     ' +
                '        </pre>                                                                                                                                                              ' +
                '        <h3>Tuomarit:</h3>                                                                                                                                                  ' +
                '        <p>PT: {{raportti.pt_nimi}}<br>                                                                                                                                     ' +
                '        VT: {{raportti.vt_nimi}}<br>                                                                                                                                        ' +
                '        Tarkkailija: {{raportti.tark_nimi}}</p>                                                                                                                             ' +
                '                                                                                                                                                                            ' +
                '        <vue-kokonaisarvio :raportti="raportti"></vue-kokonaisarvio>                                                                                                        ' +
                '                                                                                                                                                                            ' +
                '        <h2>Päätuomari {{raportti.pt_nimi}}</h2>                                                                                                                            ' +
                '        <p>Pisteet: {{raportti.pt_score}}</p>                                                                                                                               ' +
                '        <div class="panel-group">                                                                                                                                           ' +
                '            <div class="panel panel-primary">                                                                                                                               ' +
                '                <div class="panel-heading">Tuomaritekniikka ja suoritustaito</div>                                                                                          ' +
                '                <div class="panel-body">                                                                                                                                    ' +
                '                    <vue-rivi v-for="rivi in raportti.palautaRivit(1,5)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :jos="jos" :tila="\'pieni\'"></vue-rivi>         ' +
                '                </div>                                                                                                                                                      ' +
                '            </div>                                                                                                                                                          ' +
                '                                                                                                                                                                            ' +
                '            <div class="panel panel-primary">                                                                                                                               ' +
                '                <div class="panel-heading">Sääntöjen sekä ohjeiden ja tulkintojen soveltaminen</div>                                                                        ' +
                '                <div class="panel-body">                                                                                                                                    ' +
                '                    <vue-rivi v-for="rivi in raportti.palautaRivit(6,10)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi>        ' +
                '                </div>                                                                                                                                                      ' +
                '            </div>                                                                                                                                                          ' +
                '                                                                                                                                                                            ' +
                '            <div class="panel panel-primary">                                                                                                                               ' +
                '                <div class="panel-heading">Vuorovaikutus joukkueiden kanssa</div>                                                                                           ' +
                '                <div class="panel-body">                                                                                                                                    ' +
                '                    <vue-rivi v-for="rivi in raportti.palautaRivit(11,13)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi>       ' +
                '                </div>                                                                                                                                                      ' +
                '            </div>                                                                                                                                                          ' +
                '                                                                                                                                                                            ' +
                '            <div class="panel panel-primary">                                                                                                                               ' +
                '                <div class="panel-heading">Ottelun johtaminen ja persoonallisuus</div>                                                                                      ' +
                '                <div class="panel-body">                                                                                                                                    ' +
                '                    <vue-rivi v-for="rivi in raportti.palautaRivit(14,17)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi>       ' +
                '                </div>                                                                                                                                                      ' +
                '            </div>                                                                                                                                                          ' +
                '                                                                                                                                                                            ' +
                '            <div class="panel panel-primary">                                                                                                                               ' +
                '                <div class="panel-heading">Yksittäiset kommentit</div>                                                                                                      ' +
                '                <div class="panel-body">                                                                                                                                    ' +
                '                    <vue-koontihuomautus v-for="huomautus in raportti.palauta_pt_huomautukset()" :key="huomautus.id" :huomautus="huomautus" :jos="jos"></vue-koontihuomautus>    ' +
                '                </div>                                                                                                                                                      ' +                                             
                '            </div>                                                                                                                                                          ' +
                '        </div>                                                                                                                                                              ' +
                '                                                                                                                                                                            ' +
                '        <h2>Verkkotuomari {{raportti.vt_nimi}}</h2>                                                                                                                         ' +
                '        <p>Pisteet: {{raportti.vt_score}}</p>                                                                                                                               ' +
                '        <div class="panel-group">                                                                                                                                           ' +
                '                                                                                                                                                                            ' +
                '            <div class="panel panel-primary">                                                                                                                               ' +
                '                <div class="panel-heading">Tuomaritekniikka ja suoritustaito</div>                                                                                          ' +
                '                <div class="panel-body">                                                                                                                                    ' +
                '                    <vue-rivi v-for="rivi in raportti.palautaRivit(101,106)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi>     ' +
                '                </div>                                                                                                                                                      ' +
                '            </div>                                                                                                                                                          ' +
                '                                                                                                                                                                            ' +
                '            <div class="panel panel-primary">                                                                                                                               ' +
                '                <div class="panel-heading">x</div>                                                                                                                          ' +
                '                <div class="panel-body">                                                                                                                                    ' +
                '                    <vue-rivi v-for="rivi in raportti.palautaRivit(107,111)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi>     ' +
                '                </div>                                                                                                                                                      ' +
                '            </div>                                                                                                                                                          ' +
                '                                                                                                                                                                            ' +
                '            <div class="panel panel-primary">                                                                                                                               ' +
                '                <div class="panel-heading">Vuorovaikutus joukkueiden kanssa</div>                                                                                           ' +
                '                <div class="panel-body">                                                                                                                                    ' +
                '                    <vue-rivi v-for="rivi in raportti.palautaRivit(112,113)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi>     ' +
                '                </div>                                                                                                                                                      ' +
                '            </div>                                                                                                                                                          ' +
                '                                                                                                                                                                            ' +
                '            <div class="panel panel-primary">                                                                                                                               ' +
                '                <div class="panel-heading">Ottelun johtaminen ja persoonallisuus</div>                                                                                      ' +
                '                <div class="panel-body">                                                                                                                                    ' +
                '                    <vue-rivi v-for="rivi in raportti.palautaRivit(114,117)" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi>     ' +
                '                </div>                                                                                                                                                      ' +
                '            </div>                                                                                                                                                          ' +
                '                                                                                                                                                                            ' +
                '            <div class="panel panel-primary">                                                                                                                               ' +
                '                <div class="panel-heading">Yksittäiset kommentit</div>                                                                                                      ' +
                '                <div class="panel-body">                                                                                                                                    ' +
                '                    <vue-koontihuomautus v-for="huomautus in raportti.palauta_vt_huomautukset()" :key="huomautus.id" :huomautus="huomautus" :jos="jos"></vue-koontihuomautus>    ' +
                '                </div>                                                                                                                                                      ' +
                '            </div>                                                                                                                                                          ' +
                '        </div>                                                                                                                                                              ' +
                '    </div>                                                                                                                                                                  '
                ,
                props: ['raportti', 'jos'],
                data: function () {
                    return {
                        randomId: this._uid,
                        initialRaportti: this.raportti,
                    }
                },
                updated: function(){
                    let title = this.raportti.title();
                    console.log(title);
                    $("#modal-title").text(title);
                }
});

Vue.component('vue-user', {
    template: 
    '  <div>                                                                    ' +
    '      <h2>Käyttäjä: <small>{{user.name}}</small></h2>                      ' +
    '      <p v-if="user.login">                                                ' +
    '          <div style="display: inline-block; width: 150px;">               ' +
    '              <b>Rooli:</b>                                                ' +
    '          </div>                                                           ' +
    '          {{rooli}}                                                        ' +
    '      </p>                                                                 ' +
    '      <p v-if="user.login">                                                ' +
    '          <div style="display: inline-block; width: 150px;">               ' +
    '              <b>Kirjautumislinkki:</b>                                    ' +
    '          </div>                                                           ' +
    '          <a :href="href">www.lentopalloerotuomarit.fi/tark2343/tark/?token={{user.token}}</a>    ' +
    '      </p>                                                                 ' +
    '      <p>                                                                  ' +
    '          <div style="display: inline-block; width: 150px;">               ' +
    '              <b>Email:</b>                                                ' +
    '          </div>                                                           ' +
    '          <input style="width: 250px; display: inline-block;" class="form-control" type="email" v-model="user.email" @change="emailChanged()">     ' +
    '          <button v-if="changed" class="btn" @click="saveEmail">Talleta sähköposti</button>                                                        ' +
    '      </p>                                                                 ' +
    '      <p>                                                                  ' +
    '          <button class="btn" @click="logout()">Kirjaudu ulos</button>     ' +
    '      </p>                                                                 ' +
    '  </div>                                                                   '
    ,
    props: ['user', 'jos'],
    created: function(){
        let self=this;
        bus.on(EVENT_EMAIL_SAVED, function(){
            self.changed = false;
        });
    },
    data: function () {
        let href="";
        if(this.user != undefined) href= "http://www.lentopalloerotuomarit.fi/tark2343/tark/?token=" + this.user.token;
        return {
            changed: false,
            href: href,  
        }
    },
    methods: {
        logout: function(){
            bus.emit(EVENT_LOGOUT);
        },
        saveEmail: function(){
            toastr.clear();
            toastr.info("Talletetaan sähköpostiosoitetta...");
            bus.emit(EVENT_SAVE_EMAIL, this.user);
        },
        emailChanged: function(){
            this.changed=true;
        }
    },
    computed: {
        rooli: function(){
            let rooli = "EI MITÄÄN";
            if(this.user.rooli == ROOLI_TARKKAILIJA.toString()) rooli = "Tarkkailija";
            if(this.user.rooli == ROOLI_TUOMARI.toString()) rooli = "Tuomari";
            if(this.user.rooli == ROOLI_ADMIN.toString()) rooli = "Admin";
            return rooli;
        },
    }
});

Vue.component('vue-login', {
    template: 
        '  <div>                                                                                                                                                                             ' +
        '      <h2>Kirjaudu sisään</h2>                                                                                                                                                      ' +
        '      <p>Sisäänkirjautuminen tapahtuu kunkin tuomarin tai tarkkailijan henkilökohtaisella linkillä.</p>                                                                             ' +
        '                                                                                                                                                                                    ' +  
        '      <p>Tässä voit tilata uuden linkin. Syötä oheiseen kenttään sähköpostiosoitteesi. Jos osoite on liitetty käyttäjälle, niin ko. osoitteeseen lähetetään kirjautumislinkki.</p>  ' +
        '      <p>                                                                                                                                                                           ' +
        '          <b>Email:</b>                                                                                                                                                             ' +
        '          <input style="width: 250px; display: inline-block;" class="form-control" type="email" v-model="email"">                                                                   ' +
        '          <button class="btn" @click="requestLink">Tilaa linkki</button>                                                                                                            ' +
        '      </p>                                                                                                                                                                          ' +
        '  </div>                                                                                                                                                                            '
        ,
    props: ['jos'],
    data: function(){
        return {
            email: "",
        }
    },
    methods: {
        requestLink: function(){
            toastr.info("Tilataan linkkiä...");
            bus.emit(EVENT_REQUEST_LINK, this.email);
        }
    }
});