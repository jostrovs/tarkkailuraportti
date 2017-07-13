Vue.component('vue-input', {
                template: `
                    <div class="form-group">
                        <label :for="randomId">{{ label }}:</label>
                        <input :id="randomId" :value="value" @input="onInput" class="form-control">
                    </div>
                `,
                props: ['value', 'label'],
                data: function () {
                    return {
                        randomId: this._uid
                    }
                },
                methods: {
                    onInput: function (event) {
                        this.$emit('input', event.target.value)
                    }
                },
});
Vue.component('vue-date-input', {
                template: `
                    <div class="form-group">
                        <label :for="randomId">{{ label }}:</label>
                        <input type="date" :id="randomId" :value="value" @input="onInput" class="form-control">
                    </div>
                `,
                props: ['value', 'label'],
                data: function () {
                    return {
                        randomId: this._uid
                    }
                },
                methods: {
                    onInput: function (event) {
                        this.$emit('input', event.target.value)
                    }
                },
});
Vue.component('vue-input-area', {
                template: `
                    <div class="form-group">
                        <label :for="randomId">{{ label }}:</label>
                        <textarea rows="5" cols="40" :id="randomId" :value="value" @input="onInput" class="form-control"></textarea>
                    </div>
                `,
                props: ['value', 'label'],
                data: function () {
                    return {
                        randomId: this._uid
                    }
                },
                methods: {
                    onInput: function (event) {
                        this.$emit('input', event.target.value)
                    }
                },
});
Vue.component('vue-referees', {
              props: ['referees'],
              template: `
                      <div class="panel panel-default tuomarilista">
                          <div id="tuomarit-panel-heading" class="panel-heading">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" :href="collapseHref">Tuomarit: valittu {{selected_referees.length}}/{{referees.length}}</a>
                            </h4>
                          </div>
                          <div id="tuomaritCollapse" class="panel-collapse collapse in">
                              <div id="tuomarit-panel-buttons">
                                  <button class="myButton" id="kaikki"  @click="select_all_referees()">Valitse kaikki</button>
                                  <button class="myButton" id="ei_mitaan" @click="select_no_referees()">Tyhjennä valinnat</button>
                              </div>

                              <div id="tuomarit-vain-valitut" style="margin-top: 3px;">
                                  <span class="checkbox-label" style="margin-bottom: 3px;"><input type="checkbox" v-model="selectedOnly"> Näytä vain valitut tuomarit</span>
                              </div>

                              <div id="tuomarit-luokat" style="margin-top: 6px">
                                <template v-for="luokka in classes">
                                    <span class="checkbox-label"><input type="checkbox" v-model="luokka.displayed"> {{luokka.Luokka}}</span>
                                </template>
                              </div>
 
                              <div id="tuomarit-lista" style="margin-top: 10px; overflow-y: scroll;">
                                <table style="margin-top: 5px;"> 
                                  <tr>
                                      <th>&nbsp;</td>
                                      <th><a @click="setSort('id')">Id</a></th>
                                      <th><a @click="setSort('nimi')">Nimi</a></th>
                                      <th><a @click="setSort('luokka')">Luokka</a></th>
                                      <th><a @click="setSort('posti')">Posti</a></th>
                                      <th><a @click="setSort('kunta')">Kunta</a></th>
                                      <!--th>Tuplat</td-->
                                      <th>Määrät</td>
                                  </tr>
                                  <tr v-for="referee in sorted_referees" v-if="isDisplayed(referee)">
                                      <td><input type="checkbox" v-model="referee.displayed"></td>
                                      <td>{{referee.id}}</td>
                                      <td><a :href="referee.href + '&alkupvm=2016-07-01&print=1&piilota=tarkkailija&jarjestys=pvm,klo'" target="blank">{{referee.name}}</a></td>
                                      <td>{{referee.Luokka}}</td>
                                      <td>{{referee.PostiNo}}</td>
                                      <td>{{referee.Kunta}}</td>
                                      <!--td><input type="checkbox" v-model="referee.showDouble"></td-->
                                      <td><input type="checkbox" v-model="referee.showWorkLoad"></td>
                                  </tr>
                            
                            
                              </div>
                            <!--div class="panel-footer">Panel Footer</div-->
                          </div>
              
              `,
              data: function() {
                  return {
                      classes: [{Luokka: 'Liiga', displayed: true},
                                {Luokka: 'Pääsarja', displayed: true},
                                {Luokka: 'I', displayed: true},
                                {Luokka: 'II', displayed: true},
                                {Luokka: 'III', displayed: true},
                                {Luokka: 'O', displayed: true},
                                {Luokka: 'NT', displayed: true},
                                {Luokka: 'Ei', displayed: false},
                      ],
                      displayedClasses: ["Liiga", "Pääsarja", "I", "II", "III", "O", "NT"],
                      selectedOnly: true,
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString(),
                      sortField: '',
                      sortOrderAsc: true,
                  }
              },
              methods:{
                  isDisplayed: function(referee){
                      if(this.displayedClasses.includes(referee.Luokka)==false) return false;
                      return !this.selectedOnly || (this.selectedOnly && referee.displayed); 
                  },
                  
                  setSort: function(field){
                      if(field == this.sortField){
                          this.sortOrderAsc = !this.sortOrderAsc;
                          this.sortField = ""; 
                          this.sortField = field; 
                      } 
                      else {
                          this.sortField = field;
                          this.sortOrderAsc = true;
                      }
                  },
                  select_all_referees: function(){
                      for(let referee of this.referees){
                          referee.displayed = true;
                      }
                  },
                  select_no_referees: function(){
                      for(let referee of this.referees){
                          referee.displayed = false;
                      }
                  }
              },
              computed: {
                  sorted_referees: function(){
                      //console.log("sorted_referees");
                      var self = this;
                      this.displayedClasses = [];
                      for(let clas of self.classes){
                          if(clas.displayed) this.displayedClasses.push(clas.Luokka);
                      }

                      let ret = this.referees.filter((r)=> this.displayedClasses.includes(r.Luokka));


                      switch(this.sortField.toLowerCase()){
                          case 'nimi': 
                              return this.referees.sort(function(a,b){
                                  let ret = a.name.localeCompare(b.name);
                                  if(self.sortOrderAsc) return ret;
                                  return -ret;    
                              });
                          case 'luokka': 
                              return this.referees.sort(function(a,b){
                                  let ret = a.Luokka.localeCompare(b.Luokka);
                                  if(self.sortOrderAsc) return ret;
                                  return -ret;    
                              });
                          case 'kunta': 
                              return this.referees.sort(function(a,b){
                                  let ret = a.Kunta.localeCompare(b.Kunta);
                                  if(self.sortOrderAsc) return ret;
                                  return -ret;    
                              });
                          case 'posti': 
                              return this.referees.sort(function(a,b){
                                  let ret = parseInt(a.PostiNo,10) - parseInt(b.PostiNo, 10);
                                  if(self.sortOrderAsc) return ret;
                                  return -ret;    
                              });
                          default: 
                              return this.referees.sort(function(a,b){
                                  let ret = a.id - b.id;
                                  if(self.sortOrderAsc) return ret;
                                  return -ret;    
                              });
                      }
                  },

                  selected_referees: function(){
                      let ret = this.referees.filter((m)=>m.displayed);
                      return ret;
                  }
              },                  
});
Vue.component('vue-competitions', {
              props: ['competitions'],
              template: `
                      <div class="panel panel-default sarjalista">
                          <div id="sarjat-panel-heading" class="panel-heading">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" :href="collapseHref">Sarjat ja lohkot:</a>
                            </h4>
                          </div>
                          <div id="sarjatCollapse" class="panel-collapse collapse in" style="overflow-y: scroll;">
                              <ul>
                                    <li v-for="competition in competitions">
                                        <input type="checkbox" v-model="competition.displayed">
                                        {{competition.name}}  {{(competition.id)}}
                                        <span v-if="competition.development && competition.isFinished()">LOPPU comp: {{competition.id}}</span>

                                        <button class="myButton" v-if="!competition.loaded && competition.displayed" @click="loadCategoriesOnParent(competition)">Lataa</button>

                                        <ul>

                                            <li v-for="category in competition.categories" v-if="competition.displayed">
                                                <input type="checkbox" v-model="category.displayed">
                                                {{category.name}}  {{(category.id)}}

                                                <button class="myButton" v-if="!category.loaded && category.displayed" @click="loadGroupsOnParent(competition, category)">Lataa</button>

                                                <span v-if="competition.development" style="background: #fcc;">   comp: {{competition.id}}  cat: {{category.id}}</span>
                                                <ul>
                                                    <li v-for="group in category.groups" v-if="category.displayed">
                                                        <input type="checkbox" v-model="group.displayed"> {{group.name}}
                                                        <span v-if="competition.development && group.isFinished()">LOPPU comp: {{competition.id}}  cat: {{category.id}}  gro: {{group.id}}</span>
                                                        <ul>
                                                            <li v-for="team in group.teams" v-if="group.displayed">
                                                                <input type="checkbox" v-model="team.displayed"> {{team.name}}
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            <!--div class="panel-footer">Panel Footer</div-->
                          </div>
              
              `,
              data: function() {
                  return {
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              },
              methods: {
                  alert: function(mgg){
                      alert(mgg);
                  },
                  
                  loadCategoriesOnParent: function(competition){
                      competition.displayed = true;
                      this.$emit('load_categories_from_child', competition.id)
                  },

                  loadGroupsOnParent: function(competition, category){
                      category.displayed = true;
                      this.$emit('load_groups_from_child', competition.id, category.id)
                  }
              },
});
Vue.component('vue-matches', {
              props: ['initial_matches', 'show_days_ahead', 'nimeamattomat_lkm'],
              computed: {
                  matches_before: function(){
                      let dt = new Date();
                      let yesterday = new Date();
                      dt.setDate(dt.getDate() + this.show_days_ahead);
                      yesterday.setDate(yesterday.getDate()-1);
                      let ret = this.initial_matches.filter((m)=>m.datetime <= dt);
                      ret = ret.filter((m)=>m.datetime >= yesterday);
                      
                      this.displayed_matches_count = ret.filter((m)=> m.isDisplayed()).length;
                      this.$emit('input', this.displayed_matches_count);

                      return ret;
                  }
              },
              template: `
                    <div>
                        <h3>Nimeämättömiä otteluita yhteensä {{displayed_matches_count}}</h3>
                        <!--p>Näytetään ottelut, joista puuttuu tuomareita ennen päivämäärää: {{date.toLocaleDateString()}}</p-->                                
                        <vue-match v-for="match in matches_before" :match="match"></vue-match>
                    </div>
              `,
              methods: {
                  get_initial_date: function(){
                  }

              },
              data: function() {
                  // Aloituspäivämäärä
                  let date = new Date();
                  //date.setDate(date.getDate() + 60);
                  date.setDate(date.getDate() + this.show_days_ahead);
                  
                  return {
                      displayed_matches_count: 0,
                      matches: this.initial_matches,
                      date: date,
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              },
});
Vue.component('vue-all-matches', {
              props: ['initial_matches', 'show_days_ahead'],
              computed: {
                  matches_before: function(){
                      let dt = new Date();
                      let yesterday = new Date();
                      dt.setDate(dt.getDate() +  + this.show_days_ahead);
                      yesterday.setDate(yesterday.getDate()-7);
                      let ret = this.initial_matches.filter((m)=>m.datetime <= dt);
                      ret = ret.filter((m)=>m.datetime >= yesterday);
                      
                      return ret.sort((m1, m2)=>m1.datetime-m2.datetime);
                  }
              },
              template: `
                    <div>
                        <div v-for="match in matches_before" :class="{played: match.played}">
                            <div class='match' v-if="match.isDisplayed()" style="margin: 0px; padding: 2px;">
                                <div class="box" style="width:150px;"> 
                                    <span class="ajankohta-label">{{match.datetime.toLocaleDateString()}}
                                                                    klo {{match.toTimeString()}}
                                    </span>
                                </div>
                                <div class="box" style="min-width:60px;"><a :href="match.category_href" target="_blank"><span class="sarja-label" :class="match.torneoMatch.category_id">{{match.torneoMatch.category_id}}</span></a> </div>
                                <div class="box" style="min-width:70px;"><a :href="match.group_href" target="_blank" class="lohko-label">Lohko {{match.group.id}}</a> </div>
                                <div class="box" style="min-width:60px;"><a :href="match.href" target="_blank">{{match.torneoMatch.match_number}}</a></div>
                                <div class="box" style="width:170px;"><span class="pelipaikka-label">{{match.getVenue()}}</span></div>
                                <div class="box" style="width:180px;">
                                    {{match.torneoMatch.team_A_name}} -
                                    {{match.torneoMatch.team_B_name}}
                                </div>
                                <div class="box">
                                    <span v-if="match.referee_status!==''">
                                        Puuttuu: 
                                        <span v-for="referee in match.referee_status.split(' ')" class='referee-label'>
                                            {{referee}}
                                        </span>
                                    </span>
                                    <span v-if="match.referee_status==''">
                                        <span v-for="referee in match.referees" class='referee-list-label'>
                                            {{referee}}
                                        </span>
                                    </span>
                                </span>
                            </div>                        
                        </div>
                    </div>
              `,
              methods: {
                  get_initial_date: function(){
                  }

              },
              data: function() {
                  // Aloituspäivämäärä
                  let date = new Date();
                  //date.setDate(date.getDate() + 60);
                  date.setDate(date.getDate() + this.show_days_ahead);
                  
                  return {
                      displayed_matches_count: 0,
                      matches: this.initial_matches,
                      date: date,
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              },
});
Vue.component('vue-match', {
              props: ['match', 'forceDisplay'],
              template: `
                  <div class='match' v-if="forceDisplay || match.isDisplayed()">
                      <div class="box" style="min-width:30px;"><a :href="match.category_href" target="_blank"><span class="sarja-label" :class="match.torneoMatch.category_id">{{match.torneoMatch.category_id}}</span></a> </div>
                      <div class="box" style="min-width:70px;"><a :href="match.group_href" target="_blank" class="lohko-label">Lohko {{match.group.id}}</a> </div>
                      <div class="box" style="min-width:60px;"><a :href="match.href" target="_blank">{{match.torneoMatch.match_number}}</a></div>
                      <div class="box" style="width:150px;"> 
                          <span class="ajankohta-label">{{match.datetime.toLocaleDateString()}}
                                                        klo {{match.toTimeString()}}
                          </span>
                      </div>
                      <div class="box" style="width:170px;"><span class="pelipaikka-label">{{match.getVenue()}}</span></div>
                      <div class="box" style="width:180px;">
                        {{match.torneoMatch.team_A_name}} -
                        {{match.torneoMatch.team_B_name}}
                      </div>
                      <div class="box">
                        <span v-if="match.referee_status!==''">
                            Puuttuu: 
                            <span v-for="referee in match.referee_status.split(' ')" class='referee-label'>
                                {{referee}}
                            </span>
                        </span>
                      </span>
                  </div>
              `,
              data: function() {
                  return {
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              }
});
Vue.component('vue-double-booking', {
              props: ['double_booking_item'],
              template: `
                  <div class='double-booking' v-if="double_booking_item.referee != null && double_booking_item.referee.displayed">
                      Tuomari: <a :href="double_booking_item.referee.href" target="_blank">{{double_booking_item.referee.name}}</a><br>
                      <vue-match v-for="match in double_booking_item.matches" :match="match" forceDisplay="true"></vue-match>
                  </div>
              `,
              data: function() {
                  return {
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              }
});

Vue.component('vue-tuplat', {
              props: ["duplicates", "tuplabuukkaukset_lkm"],
              template: `
                      <div>
                          <h1>Tuplabuukkaukset <span style="font-size: 18px;" class="referee-label">{{displayed_items_count}}</span></h1>
                          <vue-double-booking v-for="item in duplicates" :double_booking_item="item"></vue-double-booking>
                      </div>
              `,
              computed: {
                  displayed_items_count: function(){
                      let count = this.duplicates.filter((d)=> d.referee!=null && d.referee.displayed).length;
                      this.$emit('input', count);
                      return count;
                  }
              },
              data: function() {
                  return {
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              }
});
Vue.component('vue-tehtavat', {
              props: ["initial_matches", "referees", "series"],
              template: `
                      <div>
                          <h1>Tehtävämäärät</h1>
                          <div>
                            <template v-for="sarja in local_series">
                                <span class="checkbox-label"><input type="checkbox" v-model="sarja.displayed"> {{sarja.id}}</span>
                            </template>
                          </div>

                          <div style="margin-top: 5px">
                              <button class="myButton" id="saveSarja" @click="save">Talleta valitut sarjat ja näytettävät kuukaudet</button>
                          </div>
                          <table style="margin-top: 3px;">
                              <tr>
                                  <th>Nimi</th>
                                  <th>Luokka</th>
                                  <th><a :class="{ monthActive: loka_displayed, monthInactive: !loka_displayed}" @click="toggle('lokakuu')">Lokakuu</a></th>
                                  <th><a :class="{ monthActive: marras_displayed, monthInactive: !marras_displayed}" @click="toggle('marraskuu')">Marraskuu</a></th>
                                  <th><a :class="{ monthActive: joulu_displayed, monthInactive: !joulu_displayed}" @click="toggle('joulukuu')">Joulukuu</a></th>
                                  <th><a :class="{ monthActive: tammi_displayed, monthInactive: !tammi_displayed}" @click="toggle('tammikuu')">Tammikuu</a></th>
                                  <th><a :class="{ monthActive: helmi_displayed, monthInactive: !helmi_displayed}" @click="toggle('helmikuu')">Helmikuu</a></th>
                                  <th><a :class="{ monthActive: maalis_displayed, monthInactive: !maalis_displayed}" @click="toggle('maaliskuu')">Maaliskuu</a></th>
                                  <th><a :class="{ monthActive: huhti_displayed, monthInactive: !huhti_displayed}" @click="toggle('huhtikuu')">Huhtikuu</a></th>
                              </tr>
                              <tr v-for="referee in referees">
                                   <td><a :href="referee.href + '&alkupvm=2016-07-01&print=1&piilota=tarkkailija&jarjestys=pvm,klo'" target="blank">{{referee.name}}</a></td>
                                   <td>{{referee.Luokka}}</td>
                                   <td class="workload-month">
                                       <vue-workload-month v-if="loka_displayed" :matches="getMatches(referee.id, 'lokakuu')"></vue-workload-month>
                                   </td>
                                   <td class="workload-month">
                                       <vue-workload-month v-if="marras_displayed" :matches="getMatches(referee.id, 'marraskuu')"></vue-workload-month>
                                   </td>
                                   <td class="workload-month">
                                       <vue-workload-month  v-if="joulu_displayed" :matches="getMatches(referee.id, 'joulukuu')"></vue-workload-month>
                                   </td>
                                   <td class="workload-month">
                                       <vue-workload-month  v-if="tammi_displayed" :matches="getMatches(referee.id, 'tammikuu')"></vue-workload-month>
                                   </td>
                                   <td class="workload-month">
                                       <vue-workload-month  v-if="helmi_displayed" :matches="getMatches(referee.id, 'helmikuu')"></vue-workload-month>
                                   </td>
                                   <td class="workload-month">
                                       <vue-workload-month  v-if="maalis_displayed" :matches="getMatches(referee.id, 'maaliskuu')"></vue-workload-month>
                                   </td>
                                   <td class="workload-month">
                                       <vue-workload-month  v-if="huhti_displayed" :matches="getMatches(referee.id, 'huhtikuu')"></vue-workload-month>
                                   </td>
                              </tr>
                          </table>
                      </div>
              `,
              data: function() {
                  return {
                      //local_series: this.series,
                      local_series: [],
                      loka_displayed: true,
                      marras_displayed: true,
                      joulu_displayed: true,
                      tammi_displayed: true,
                      helmi_displayed: true,
                      maalis_displayed: true,
                      huhti_displayed: true,
                      matches: [],
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              },
              methods: {
                  save: function(){
                      //Talletetaan valinnat
                      let list = [];
                      for(let sarja of this.local_series){
                          if(sarja.displayed === false) list.push(sarja.id);
                      }
                      Lockr.set(PREFIX + "notSelectedSerieIds", list);

                      // Talletetaan kuukaudet
                      Lockr.set(PREFIX + "loka_displayed", this.loka_displayed);
                      Lockr.set(PREFIX + "marras_displayed", this.marras_displayed);
                      Lockr.set(PREFIX + "joulu_displayed", this.joulu_displayed);
                      Lockr.set(PREFIX + "tammi_displayed", this.tammi_displayed);
                      Lockr.set(PREFIX + "helmi_displayed", this.helmi_displayed);
                      Lockr.set(PREFIX + "maalis_displayed", this.maalis_displayed);
                      Lockr.set(PREFIX + "huhti_displayed", this.huhti_displayed);
                  },
                  toggle: function(month){
                      switch(month.toLowerCase()){
                          case 'lokakuu':
                              this.loka_displayed = !this.loka_displayed;
                              break;
                          case 'marraskuu':
                              this.marras_displayed = !this.marras_displayed;
                              break;
                          case 'joulukuu':
                              this.joulu_displayed = !this.joulu_displayed;
                              break;
                          case 'tammikuu':
                              this.tammi_displayed = !this.tammi_displayed;
                              break;
                          case 'helmikuu':
                              this.helmi_displayed = !this.helmi_displayed;
                              break;
                          case 'maaliskuu':
                              this.maalis_displayed = !this.maalis_displayed;
                              break;
                          case 'huhtikuu':
                              this.huhti_displayed = !this.huhti_displayed;
                              break;
                      }
                  },
                  loadMonths: function(){
                      this.loka_displayed = Lockr.get(PREFIX + "loka_displayed", true);
                      this.marras_displayed = Lockr.get(PREFIX + "marras_displayed", true);
                      this.joulu_displayed = Lockr.get(PREFIX + "joulu_displayed", true);
                      this.tammi_displayed = Lockr.get(PREFIX + "tammi_displayed", true);
                      this.helmi_displayed = Lockr.get(PREFIX + "helmi_displayed", true);
                      this.maalis_displayed = Lockr.get(PREFIX + "maalis_displayed", true);
                      this.huhti_displayed = Lockr.get(PREFIX + "huhti_displayed", true);
                  },
                  getMatches: function(referee_id, month){
                      var self = this;
                      let ret = this.matches.filter((m)=> m.referee_ids.includes(referee_id));
                      
                      for(let sarja of this.local_series){
                          if(sarja.displayed === false){
                              ret = ret.filter((m)=>m.category.id !== sarja.id);
                          }
                      }

                      switch(month.toLowerCase()){
                          case 'lokakuu':
                              ret = ret.filter((m)=> m.datetime.getMonth() == 9 && m.datetime.getFullYear() == 2016); break;
                          case 'marraskuu':
                              ret = ret.filter((m)=> m.datetime.getMonth() == 10 && m.datetime.getFullYear() == 2016); break;
                          case 'joulukuu':
                              ret = ret.filter((m)=> m.datetime.getMonth() == 11 && m.datetime.getFullYear() == 2016); break;
                          case 'tammikuu':
                              ret = ret.filter((m)=> m.datetime.getMonth() == 0 && m.datetime.getFullYear() == 2017); break;
                          case 'helmikuu':
                              ret = ret.filter((m)=> m.datetime.getMonth() == 1 && m.datetime.getFullYear() == 2017); break;
                          case 'maaliskuu':
                              ret = ret.filter((m)=> m.datetime.getMonth() == 2 && m.datetime.getFullYear() == 2017); break;
                          case 'huhtikuu':
                              ret = ret.filter((m)=> m.datetime.getMonth() == 3 && m.datetime.getFullYear() == 2017); break;
                      }
                      return ret;
                  },
                  handleChecks: function(){
                      // Ladataan ja talletetaan localStoragesta
                      //console.log("checked: " + this.series.filter((s)=> s.displayed).length);
                            
                  },
                  
              },
              created: function(){
                  this.loadMonths();
              },
              beforeUpdate: function(){
                  this.handleChecks();
              },
              updated: function(){
                  this.local_series = this.series;
                  this.matches = this.initial_matches;
                  this.handleChecks();
                  //console.log("Updated: " + this.referees.length + " referees, " + this.initial_matches.length + " matches  " + this.series.length + " series");
              }
});

Vue.component('vue-workload-month', {
              props: ["matches"],
              template: `
                      <div>
                          <vue-workload-match v-for="match in matches" :match="match"></vue-workload-match>
                      </div>
              `,
              data: function() {
                  return {
                      //local_series: this.series,
                      id: this._uid,
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              },
});
Vue.component('vue-workload-match', {
              props: ["match"],
              template: `
                      <span :id="id" class="workload-label" :class="match.torneoMatch.category_id" @click="showPopup">
                        <div class="match_popup" :id="popupId"  @click="hidePopup($event)">
                            <p>
                                <a :href="match.category_href" target="_blank"><span class="sarja-label" :class="match.torneoMatch.category_id">{{match.torneoMatch.category_id}}</span></a> 
                                <a :href="match.group_href" target="_blank" class="lohko-label">Lohko {{match.group.id}}</a> 
                                <a :href="match.href" target="_blank">{{match.torneoMatch.match_number}}</a> 
                                {{match.datetime.toLocaleDateString()}} 
                                klo {{match.toTimeString()}}
                                {{match.getVenue()}}
                                {{match.torneoMatch.team_A_name}} -
                                {{match.torneoMatch.team_B_name}}
                            </p>
                        </div>
                        {{match.torneoMatch.category_id}}
                      </span>
              `,
              data: function() {
                  return {
                      //local_series: this.series,
                      popupActive: false,
                      id: this._uid,
                      popupId: this._uid + "_popup",
                      collapseId: this._uid,
                      collapseHref: "#" + this._uid.toString()
                  }
              },
              methods: {
                  showPopup: function(){
                      if(this.popupActive) return;
                      $("#overlay").show();
                      
                      let span = $("#" + this.id);
                      span.addClass("match_label_highlight");
                      let position = span.position();

                      var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                      let height = parseInt(span.css("height"), 10);

                      position.top += 24;

                      let div = $("#" + this.popupId);
                      div.show();
                      //div.css("z-index", "1003");
                      //div.css("background", "white");
                      div.css("top", position.top);
                      div.css("left", "100px");
                      div.css("width", 0.7*w);
                      this.popupActive = true;
                  },
                  hidePopup: function(event){
                      let span = $("#" + this.id);
                      span.removeClass("match_label_highlight");

                      $("#" + this.popupId).hide();
                      $("#overlay").hide();
                      var self=this;
                      setTimeout(function(){
                          self.popupActive = false;
                      }, 0);
                  }
              }
});

