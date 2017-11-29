

Vue.component('vue-help', {
    template:` 
    <div> 
        <h3>Liigaotteluiden sähköinen tarkkailujärjestelmän ohje</h3>
        <p>Sarjakauden 2017-2018 aikana lokakuussa siirrymme sähköisiin erotuomaritarkkailuraportteihin. 
           Raporttien syöttö tapahtuu sähköisesti eikä niitä enää tarvitse lähettää erikseen tarkkailijoille 
           tai tuomareille. Tuomareilla on omat lukuoikeudelliset tunnuksensa millä he pääsevät katsomaan 
           tarkkailuraportteja.
        </p>

        <p>Tarkkailuraporttien syöttäminen ja lukeminen tapahtuu osoitteessa:<br>
            <a href="http://www.lentopalloerotuomarit.fi/tuomaritarkkailu">http://www.lentopalloerotuomarit.fi/tuomaritarkkailu</a>
        </p>

        <p>Järjestelmän käyttö vaatii joko Google Chrome tai Mozilla Firefox www-selaimen. <b>Käyttö ei ole mahdollista 
           Internet Explorer selaimella!</b>
        </p>
        <p>Google Chromen voit ladata ja asentaa tietokoneelle osoitteessa: <br>
            <a href="http://www.google.fi/chrome/browser/desktop/index.html">http://www.google.fi/chrome/browser/desktop/index.html</a>
        </p>

        <h3>Kirjautuminen</h3>
    
        <p>Ensimmäisellä kerralla mennessänne sähköiseen tarkkailujärjestelmään osoitteessa: <br>
            <a href="http://www.lentopalloerotuomarit.fi/tuomaritarkkailu">http://www.lentopalloerotuomarit.fi/tuomaritarkkailu</a><br>
            avautuu ao. näköinen ikkuna:</p>

        <p><img class="help-kuva" src="./kuvat/help_kirjaudu.png"></p>
        
        <p>Ensimmäinen tehtävänne on syöttää sähköpostiosoitteenne ja tilata järjestelmän käyttölinkki!</p>

        <p>Jatkossa ette tarvitse kirjautuaksenne erillistä salasanaa vaan samaa konetta käyttäessäne muistaa 
           järjestelmä teidät. Mikäli käytätte toista tietokonetta niin sähköpostissa saamanne kirjautumislinkillä 
           voitte kirjautua järjestelmään. <b>Huom! Ette siis tarvitse käyttäjätunnusta / salasanaa vaan tuon 
           kirjautumislinkin joka sisältää yksilöllisen koodinne. Mikäli käytätte jonkun muun tietokonetta tilapäisesti,  
           pitää selaimesta tuhota selaushistoria sekä omaa nimeä klikkaamalla aukeavalta sivulta kirjautua ulos. Muuten 
           kuka tahansa ko. koneen käyttäjä pääsee automaattisesti tarkkailujärjestelmään.</b>
        </p>

        <p>Kirjautumislinkistä kertova sähköposti on sisällöltään seuraavanlainen:
        
        <div style="border-left: 4px solid #ccc; padding-left: 20px;">
        Hei!<br><br>
        Tässä on kirjautumislinkkisi tarkkailuraporttisivulle:<br>
        http://www.lentopalloerotuomarit.fi/tuomaritarkkailu/?token=iP0yxl03lZsM8Yj0s781mxxxxxxxxxx<br><br>
        </div>
        
        <p>jossa lopun kirjainrimpsusekamelska on henkilökohtainen koodinne. (yllä oleva on keksitty esimerkki eikä toimi).</p>

        <p>Kun olette klikanneet ko. linkkiä teille avautuu sivu jossa olette kirjautuneena sisälle:</p>

        <p><img class="help-kuva" src="./kuvat/help_kirjautunut.png"></p>

        <p>Oikealla ylhäällä näkyy nimenne ja oletuksena olette etusivulla jossa näette kaikki syötetyt
           tarkkailuraportit. Voitte hakea niitä syöttämällä hakulaatikoihin haluamianne hakuehtoja.
        </p>

        <p>Valitsemalla kohdan ”Uusi” (merkitty kuvassa numerolla 2) pääsette syöttämään tarkkailuraporttia. 
           Tarkkailuraportin kenttien syöttämisestä on pyritty tekemään mahdollisimman pitkälle aikaisempien 
           käytäntöjen mukainen mutta tiettyjä toiminteita on automatisoitu.
        </p>

        <p><img class="help-kuva" src="./kuvat/help_uusi.jpg"></p>
        
        <ol>
            <li>Painamalla PVM-laatikkoa pääsette valitsemaan ottelupäivämäärän.</li>
            <li>Paikka kenttään kirjoitatte pelipaikan</li>
            <li>Valitaan kotijoukkue ja </li>
            <li>vierasjoukkue (mikäli jompikumpi osapuolista on muu kuin liigajoukkue, valitaan Miehet / naiset / muu –kohdasta ”Muu” ja kirjoitetaan alla oleviin kenttiin joukkueiden nimet)</li>
            <li>Kohtaan 5 ottelun tulos kotijoukkueen erät ensin mainittuna ja ottelun kesto pöytäkirjan mukaan.</li>
            <li>Sitten valitsette ottelulle pää- ja verkkotuomarin. Mikäli tuomaria ei löydy listalta toimitaan ohjeen mukaisesti joka on kirjattuna ko. sivulle.</li>
        </ol>

        <p>Tämän jälkeen voitte alkaa syöttämään erotuomariarviointia:</p>

        <p><img class="help-kuva" src="./kuvat/help_arvostelu.jpg"></p>
        
        <ol>
            <li>Arviointi on perinteinen jossa ”b” kohta tarkoittaa ”ei parannettavaa” ja mikäli kaikissa kohdissa 
                tuomarilla on b &rarr; saa hän arvosanaksi 95 pistettä. Arviointi a-f kohtien välillä tapahtuu klikkaamalla 
                hiirellä ko. kohdan palluraa.</li>
            <li>Mikäli annatte tuomarille ”b” arvioinnista poikkeavan arvioinnin pitää teidän kirjoittaa perustelu kohdan 
                oikealle puolelle olevaan tekstilaatikkoon. Tekstilaatikon koko kasvaa automaattisesti sitä mukaa kun 
                siihen kirjoitetaan tekstiä (tai voitte suurentaa sitä manuaalisestikin vetämällä laatikon oikeasta 
                alakulmasta). </li>
            <li>Mikäli ette ole merkinneet huomautusta, niin kohdan 3 mukaisesti järjestelmä ilmoittaa 
                kommentin/perustelun puuttumisesta</li>
            <li>Kohtaan 4 voitte kirjoittaa yleisiä kehityssuosituksia tuomarille joita tarkkailijoiden koulutuksessa 
                on pyydetty kirjoittamaan ja joiden kehittymistä tarkkailijoiden pitää seurata</li>
            <li>tarkkailukohdat joita ei ole tehty on merkitty kohdan 5 mukaisesti punaisella pystyviivalla</li>
        </ol>
        
        <p>Lopuksi voitte kirjoittaa halutessanne ja/tai annettujen ohjeiden mukaisesti muita huomioita ottelusta 
           ko. laatikkoon. Kirjoitettu teksti kopioituu varsinaiseen raporttiin yläpuolelle.</p>

        <p><img class="help-kuva" src="./kuvat/help_huomio.png"></p>

        <p>Lopuksi tarkistakaa raportin ”oikeellisuus” ja mahdolliset virheet ja <b>varmistuttuanne sen olevan kunnossa</b>
           painakaa sivun alalaidassa olevaa ”Talleta raportti” nappia.</p>

        <p>Alla esimerkki valmiista raportista:</p>
        
        <p><img class="help-kuva" src="./kuvat/help_valmis.png"></p>   

        <p>Mikäli erehdyksessä tallennat raportin virheellisenä ja haluat siihen korjauksia tai haluat sen kokonaan 
           poistettavaksi tietokannasta niin laita asiasta Jorille: jostrovs@gmail.com. Kerro ongelma, mistä pelistä 
           kysymys niin Jori hoitaa asian kuntoon. Mutta <b>muistakaa aina varmistaa ennen kuin painatte ”talleta”-painiketta, 
           että raporttinne on täytetty oikein ja se on valmis tallennettavaksi!</b> Tämän hetkisessä versiossa teillä ei 
           ole oikeutta muokata tekemiänne raportteja kun olette sen tallentaneet.</p>

        <p>Raportin tallentaminen lähettää automaattisesti sähköpostiviestin ottelun tuomareille, jos heidät on kirjattu 
           järjestelmään. Jos tuomariksi on valittu ”Muu Tuomari”, niin viesti ei lähde automaattisesti, mutta silloin ei 
           myöskään tuomarilla ole automaattisesti pääsyä järjestelmään. Tällöin Jori hoitaa asiasta tiedon ko. tuomarille.</p>

        <p>Yhteenveto:
        <ul>
            <li>Kirjautuminen sähköpostitse saadulla linkillä joka on henkilökohtainen ja tallentuu www-selaimen muistiin</li>
            <li>Vain Google Chrome ja Mozilla Firefox kelpaavat</li>
            <li>Ottelun perustietojen syöttäminen </li>
            <li>Arviointien tekeminen – mikäli arviointi poikkeaa b-kohdasta ovat perustelut pakollisia</li>
            <li>Kehityssuositukset kohtaan kirjoitatte ohjeiden mukaisia asioita</li>
            <li>Alimpaan ”muita huomioita ottelusta” olevaan laatikkoon mahdollisia muita tarpeellisia huomioita joita
                tarkkailijoina teette / ohjeiden mukaisesti</li>
            <li>Varmistus että kaikki kohdat on täytetty ja oikein</li>
            <li>talleta raportti nappulan painaminen</li>
            <li>HUOM! Ennen tarkkailutehtävään menemistä on tarkkailijan velvollisuus tarkkailijoille käydyn ohjeistuksen
                 mukaisesti käydä tutustumassa ko. ottelun tuomareiden tarkkailuraportteihin ja niissä oleviin 
                 kehityssuosituksiin.</li>
            <li>HUOM2! Uudessa järjestelmässä ei siis enää a) laiteta tuomareille ja/tai b) muille tarkkailijoille 
                mailia tarkkailuraporteista eikä niitä tarvitse tulostaa yms.</li>
        </ul>
        </p>

        <p>Mahdolliset lisätoiveet ja kehityspyynnöt joko Jorille tai Pasille.</p>
        

    </div>
    `,
    props: [],
    data: function () {
        return {
        }
    },
});

