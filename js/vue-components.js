

Vue.component('vue-jos-grid', {
    template: `
    <div class="jos-table-container" style="padding: 0px;">   

    <input v-if="options.generalFilter" style="margin-top: 16px;" type="text" v-model="general_filter" placeholder="Hae">
    <table :class="options.luokka" id="jos-grid" style="display: block; cursor: pointer;">                                                                               
        <thead>                                                                                                   
            <tr>                                                                                                  
                <th v-for="column in shownColumns" :class="{active: sortCol == column.key}" :width="column.width">
                    <span @click="column.sortable != false && sortBy(column.key)">{{column.title}}</span>         
                    <span v-if="sortIndicators[column.key]==1" class="glyphicon glyphicon-triangle-top"></span>                                          
                    <span v-if="sortIndicators[column.key]==-1" class="glyphicon glyphicon-triangle-bottom"></span>                                       

                    <i v-if="column.isLast" style="float: right" class="glyphicon glyphicon-filter" @click="toggleColumnFilters()" title="Sarakekohtaiset suodattimet päälle/pois" />                                                                                  
                    
                    <template v-if="columnFilters && column.filterable != false">                                                  
                        <br><input style="width: 80%;" type="text" v-model="filters[column.key]">                 
                    </template> 
                </th>                                                                                             
            </tr>                                                                                                 
        </thead>                                                                                                  
        <tbody>                                                                                                   
            <tr v-for="entry in filteredSortedData" :key="entry.josOrder" @click="rowClick(entry)">            
                <td v-for="column in shownColumns">                                                               
                    <div v-if="column.template" style="display: inline-block" v-html="entry[column.key]"></div>
                    <template v-else>
                        <template v-if="column.type == \'text\'">                                                     
                            {{entry[column.key]}}                                                                     
                        </template>                                                                                   
                        <template v-if="column.type == \'number\'">                                                   
                            {{entry[column.key]}}                                                                                          
                        </template>                                                                                    
                        <template v-if="column.type == \'link\'">                                                     
                            <a :href="entry[column.key].href">{{entry[column.key].text}}</a>                          
                        </template>                                                                                   
                        <template v-if="column.type == \'date\'">                                                     
                            {{formatDate(entry[column.key])}}
                        </template>                                                                                   
                    </template>
                </td>                                                                                             
            </tr>                                                                                                 
        </tbody>                                                                                                  
    </table>                                                                                                      
    </div>                
    `,
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
        let cnt = 1;
        if(this.options && this.options.columns){
            this.options.columns.forEach(function (column) {
                let localColumn = column;
                localColumn.josSortOrder=0;
                if(column.type == undefined) localColumn.type = "text";
                if(column.name == undefined) localColumn.name = column.key;
                columns.push(localColumn);
                sortIndicators[column.key]=0;
                localColumn.isLast = (cnt++ == self.options.columns.length-1);
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

        let sortKey = '';
        if(this.options.initialSort){
            sortIndicators[this.options.initialSort.key] = this.options.initialSort.order; //sortIndicators['pvm']=-1;
            sortKey = this.options.initialSort.key;
        }

        let columnFilters = this.options.columnFilters;
        if(localStorage.josGridColumnFilters) columnFilters = localStorage.josGridColumnFilters;
        if(typeof(columnFilters) === 'undefined') columnFilters = false;

        return {
            columnFilters: columnFilters,
            menu: false,
            general_filter: "",
            localData: localData,
            sortCol:  sortKey,
            sortOrder: -1,
            columns: columns,
            sortIndicators: sortIndicators,
            filters: filters,
        }
    },

    created: function(){
        if(this.options.onCreated) this.options.onCreated(this);

        if(this.options.columnFilters != true) this.options.columnFilters = false;
        if(this.options.generalFilter != true) this.options.generalFilter = false;
    },

    computed: {
        shownColumns: function(){
            return this.columns.filter(function(item){ return item.hidden != true});
        },
        
        filteredSortedData: function(){
            let self = this;
            let ret = this.localData;
            
            if(this.options.externalFilters){
                for(let extFilt of this.options.externalFilters){
                    ret = extFilt(ret);
                }
            }

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
                            return r*self.sortOrder;
                        });    
                    }
                }
            }

            ret = this.generalFilter(ret);

            return ret;
        },
    },
    methods: {
        toggleColumnFilters(){
            this.columnFilters = !this.columnFilters;
            
            localStorage.josGridColumnFilters = this.columnFilters;
        },
        
        rowClick: function(row_item){
            if(this.options.onRowClick) this.options.onRowClick(row_item);
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
            if(entry == null || entry == undefined) entry = "";
            if(column.type == 'link') return entry.text.toLowerCase();
            return entry.toLowerCase();
        },
        filterByColumn: function(column, data){
            let self=this;
            let filter = this.filters[column.key];
            if(filter == undefined || filter.length < 1) return data;
            filter = filter.toLowerCase();
            let ret = data; 
          
            ret = ret.filter(function(item){
                let val = self.getVal(column, item[column.key]);
                if(val == undefined) val = "";
                val=val.toString().toLowerCase();
                return val.indexOf(filter) > -1;
            });
            return ret;
        },
        generalFilter: function(data){
            if(this.general_filter.length < 1) return data;

            let self=this;
            let filter = this.general_filter.toLowerCase();
            let ret = data; 
          
            ret = ret.filter(function(item){
                let accept=false;
                for(let col of self.columns){
                    if(col.hidden) continue;
                    let val = self.getVal(col, item[col.key]);
                    val = val.toString().toLowerCase();
                    if(val.indexOf(filter) > -1){
                        accept=true;
                        break;
                    }
                }
                return accept;
            });
            return ret;
        },
        formatDate: function(string){
            return moment(string).format("DD.MM.YYYY");
        }
    },
});

Vue.component('vue-kokonaishuomautus', {
    template:` 
    <div class="panel-group">                                                                                     
        <div class="panel panel-primary">                                                         
            <div class="panel-heading" v-if="isPT">Kehityssuositukset ja huomautukset (PT)</div>  
            <div class="panel-heading" v-else>Kehityssuositukset ja huomautukset (VT)</div>       
            <div class="panel-body" style="font-size: 18px;">                                     
                <textarea class="form-control" v-if="isPT" v-model="raportti.pt_huom"></textarea> 
                <textarea class="form-control" v-else v-model="raportti.vt_huom"></textarea>      
            </div>                                                                                
        </div>                                                                                    
    </div>
    `,
    props: ['pt_tai_vt', 'raportti', 'jos'],
    data: function(){
        return {
            initRaporti: this.raportti,
            isPT: this.pt_tai_vt.toLowerCase() == 'pt',
        }
    },
});

Vue.component('vue-otteluhuomautus', {
    template:` 
    <div class="panel-group">                                                                        
        <div class="panel panel-primary">                                                            
            <div class="panel-heading">Muita huomioita ottelusta</div>                                    
            <div class="panel-body" style="font-size: 18px;">                                            
                <textarea class="form-control" v-model="raportti.raportti_huom"></textarea>            
            </div>                                                                                    
        </div>                                                                                          
    </div>                                                                                          
    `,
    props: ['raportti', 'jos'],
    data: function(){
        return {
            initRaporti: this.raportti,
        }
    },
});


Vue.component('vue-kokonaisarvio', {
    template:` 
    <div class="panel-group">                                                                               
        <div class="panel panel-primary">                                                                    
            <div class="panel-heading">Lopullinen tuomariarvio</div>                                                
            <div class="panel-body" style="font-size: 18px;">                                                          
                <div class="row">                                                                              
                    <div class="col-xs-2"></div>                                                                    
                    <div class="col-xs-4" style="text-align: center;">Päätuomari {{raportti.pt_nimi}}</div>                  
                    <div class="col-xs-4" style="text-align: center;">Verkkotuomari {{raportti.vt_nimi}}</div>                  
                </div>                                                                                                  
                <div class="row">                                                                                        
                    <div class="col-xs-2" style="text-align: right;">Pisteet</div>                            
                    <div class="col-xs-4" style="text-align: center">                                                
                        <div v-show="raportti.pt_score!=\'<puuttuu>\'" style="min-width: 65px;" class="ruutuIsoAla ruutuVika">      
                            {{raportti.pt_score}}                                                                                        
                         </div>                                                                                                            
                    </div>                                                                                                                      
                    <div class="col-xs-4" style="text-align: center">                                                                    
                        <div v-show="raportti.pt_score!=\'<puuttuu>\'" style="min-width: 65px;" class="ruutuIsoAla ruutuVika">                
                            {{raportti.vt_score}}                                                                                        
                        </div>                                                                                                            
                    </div>                                                                                                            
                </div>                                                                                                            
                <div class="row">                                                                                                  
                    <div class="col-xs-2" style="text-align: right;">&nbsp;</div>                                                          
                    <div class="col-xs-4" style="text-align: center">                                                                    
                        <div class="ruutuIsoYla"> Erinomainen</div>                                                                                        
                        <div class="ruutuIsoYla"> Erittäin hyvä</div>                                                                                        
                        <div class="ruutuIsoYla"> Hyvä</div>                                                                                        
                        <div class="ruutuIsoYla"> Välttävä</div>                                                                                        
                        <div class="ruutuIsoYla"> Huono</div>                                                                                        
                    </div>                                                                                                                                     
                    <div class="col-xs-4" style="text-align: center">                                                                                        
                        <div class="ruutuIsoYla"> Erinomainen</div>                                                                                        
                        <div class="ruutuIsoYla"> Erittäin hyvä</div>                                                                                        
                        <div class="ruutuIsoYla"> Hyvä</div>                                                                                        
                        <div class="ruutuIsoYla"> Välttävä</div>                                                                                        
                        <div class="ruutuIsoYla"> Huono</div>                                                                                        
                    </div>                                                                                                                                     
                </div>                                                                                                                                     
                <div class="row">                                                                                                                                     
                    <div class="col-xs-2" style="text-align: right;">Lopullinen arvio</div>                                                                                        
                    <div class="col-xs-4" style="text-align: center">                                                                                        
                        <div class="ruutuIsoAla ruutu1"> <span v-if="pt1">X</span> <span v-else>&nbsp;</span></div>                                           
                        <div class="ruutuIsoAla ruutu2"> <span v-if="pt2">X</span> <span v-else>&nbsp;</span></div>                                           
                        <div class="ruutuIsoAla ruutu3"> <span v-if="pt3">X</span> <span v-else>&nbsp;</span></div>                                           
                        <div class="ruutuIsoAla ruutu4"> <span v-if="pt4">X</span> <span v-else>&nbsp;</span></div>                                           
                        <div class="ruutuIsoAla ruutu5 ruutuVika"> <span v-if="pt5">X</span> <span v-else>&nbsp;</span></div>                                           
                    </div>                                                                                                                                     
                    <div class="col-xs-4" style="text-align: center">                                                                                        
                        <div class="ruutuIsoAla ruutu1"> <span v-if="vt1">X</span> <span v-else>&nbsp;</span></div>                                           
                        <div class="ruutuIsoAla ruutu2"> <span v-if="vt2">X</span> <span v-else>&nbsp;</span></div>                                           
                        <div class="ruutuIsoAla ruutu3"> <span v-if="vt3">X</span> <span v-else>&nbsp;</span></div>                                           
                        <div class="ruutuIsoAla ruutu4"> <span v-if="vt4">X</span> <span v-else>&nbsp;</span></div>                                           
                        <div class="ruutuIsoAla ruutu5 ruutuVika"> <span v-if="vt5">X</span> <span v-else>&nbsp;</span></div>                                           
                    </div>                                                                                                                   
                </div>                                                                                                                   
                                                                                                                                                              
                <div class="row">                                                                                                                                                                
                    <div class="col-xs-2" style="text-align: right; margin-top: 20px;">Kehityssuositukset ja huomautukset</div>   
                    <textarea readonly class="col-xs-4" style="text-align: left; min-height: 30px; font-size: 16px; border: 1px solid black; margin: 20px;">{{raportti.pt_huom}}</textarea>               
                    <textarea readonly class="col-xs-4" style="text-align: left; min-height: 30px; font-size: 16px; border: 1px solid black; margin: 20px;">{{raportti.vt_huom}}</textarea>               
                </div>                                                                                                                                                                     
                                                                                                                                                            
                <div class="row">                                                                                                                                                                                      
                    <div class="col-xs-2" style="text-align: right; margin-top: 20px;">Muita huomioita</div>                                                                                            
                    <textarea readonly class="col-xs-8" style="text-align: left; min-height: 30px; font-size: 16px; border: 1px solid black; margin: 20px;">{{raportti.raportti_huom}}</textarea> 
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
    template:`
    <div :id="randomId" class="label" @click="onClick()" data-toggle="tooltip" :title="html">
        <span v-if="initialRivi.arvosana==\'6\'" class="label-dark-red">{{arvosana}}</span>  
        <span v-if="initialRivi.arvosana==\'5\'" class="label-red">{{arvosana}}</span>       
        <span v-if="initialRivi.arvosana==\'4\'" class="label-orange">{{arvosana}}</span>    
        <span v-if="initialRivi.arvosana==\'3\'" class="label-yellow">{{arvosana}}</span>    
        <span v-if="initialRivi.arvosana==\'2\'" class="label-white">{{arvosana}}</span>     
        <span v-if="initialRivi.arvosana==\'1\'" class="label-green">{{arvosana}}</span>     
    </div>
    `,
    props: ['rivi', 'jos'],
    data: function () {
        let arvosana=this.rivi.arvosana;
        let selite = "";
        switch(arvosana){
            case "1":
                arvosana = 'a';
                selite = TITLES.a;
                break;
            case "2":
                arvosana = 'b';
                selite = TITLES.b;
                break;
            case "3":
                arvosana = 'c';
                selite = TITLES.c;
                break;
            case "4":
                arvosana = 'd';
                selite = TITLES.d;
                break;
            case "5":
                arvosana = 'e';
                selite = TITLES.e;
                break;
            case "6":
                arvosana = 'f';
                selite = TITLES.f;
                break;
        }
        return {
            arvosana: arvosana,
            selite: selite,
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

            ret += "<p>" + this.rivi.aihe_no + " " + this.rivi.otsikko + ": " + this.selite + "</p>";

            let huom = "&lt;ei huomautusta&gt;";
            if(this.rivi.huom != undefined && this.rivi.huom.length > 0){
                huom = this.rivi.huom;
                
                let no = this.rivi.aihe_no;
                if(no > 100) no -= 100;
                ret += '<p>Huomautus: ' + huom + '</p>';
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
    <div style="margin-bottom: 10px;">
        <label>Sarja</label><br>
        <div class="btn-group">
            <button type="button" :class="luokka.miehet" @click="select(RADIO_MIEHET)">Miehet</button>
            <button type="button" :class="luokka.naiset" @click="select(RADIO_NAISET)">Naiset</button>
            <button type="button" :class="luokka.muu"    @click="select(RADIO_MUU)">Muu</button>
        </div>
    </div>
    `,
    props: ['raportti', 'jos'],
    data: function () {
        return {
            randomId: this._uid,
            initialRaportti: this.raportti,
            valittu: null,
            inputPlaceholder: "",
            RADIO_MIEHET: RADIO_MIEHET,
            RADIO_NAISET: RADIO_NAISET,
            RADIO_MUU: RADIO_MUU,
        }
    },
    methods: {
        select(val){
            this.raportti.miehet = val;
        },
    },
    computed: {
        luokka(){
            let miehet=false;
            let naiset = false;
            let muu = false;
            if(this.raportti.miehet == RADIO_MIEHET) miehet = true;
            if(this.raportti.miehet == RADIO_NAISET) naiset = true;
            if(this.raportti.miehet == RADIO_MUU) muu = true;

            let ret = {
                miehet: {
                    'btn': true,
                    'btn-default': !miehet,
                    'btn-primary': miehet,
                },
                naiset: {
                    'btn': true,
                    'btn-default': !naiset,
                    'btn-primary': naiset,
                },
                muu: {
                    'btn': true,
                    'btn-default': !muu,
                    'btn-primary': muu,
                },
            };
            return ret;
        },
    },
});
Vue.component('vue-vaikeusaste', {
    template: `
    <div style="margin-bottom: 10px;">
        <label>Ottelun vaikeusaste</label><br>
        <div class="btn-group">
            <button type="button" :class="luokka.helppo" @click="select(HELPPO)">Helppo</button>
            <button type="button" :class="luokka.normaali" @click="select(NORMAALI)">Normaali</button>
            <button type="button" :class="luokka.vaikea"    @click="select(VAIKEA)">Vaikea</button>
        </div>
    </div>
    `,
    props: ['raportti', 'jos'],
    data: function () {
        return {
            randomId: this._uid,
            initialRaportti: this.raportti,
            inputPlaceholder: "",
            HELPPO: HELPPO,
            VAIKEA: VAIKEA,
            NORMAALI: NORMAALI,
        }
    },
    methods: {
        select(val){
            this.raportti.vaikeus = val;
        },
    },
    computed: {
        luokka(){
            let helppo=false;
            let vaikea = false;
            let normaali = false;
            if(this.raportti.vaikeus == HELPPO) helppo = true;
            if(this.raportti.vaikeus == VAIKEA) vaikea = true;
            if(this.raportti.vaikeus == NORMAALI) normaali = true;

            let ret = {
                helppo: {
                    'btn': true,
                    'btn-default': !helppo,
                    'btn-primary': helppo,
                },
                vaikea: {
                    'btn': true,
                    'btn-default': !vaikea,
                    'btn-primary': vaikea,
                },
                normaali: {
                    'btn': true,
                    'btn-default': !normaali,
                    'btn-primary': normaali,
                },
            };
            return ret;
        },
    },
});

Vue.component('vue-rivi-edit', {
    template: `
    <div class="form-group row" :style="{\'border-left\': leftBorder}">                         
        <div class="col-xs-1" style="max-width: 20px;">                                         
            {{initialRivi.aihe_no>100?initialRivi.aihe_no-100:initialRivi.aihe_no}}             
        </div>                                                                                  
        <div class="col-xs-3">                                                                  
            <span class="rivi-label">{{initialRivi.otsikko}}</span>                             
            <template v-if="initialRivi.tekstiDisplayed()"><br>{{initialRivi.teksti}}</template>
        </div>                                                                                  
        <div class="col-xs-3" style="max-width: 265px; min-width: 265px;">                      
            <input style="width: 1px; border: 0px; opacity: 0.01;" type="text" required v-model="validator">
            <div class="btn-group">
                <button type="button" :class="luokka.a" @click="select('1')" :title="a">a</button>
                <button type="button" :class="luokka.b" @click="select('2')" :title="b">b</button>
                <button type="button" :class="luokka.c" @click="select('3')" :title="c">c</button>
                <button type="button" :class="luokka.d" @click="select('4')" :title="d">d</button>
                <button type="button" :class="luokka.e" @click="select('5')" :title="e">e</button>
                <button type="button" :class="luokka.f" @click="select('6')" :title="f">f</button>
            </div>            
        </div>                                                        
        <div class="col-xs-3">                                        
            <textarea class="form-control"                            
                  :placeholder="inputPlaceholder"                     
                  :style="{\'background-color\': inputBG}"            
                  :id="id" v-model="rivi.huom" type="text"></textarea>
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
            id: "huom_" + this.rivi.aihe_no,
            randomId: this._uid,
            initialRivi: this.rivi,
            inputPlaceholder: "",
            valittu: 0,
             
            validator: "",

            a: TITLES.a,
            b: TITLES.b,
            c: TITLES.c,
            d: TITLES.d,
            e: TITLES.e,
            f: TITLES.f,
        }
    },
    methods: {
        select(val){
            this.rivi.arvosana = val;
            this.raportti.laske();
            this.valittu=val;
            if(val != "0") this.validator = val;
            else this.validator="";
        },

        external_change: function(data){
            if(this.rivi.aihe_no == data.aihe_no){
                this.select(data.arvosana);
            }
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
        },
        luokka(){
            let a = false;
            let b = false;
            let c = false;
            let d = false;
            let e = false;
            let f = false;
            if(this.rivi.arvosana == "1") a = true;
            if(this.rivi.arvosana == "2") b = true;
            if(this.rivi.arvosana == "3") c = true;
            if(this.rivi.arvosana == "4") d = true;
            if(this.rivi.arvosana == "5") e = true;
            if(this.rivi.arvosana == "6") f = true;

            let ret = {
                a: {'btn': true, 'btn-default': !a, 'btn-primary': a },
                b: {'btn': true, 'btn-default': !b, 'btn-primary': b },
                c: {'btn': true, 'btn-default': !c, 'btn-primary': c },
                d: {'btn': true, 'btn-default': !d, 'btn-primary': d },
                e: {'btn': true, 'btn-default': !e, 'btn-primary': e },
                f: {'btn': true, 'btn-default': !f, 'btn-primary': f },
            };
            return ret;
        },
        
    },

    created: function(){
        let self=this;
        bus.on(EVENT_CHANGE, function(data){
            self.external_change(data);
        });
    }
});


Vue.component('vue-koontihuomautus', {
    template: `
    <div class="row" style="margin-bottom: 10px;">                           
        <div class="col-xs-1" style="max-width: 20px;">{{huomautus.id}}</div>
        <div class="col-xs-4 rivi-label">{{huomautus.aihe}}</div>            
        <div class="col-xs-7">{{huomautus.teksti}}</div>                     
    </div>                                                                   
    `,
    props: ['huomautus', 'jos'],
    data: function () {
        return {
            initial_huomautus: this.huomautus,
        }
    },
});

Vue.component('vue-rivi', {
    template: ` 
    <div class="form-group row"">                                                                                              
        <div class="col-xs-1" style="max-width: 20px;">                                                                        
            {{initialRivi.aihe_no>100?initialRivi.aihe_no-100:initialRivi.aihe_no}}                                            
        </div>                                                                                                                 
        <div class="col-xs-4">                                                       
            <template v-if="tila!=\'pieni\' && initialRivi.tekstiDisplayed()">       
                <span class="rivi-label">{{initialRivi.otsikko}}</span>              
                <br>{{initialRivi.teksti}}</template>                                
            </template>                                                              
            <template v-else>                                                        
                <span class="rivi-label">{{initialRivi.otsikko}}</span>                            
                <br><small>{{initialRivi.teksti}}</small></template>                               
            </template>                                                                            
        </div>                                                                                     
        <div class="col-xs-3">                                                                     
            <div class="ruutu ruutu1" :title="a"> <span v-if="initialRivi.arvosana==\'1\'">a</span> <span v-else>&nbsp;</span></div> 
            <div class="ruutu ruutu2" :title="b"> <span v-if="initialRivi.arvosana==\'2\'">b</span> <span v-else>&nbsp;</span> </div>
            <div class="ruutu ruutu3" :title="c"> <span v-if="initialRivi.arvosana==\'3\'">c</span> <span v-else>&nbsp;</span> </div>
            <div class="ruutu ruutu4" :title="d"> <span v-if="initialRivi.arvosana==\'4\'">d</span> <span v-else>&nbsp;</span> </div>
            <div class="ruutu ruutu5" :title="e"> <span v-if="initialRivi.arvosana==\'5\'">e</span> <span v-else>&nbsp;</span> </div>
            <div class="ruutu ruutu6" :title="f"> <span v-if="initialRivi.arvosana==\'6\'">f</span> <span v-else>&nbsp;</span> </div>
        </div>                                                                                                                 
                                                                                                                            
        <div class="col-xs-3" v-if="initialRivi.huomDisplayed()">                                                              
            <span class="rivi-label">Huom {{huom_no}}: </span> {{rivi.huom}}                                                   
        </div>                                                                                                                 
    </div>      
    `,
    props: ['rivi', 'tila', 'jos'],
    data: function () {
        let huom_no = 0;
        if(typeof(this.rivi) !== 'undefined') huom_no = this.rivi.aihe_no;
        if(huom_no > 100) huom_no -= 100;
        return {
            huom_no: huom_no,
            randomId: this._uid,
            initialRivi: this.rivi,
            valittu: 0,
            radioname: "opt" + this.rivi.aihe_no,
            inputPlaceholder: "",
            a: TITLES.a,
            b: TITLES.b,
            c: TITLES.c,
            d: TITLES.d,
            e: TITLES.e,
            f: TITLES.f,
        }
    },
});

Vue.component('vue-arvosanojen-selitykset', {
    template: `
    <div class="panel panel-primary">                         
        <div class="panel-heading">Arvosanojen selitteet</div>
        <div class="panel-body">                              
            <div class="row">                                 
                <div class="col-xs-4"><b>a:</b> {{a}}</div>   
                <div class="col-xs-4"><b>d:</b> {{d}}</div>   
            </div>                                            
            <div class="row">                                 
                <div class="col-xs-4"><b>b:</b> {{b}}</div>   
                <div class="col-xs-4"><b>e:</b> {{e}}</div>   
            </div>                                            
            <div class="row">                                 
                <div class="col-xs-4"><b>c:</b> {{c}}</div>   
                <div class="col-xs-4"><b>f:</b> {{f}}</div>   
            </div>                                            
        </div>                                                
    </div>                                                     
    `,
    props: ['jos'],
    data: function () {
        return {
            randomId: this._uid,
            a: TITLES.a,
            b: TITLES.b,
            c: TITLES.c,
            d: TITLES.d,
            e: TITLES.e,
            f: TITLES.f,
        }
    },
});

Vue.component('vue-rivi-otsikko', {
    template: `
    <div class="form-group row"">                         
        <div class="col-xs-1" style="max-width: 20px;">   
        </div>                                            
        <div class="col-xs-4">                            
        </div>                                            
        <div class="col-xs-3">                            
            <div class="ruutu ruutu1" :title="a"> a </div>
            <div class="ruutu ruutu2" :title="b"> b </div>
            <div class="ruutu ruutu3" :title="c"> c </div>
            <div class="ruutu ruutu4" :title="d"> d </div>
            <div class="ruutu ruutu5" :title="e"> e </div>
            <div class="ruutu ruutu6" :title="f"> f </div>
        </div>
    </div>    
    `,
    props: [],
    data: function () {
        return {
            a: TITLES.a,
            b: TITLES.b,
            c: TITLES.c,
            d: TITLES.d,
            e: TITLES.e,
            f: TITLES.f,
        }
    },
});

Vue.component('vue-raportti', {
    template:` 
    <div>                                                                                                                                                    
        <hr>                                                                                                                                                 
        <h1>
            {{title}} 
            <button class="btn btn-default" @click="sulje" style="margin-left: 30px;">Sulje raportti</button>
            <button v-if="raportti.rivit.length > 0" class="btn" @click="print" style="float: right;"  title="Lataa raportti pdf-tiedostona"><i class="glyphicon glyphicon-download-alt"/> PDF</button>
        </h1>                                                                                                                            
        <span v-if="jos">Id: {{raportti.id}}</span>                                                                                                          
                                                                                                                
        <div class="panel-group">                                                                                                                 
            <div class="panel panel-primary">                                                                                         
                <div class="panel-heading">Ottelun tiedot</div>                                                    
                <div class="panel-body">                                                                                              
                    Pvm: {{pvm}}<br>                                                                                                                       
                    Paikka: {{raportti.paikka}}<br>                                                                                                                  
                    Ottelu: {{raportti.koti}}-{{raportti.vieras}},                                                                                                   
                    <span v-if="raportti.miehet==\'1\'">Miehet</span>                                                                                                
                    <span v-if="raportti.miehet==\'2\'">Naiset</span>                                                                                                
                    <span v-if="raportti.miehet==\'3\'">Muu</span><br>                                                                                               
                    Tulos: {{raportti.tulos}}<br>                                                                                                                    
                    Kesto: {{raportti.kesto_h}} h {{raportti.kesto_min}} min<br>                                                                                     
                    Vaikeusaste: <span v-if="raportti.vaikeus==1">Helppo</span>                                                                                      
                                    <span v-if="raportti.vaikeus==2">Normaali</span>                                                                      
                                    <span v-if="raportti.vaikeus==3">Vaikea</span>                                                                        

                    <br><br>
                    Päätuomari: {{raportti.pt_nimi}}<br>                                                                                                           
                    Verkkotuomari: {{raportti.vt_nimi}}<br>                                                                                                              
                    Tarkkailija: {{raportti.tark_nimi}}
                </div>
            </div>
            
            <br>
            
            <vue-kokonaisarvio :raportti="raportti"></vue-kokonaisarvio>                                                                              
                                                                                                                
            <h2>Päätuomari {{raportti.pt_nimi}} <small>Pisteet: {{raportti.pt_score}}</small></h2>                                                                                                  
                                                                                                    
            <vue-arvosanojen-selitykset></vue-arvosanojen-selitykset>                                                                 
                                                                                                    
            <div class="panel panel-primary">                                                                                         
                <div class="panel-heading">Tuomaritekniikka ja suoritustaito</div>                                                    
                <div class="panel-body">                                                                                              
                    <vue-rivi-otsikko></vue-rivi-otsikko>                                                                             
                    <vue-rivi v-for="rivi in rivit_1_5" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :jos="jos" :tila="\'pieni\'"></vue-rivi>       
                </div>                                                                              
            </div>                                                                                  
            <div class="panel panel-primary">                                                       
                <div class="panel-heading">Sääntöjen sekä ohjeiden ja tulkintojen soveltaminen</div>
                <div class="panel-body">                                                            
                    <vue-rivi v-for="rivi in rivit_6_10" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi>
                </div>                                                                                                               
            </div>                                                                                                                   
                                                                                            
            <div class="panel panel-primary">                                                                                        
                <div class="panel-heading">Vuorovaikutus joukkueiden kanssa</div>                                                    
                <div class="panel-body">                                                                                             
                    <vue-rivi v-for="rivi in rivit_11_13" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi> 
                </div>                                                                                                                   
            </div>                                                                                                                       
                                                                                                        
            <div class="panel panel-primary">                                                                                            
                <div class="panel-heading">Ottelun johtaminen ja persoonallisuus</div>                                                   
                <div class="panel-body">                                                                                                 
                    <vue-rivi v-for="rivi in rivit_14_17" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi>
                </div>                                                                                                                              
            </div>                                                                                                                                
        </div>                                                                                                                                         
                                                                                                        
        <h2>Verkkotuomari {{raportti.vt_nimi}} <small>Pisteet: {{raportti.vt_score}}</small></h2>                                                                                                    
        
        <div class="panel-group">                                                                                                                      
                                                                                                        
            <vue-arvosanojen-selitykset></vue-arvosanojen-selitykset>                                                                                  
                                                                                                        
            <div class="panel panel-primary">                                                                                                          
                <div class="panel-heading">Tuomaritekniikka ja suoritustaito</div>                                                                     
                <div class="panel-body">                                                                                                               
                    <vue-rivi-otsikko></vue-rivi-otsikko>                                                                                              
                    <vue-rivi v-for="rivi in rivit_101_106" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi>
                </div>                                                                                                                 
            </div>                                                                                                                     
                                                                                            
            <div class="panel panel-primary">                                                                                          
                <div class="panel-heading">x</div>                                                                                     
                <div class="panel-body">                                                                                               
                    <vue-rivi v-for="rivi in rivit_107_111" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi> 
                </div>                                                                                                                  
            </div>                                                                                                                      
                                                                                            
            <div class="panel panel-primary">                                                                                           
                <div class="panel-heading">Vuorovaikutus joukkueiden kanssa</div>                                                       
                <div class="panel-body">                                                                                                
                    <vue-rivi v-for="rivi in rivit_112_113" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi>
                </div>                                                                                                      
            </div>                                                                                                          
                                                                                                                            
            <div class="panel panel-primary">                                                                               
                <div class="panel-heading">Ottelun johtaminen ja persoonallisuus</div>                                      
                <div class="panel-body">                                                                                    
                    <vue-rivi v-for="rivi in rivit_114_117" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi> 
                </div>                                                                                                                
            </div>                                                                                                                    
        </div>                                                                                                                                                          
    </div>                                                                                                                                                               
    `,
    props: ['raportti', 'jos'],
    data: function () {
        let a=0;
        let title = this.raportti.title();
        return {
            randomId: this._uid,
            title: title,
            pvm: moment(this.raportti.pvm).format("DD.MM.YYYY"),
            //pt_huomautukset: palauta_pt_huomautukset(this.raportti),
            //vt_huomautukset: palauta_vt_huomautukset(this.raportti),
            initialRaportti: this.raportti,
        }
    },
    mounted: function(){
        autosize($('textarea'));
    },
    computed: {
        rivit_1_5: function(){
            if(this.raportti.rivit.length < 34) return [];
            return [ this.raportti.rivit[0], this.raportti.rivit[1], this.raportti.rivit[2], this.raportti.rivit[3], this.raportti.rivit[4]];
        },

        rivit_6_10: function(){
            if(this.raportti.rivit.length < 34) return [];
            return [ this.raportti.rivit[5], this.raportti.rivit[6], this.raportti.rivit[7], this.raportti.rivit[8], this.raportti.rivit[9]];
        },

        rivit_11_13: function(){
            if(this.raportti.rivit.length < 34) return [];
            return [ this.raportti.rivit[10], this.raportti.rivit[11], this.raportti.rivit[12]];
        },

        rivit_14_17: function(){
            if(this.raportti.rivit.length < 34) return [];
            return [ this.raportti.rivit[13], this.raportti.rivit[14], this.raportti.rivit[15], this.raportti.rivit[16]];
        },

        rivit_101_106: function(){
            if(this.raportti.rivit.length < 34) return [];
            return [ this.raportti.rivit[17], this.raportti.rivit[18], this.raportti.rivit[19], this.raportti.rivit[20], this.raportti.rivit[21], this.raportti.rivit[22]];
        },

        rivit_107_111: function(){
            if(this.raportti.rivit.length < 34) return [];
            return [ this.raportti.rivit[23], this.raportti.rivit[24], this.raportti.rivit[25], this.raportti.rivit[26], this.raportti.rivit[27]];
        },

        rivit_112_113: function(){
            if(this.raportti.rivit.length < 34) return [];
            return [ this.raportti.rivit[28], this.raportti.rivit[29]];
        },

        rivit_114_117: function(){
            if(this.raportti.rivit.length < 34) return [];
            return [ this.raportti.rivit[30], this.raportti.rivit[31], this.raportti.rivit[32], this.raportti.rivit[33]];
        },

    },
    methods: {
        sulje(){
            bus.emit(EVENT_CLOSE_REPORT);
        },
        print(){
            bus.emit(EVENT_DOWNLOAD);
        }
    },
    updated: function(){
        let title = this.raportti.title();
        console.log(title);
        $("#modal-title").text(title);
        this.title = title;
    }
});

Vue.component('vue-user', {
    template: `
    <div>                                                     
        <h2>Käyttäjä: <small>{{user.name}}</small></h2>       
        <p v-if="user.login">                                 
            <div style="display: inline-block; width: 150px;">
                <b>Rooli:</b>                                 
            </div>                                            
            {{rooli}}                                         
        </p>                                                  
        <p v-if="user.login">                                 
            <div style="display: inline-block; width: 150px;">
                <b>Kirjautumislinkki:</b>                     
            </div>                                            
            <a :href="href">http://www.lentopalloerotuomarit.fi/tuomaritarkkailu/?token={{user.token}}</a>
        </p>                                                  
        <p>                                                   
            <div style="display: inline-block; width: 150px;">
                <b>Email:</b>                                 
            </div>                                            
            <input style="width: 250px; display: inline-block;" class="form-control" type="email" v-model="user.email" @change="emailChanged()">
            <button v-if="changed" class="btn" @click="saveEmail">Talleta sähköposti</button>                                                   
        </p>                                                            
        <p>                                                   
            <div style="display: inline-block; width: 150px;">
                <b>Sisäänkirjautuminen:</b>                                 
            </div>                                            
            {{login_time}}
        </p>                                                            
        <p>                                                   
            <div style="display: inline-block; width: 150px;">
                <b>Edellinen sisäänkirjautuminen:</b>                                 
            </div>                                            
            {{last_login}}
        </p>                                                            
        <p>                                                             
            <button class="btn" @click="logout()">Kirjaudu ulos</button>
        </p>                                                            
    </div>
    `,
    props: ['user', 'jos'],
    created: function(){
        let self=this;
        bus.on(EVENT_EMAIL_SAVED, function(){
            self.changed = false;
        });
    },
    data: function () {
        let href="";
        if(this.user != undefined) href= "http://www.lentopalloerotuomarit.fi/tuomaritarkkailu/?token=" + this.user.token;
        let last_login = "<ei tiedossa>";
        if(this.user.last_login != null)  last_login = moment(this.user.last_login).format("dd DD.MM.YYYY H:mm:ss");
        return {
            changed: false,
            href: href,  
            login_time: moment(this.user.login_time).format("dd DD.MM.YYYY H:mm:ss"),
            last_login: last_login,
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
            if(this.user.rooli == ROOLI_TUOMARI_JA_TARKKAILIJA.toString()) rooli = "Tuomari ja tarkkailija";
            if(this.user.rooli == ROOLI_TARKKAILIJA.toString()) rooli = "Tarkkailija";
            if(this.user.rooli == ROOLI_TUOMARI.toString()) rooli = "Tuomari";
            if(this.user.rooli == ROOLI_ADMIN.toString()) rooli = "Admin";
            return rooli;
        },
    }
});

Vue.component('vue-grid-filters', {
    template:` 
    <div style="margin-right: 5px; margin-top: 10px; margin-bottom: 10px; float: right;">
        <div class="btn-group" style="margin-right: 15px;">                                                                                                                                                                             
            <button type="button" @click="dateFilter('ALL')" :class="classes.all">Kaikki</button>                                                                                                                                                                                   
            <button type="button" @click="dateFilter('MONTH')" :class="classes.kk">Kuukausi</button>                                                                                                                                                                                   
            <button type="button" @click="dateFilter('WEEK')" :class="classes.vko">Viikko</button>                                                                                                                                                                                   
        </div>                                                                                                                                                                            
        <div class="btn-group">                                                                                                                                                                             
            <button type="button" @click="userFilter('MY')" :class="classes.omat">Omat</button>                                                                                                                                                                                   
            <button type="button" @click="userFilter('ALL')" :class="classes.kaikkien">Kaikkien</button>                                                                                                                                                                                   
        </div>                
    </div>                                                                                                                                                            
    `,
    props: ['date_filter', 'user_filter', 'jos'],
    data: function(){
        return {
        }
    },
    computed: {
        classes(){
            let all=false;
            let month = false;
            let week = false;
            let my = false;
            if(this.date_filter == 'ALL') all = true;
            if(this.date_filter == 'MONTH') month = true;
            if(this.date_filter == 'WEEK') week = true;
            if(this.user_filter == 'MY') my = true;

            let ret = {
                all: {
                    'btn': true,
                    'btn-default': !all,
                    'btn-primary': all,
                    'btn-xs': true,
                },
                kk: {
                    'btn': true,
                    'btn-default': !month,
                    'btn-primary': month,
                    'btn-xs': true,
                },
                vko: {
                    'btn': true,
                    'btn-default': !week,
                    'btn-primary': week,
                    'btn-xs': true,
                },
    
                omat: {
                    'btn': true,
                    'btn-default': !my,
                    'btn-primary': my,
                    'btn-xs': true,
                },
                kaikkien: {
                    'btn': true,
                    'btn-default': my,
                    'btn-primary': !my,
                    'btn-xs': true,
                },
            };
            return ret;
        },
    },
    methods: {
        dateFilter(f){
            bus.emit(EVENT_DATE_FILTER, f);
        },

        userFilter(f){
            bus.emit(EVENT_USER_FILTER, f);
        },
    }
});

Vue.component('vue-login', {
    template:` 
    <div>                                                                                                                                                                             
        <h2>Kirjaudu sisään</h2>                                                                                                                                                      
        <p>Sisäänkirjautuminen tapahtuu kunkin tuomarin tai tarkkailijan henkilökohtaisella linkillä.</p>                                                                             
                                                                                                                                                                                        
        <p>Tässä voit tilata uuden linkin. Syötä oheiseen kenttään sähköpostiosoitteesi. Jos osoite on liitetty käyttäjälle, niin ko. osoitteeseen lähetetään kirjautumislinkki.</p>  
        <p>                                                                                                                                                                           
            <b>Email:</b>                                                                                                                                                             
            <input style="width: 250px; display: inline-block;" class="form-control" type="email" v-model="email"">                                                                   
            <button class="btn" @click="requestLink">Tilaa linkki</button>                                                                                                            
        </p>                                                                                                                                                                          
    </div>                                                                                                                                                                            
    `,
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

Vue.component('vue-news', {
    template:` 
    <div v-if="show" style="position: fixed; padding: 20px; background: #def; border: 2px solid #a33; top: 30px; left: 30px; z-index: 2000; min-width: 500px; max-width: 80%; min-height: 250px;">                                                                                                                                                                             
        <button class="btn btn-default" style="top: 10px; float: right; color: red;" @click="sulje()">X</button>
        <div style="margin-bottom: 60px">
            <slot>
            </slot>
        </div>         
        
        <div style="position: absolute; bottom: 16px; padding-top: 10px; width: 96%; border-top: 1px solid #aaa;">
            <input type="checkbox" v-model="dontShow"> Älä näytä tätä enää
            <div style="float: right; font-size: 12px; padding-top: 5px;">Sulje oikean yläkulman ruksista</div>
        </div>
    </div>                                                                                                                                                                            
    `,
    props: ['jos', 'news_moment'],
    data: function(){
        return {
            suljeHeti: false,
            dontShow: false,
        }
    },
    methods: {
        sulje(){
            if(this.dontShow) localStorage.tark_news = this.news_moment;
            this.suljeHeti = true;
        }
    },
    computed: {
        show(){
            if(this.suljeHeti) return false;
            if(localStorage.tark_news === "undefined") localStorage.tark_news = false;
            if(localStorage.tark_news && localStorage.tark_news != "false"){
                let m = moment(localStorage.tark_news);
                // console.log("localStorage: " + m.format("DD.MM.YYYY"));
                // console.log("News:         " + moment(this.news_moment).format("DD.MM.YYYY"));
                if(m.isBefore(moment(this.news_moment))){
                    //console.log("News: true");
                    return true;
                } 
                // console.log("News: false");
                return false;
            } 
            // console.log("News unset: true");
            
            return true;
        }
    }
});

