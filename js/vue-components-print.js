

Vue.component('vue-report-print', {
    template:` 
    <div> 
        <h2>Tarkkailuraportti</h2>

        <div class="no-print" style="padding: 30px; background: #ffa; border: 2px solid gray; border-radius: 10px;">
            <h3>HUOM!</h3>
            <p>Tämän näkymän ulkoasusta ei tarvitse välittää; kaikki tyylit on määritetty siten, että ne 
               näkyvät tulostettaessa oikein.</p>
        </div>

        <div class="panel panel-primary">
            <div class="panel-heading">Ottelun tiedot</div>
            <div class="panel-body">
                <div class="row">
                    <div class="print-label">Pvm:</div>
                    <div class="print-value">{{pvm}}</div>
                </div>
                <div class="row">
                    <div class="print-label">Paikka:</div>
                    <div class="print-value">{{raportti.paikka}}</div>
                </div>
                <div class="row">
                    <div class="print-label">Ottelu:</div>
                    <div class="print-value">
                        {{raportti.koti}}-{{raportti.vieras}},
                        <span v-if="raportti.miehet==\'1\'">Miehet</span>           
                        <span v-if="raportti.miehet==\'2\'">Naiset</span>           
                        <span v-if="raportti.miehet==\'3\'">Muu</span>
                    </div>
                </div>
                <div class="row">
                    <div class="print-label">Tulos:</div>
                    <div class="print-value">{{raportti.tulos}}</div>
                </div>
                <div class="row">
                    <div class="print-label">Kesto</div>
                    <div class="print-value">{{raportti.kesto_h}} h {{raportti.kesto_min}} min</div>
                </div>
                <div class="row">
                    <div class="print-label">Vaikeusaste:</div>
                    <div class="print-value">
                        <span v-if="raportti.vaikeus==1">Helppo</span> 
                        <span v-if="raportti.vaikeus==2">Normaali</span>
                        <span v-if="raportti.vaikeus==4">Vaikea</span>
                    </div>
                </div>

                <div class="row">
                    &nbsp;
                </div>

                <div class="row">
                    <div class="print-label">Päätuomari:</div>
                    <div class="print-value">{{raportti.pt_nimi}}</div>
                </div>
                <div class="row">
                    <div class="print-label">Verkkotuomari:</div>
                    <div class="print-value">{{raportti.vt_nimi}}</div>
                </div>
                <div class="row">
                    <div class="print-label">Tarkkailija:</div>
                    <div class="print-value">{{raportti.tark_nimi}}</div>
                </div>
            </div>
        </div>
            
        <hr>

        <div class="panel panel-primary">
            <div class="panel-heading">Lopullinen tuomariarvio</div>
            <div class="panel-body">
                <div class="row">
                    <div class="print-col-1"></div>
                    <div class="print-col-2">Päätuomari</div>
                    <div class="print-col-3">Verkkotuomari</div>
                </div>
                <div class="row">
                    <div class="print-col-1">Pisteet</div>
                    <div class="print-col-2">{{raportti.pt_score}}</div>
                    <div class="print-col-3">{{raportti.vt_score}}</div>
                </div>
                <div class="row">
                    <div class="print-col-1">Lopullinen tulos</div>
                    <div class="print-col-2">{{pt_tulos}}</div>
                    <div class="print-col-3">{{vt_tulos}}</div>
                </div>
                <div class="row">
                    <div class="print-col-1">Kehityssuositukset ja huomautukset</div>
                    <div class="print-col-2" style="text-align: left">{{raportti.pt_huom}}</div>
                    <div class="print-col-3" style="text-align: left">{{raportti.vt_huom}}</div>
                </div>
                <div class="row">
                    <div class="print-col-1">Muita huomioita</div>
                    <div class="print-col-23" style="text-align: left">{{raportti.raportti_huom}}</div>
                </div>
            </div>
        </div>

        <h3 style="page-break-before: always;">Päätuomari {{raportti.pt_nimi}}</h3>
        <p>Pisteet: {{raportti.pt_score}}</p>                                                                                                     
                                                                                                    
        <div class="panel panel-primary" style="page-break-inside: avoid;">                                                                                         
            <div class="panel-heading">Tuomaritekniikka ja suoritustaito</div>                                                    
            <div class="panel-body">                                                                                              
                <vue-rivi-otsikko></vue-rivi-otsikko>                                                                             
                <vue-rivi v-for="rivi in rivit_1_5" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :jos="jos" :tila="\'pieni\'"></vue-rivi>       
            </div>                                                                              
        </div>                                                                                  
        <div class="panel panel-primary" style="page-break-inside: avoid;">                                                       
            <div class="panel-heading">Sääntöjen sekä ohjeiden ja tulkintojen soveltaminen</div>
            <div class="panel-body">                                                            
                <vue-rivi v-for="rivi in rivit_6_10" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi>
            </div>                                                                                                               
        </div>                                                                                                                   
                                                                                        
        <div class="panel panel-primary" style="page-break-inside: avoid;">                                                                                        
            <div class="panel-heading">Vuorovaikutus joukkueiden kanssa</div>                                                    
            <div class="panel-body">                                                                                             
                <vue-rivi v-for="rivi in rivit_11_13" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi> 
            </div>                                                                                                                   
        </div>                                                                                                                       
                                                                                                    
        <div class="panel panel-primary" style="page-break-inside: avoid;">                                                                                            
            <div class="panel-heading">Ottelun johtaminen ja persoonallisuus</div>                                                   
            <div class="panel-body">                                                                                                 
                <vue-rivi v-for="rivi in rivit_14_17" :key="rivi.id" :raportti:="raportti" :rivi="rivi" :tila="\'pieni\'" :jos="jos"></vue-rivi>
            </div>                                                                                                                              
        </div>                                                                                                                                
                                                                                                                                                  
    </div>
    `,
    props: ['raportti', 'jos'],
    data: function () {
        let pvm = moment(this.raportti.pvm).format("DD.MM.YYYY");
        let pt_tulos = "Huono";
        if(this.raportti.pt_score >= 60) pt_tulos = "Välttävä";
        if(this.raportti.pt_score >= 75) pt_tulos = "Hyvä";
        if(this.raportti.pt_score >= 90) pt_tulos = "Erittäin hyvä";
        if(this.raportti.pt_score >= 97) pt_tulos = "Erinomainen";

        let vt_tulos = "Huono";
        if(this.raportti.vt_score >= 60) vt_tulos = "Välttävä";
        if(this.raportti.vt_score >= 75) vt_tulos = "Hyvä";
        if(this.raportti.vt_score >= 90) vt_tulos = "Erittäin hyvä";
        if(this.raportti.vt_score >= 97) vt_tulos = "Erinomainen";
        return {
            pvm: pvm,
            pt_tulos: pt_tulos,
            vt_tulos: vt_tulos,
        }
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
    }    
});
