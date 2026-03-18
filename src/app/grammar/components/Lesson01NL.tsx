import React from "react";
import { Footnote } from "@/components/Footnote";

export function Lesson01NL() {
  return (
    <div className="space-y-10 font-sans leading-relaxed text-stone-800 dark:text-stone-200">

      {/* Definitions */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Definities</h2>
        <ul className="list-decimal list-outside ml-5 mt-4 space-y-3">
          <li><strong>Een kaal substantief</strong> (zelfstandig naamwoord) is een basiswoord zonder enige vorm van determinatie (bepaaldheid), vaak in de vorm van prefixen (voorvoegsels).</li>
          <li><strong>Een gedetermineerd (bepaald) substantief</strong> is voorzien van een determinator (bepaler), vaak in de vorm van een voorvoegsel.</li>
        </ul>
      </section>

      {/* Vocabulary */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Woordenschat: Kale zelfstandige naamwoorden</h2>
        <div className="w-full mt-4 rounded-lg border border-stone-200 dark:border-stone-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100 dark:bg-stone-800">
                <th colSpan={2} className="p-3 border-b dark:border-stone-700 font-semibold text-center">Mannelijk <span style={{ fontVariant: 'small-caps' }}>m</span></th>
                <th colSpan={2} className="p-3 border-b dark:border-stone-700 font-semibold text-center">Vrouwelijk <span style={{ fontVariant: 'small-caps' }}>v</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲣⲱⲙⲓ</td>
                <td className="p-3">“man, mens”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲥ̀ϩⲓⲙⲓ</td>
                <td className="p-3">“vrouw, echtgenote”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲓⲱⲧ</td>
                <td className="p-3">“vader”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲙⲁⲩ</td>
                <td className="p-3">“moeder”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲥⲟⲛ</td>
                <td className="p-3">“broer”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲥⲱⲛⲓ</td>
                <td className="p-3">“zus”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ϣⲏⲣⲓ</td>
                <td className="p-3">“zoon”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ϣⲉⲣⲓ</td>
                <td className="p-3">“dochter”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲕⲁϩⲓ</td>
                <td className="p-3">“aarde”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲫⲉ</td>
                <td className="p-3">“hemel”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲁⲅⲓⲟⲥ</td>
                <td className="p-3">“heilige, sint”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲉⲕⲕ̀ⲗⲏⲥⲓⲁ̀</td>
                <td className="p-3">“kerk”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ϯⲙⲓ</td>
                <td className="p-3">“dorp”</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲡⲟⲗⲓⲥ</td>
                <td className="p-3">“stad”</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Significant Letters */}
      <section className="bg-stone-100 dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800">
        <h3 className="font-bold text-lg mb-3">Significante letters:</h3>
        <ul className="space-y-2">
          <li><strong>Mannelijk <span style={{ fontVariant: 'small-caps' }}>m</span>:</strong> <span className="font-coptic text-lg">ⲡ</span> /p/, <span className="font-coptic text-lg">ⲫ</span> /pʰ/, <span className="font-coptic text-lg">ϥ</span> /f/</li>
          <li><strong>Vrouwelijk <span style={{ fontVariant: 'small-caps' }}>v</span>:</strong> <span className="font-coptic text-lg">ⲧ</span> /t/, <span className="font-coptic text-lg">ⲑ</span> /tʰ/, <span className="font-coptic text-lg">ⲥ</span> /s/</li>
          <li><strong>Meervoud <span style={{ fontVariant: 'small-caps' }}>p</span><Footnote number={1} content={<><span style={{ fontVariant: 'small-caps' }}>p</span> voor pluralis (meervoud).</>} />:</strong> <span className="font-coptic text-lg">ⲛ</span> /n/, <span className="font-coptic text-lg">ⲟⲩ</span> /u/</li>
        </ul>
      </section>

      {/* Determiner Selection */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Selectie determinators (bepalers of voorvoegsels)</h2>
        <p className="mt-4 mb-2 italic">Voorbeeldwoorden: <span className="font-coptic text-emerald-600 dark:text-emerald-400">Ⲥⲟⲛ</span> “broer” / <span className="font-coptic text-emerald-600 dark:text-emerald-400">Ⲥⲱⲛⲓ</span> “zus” / <span className="font-coptic text-emerald-600 dark:text-emerald-400">Ⲥⲱⲛⲓ</span> “zussen”</p>
        <div className="w-full rounded-lg border border-stone-200 dark:border-stone-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100 dark:bg-stone-800">
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Type</th>
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Mannelijk <span style={{ fontVariant: 'small-caps' }}>m</span></th>
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Vrouwelijk <span style={{ fontVariant: 'small-caps' }}>v</span></th>
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Meervoud <span style={{ fontVariant: 'small-caps' }}>p</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-medium">Onbepaald</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲟⲩ</strong>ⲥⲟⲛ</span><Footnote number={2} content={<><span className="font-coptic">Ⲟⲩ-</span> &lt; <span className="font-coptic">ⲟⲩⲁⲓ</span> (het getal “één”). Vgl. Frans un/une (lidwoorden), maar ook: un, deux, trois, … (getallen).</>} /> “een broer”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲟⲩ</strong>ⲥⲱⲛⲓ</span> “een zus”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ϩⲁⲛ</strong>ⲥⲱⲛⲓ</span><Footnote number={3} content={<><span className="font-coptic">Ϩⲁⲛ-</span> &lt; <span className="font-coptic">ϩⲟⲓ̈ⲛⲉ</span> “sommige”. Er is geen Nederlands equivalent voor het onbepaald meervoud lidwoord <span className="font-coptic">ϩⲁⲛ-</span>.</>} /> “zussen”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-medium">Bepaald (lang)</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲡⲓ</strong>ⲥⲟⲛ</span> “de broer”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ϯ</strong>ⲥⲱⲛⲓ</span><Footnote number={4} content={<><span className="font-coptic">Ⲧ + ⲓ = ϯ</span>. Dus: <span className="font-coptic">ϯⲥⲱⲛⲓ</span>.</>} /> “de zus”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲛⲓ</strong>ⲥⲱⲛⲓ</span> “de zussen”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-medium">Bepaald (kort)</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲡ̀</strong>ⲥⲟⲛ</span> “de broer”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲧ̀</strong>ⲥⲱⲛⲓ</span> “de zus”</td>
                <td className="p-3 text-stone-500 italic">(Geen korte vorm)</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-medium">Bezittelijk</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲡⲁ</strong>ⲥⲟⲛ</span> “mijn broer”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲧⲁ</strong>ⲥⲱⲛⲓ</span> “mijn zus”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲛⲁ</strong>ⲥⲱⲛⲓ</span> “mijn zussen”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-medium">Aanwijzend</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲡⲁⲓ</strong>ⲥⲟⲛ</span> “deze broer”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲧⲁⲓ</strong>ⲥⲱⲛⲓ</span> “deze zus”</td>
                <td className="p-3"><span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400"><strong className="font-bold">Ⲛⲁⲓ</strong>ⲥⲱⲛⲓ</span> “deze zussen”</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-stone-500">Opmerking: <span className="font-coptic">ⲡⲓ-</span> en <span className="font-coptic">ⲡ̀-</span> zijn synoniemen. We spreken van lange vs. kort bepaalde lidwoorden.</p>
      </section>

      {/* Zero Determination */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Nul-determinatie</h2>
        <p className="mt-4 mb-3">
          Het Koptisch is een hoog-gedetermineerde taal. Vaak (90% van de gevallen) worden zelfstandige naamwoorden dus van een determinator (voorvoegsel) voorzien. Er zijn enkele uitzonderingen waar zelfstandige naamwoorden toch zonder determinator kunnen voorkomen. Dit doet zich bijvoorbeeld voor met het hoeveelheidswoord <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">ⲛⲓⲃⲉⲛ</span> "elk/ieder".
        </p>
        <ul className="space-y-2 bg-stone-50 dark:bg-stone-900 p-4 rounded-lg border border-stone-200 dark:border-stone-800">
          <li><sup className="text-sm font-semibold">Ø</sup>-<span className="font-coptic text-lg">ⲣⲱⲙⲓ ⲛⲓⲃⲉⲛ</span> “iedere mens”</li>
          <li><sup className="text-sm font-semibold">Ø</sup>-<span className="font-coptic text-lg">ⲥ̀ϩⲓⲙⲓ ⲛⲓⲃⲉⲛ</span> “elke vrouw”</li>
          <li><sup className="text-sm font-semibold">Ø</sup>-<span className="font-coptic text-lg">ⲁⲅⲓⲟⲥ ⲛⲓⲃⲉⲛ</span> “iedere heilige”</li>
          <li><sup className="text-sm font-semibold">Ø</sup>-<span className="font-coptic text-lg">ⲉⲕⲕ̀ⲗⲏⲥⲓⲁ̀ ⲛⲓⲃⲉⲛ</span> “iedere kerk”</li>
        </ul>
      </section>

      {/* Nominal Sentences */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Tweeledige nominale zin (gezegde + onderwerp)</h2>
        <p className="mt-4 mb-3">
          Er zijn drie verbindingsvoornaamwoorden in het Koptisch. Ze verschijnen pas na het eerste woord (of de eerste woordgroep) van de zin. We noemen deze woorden postpositief (achter geplaatst) of enclitisch (aanleunend tegen het voorgaande woord). We markeren deze met het symbool ‘≡’.
        </p>
        <ul className="space-y-2 mb-4 text-emerald-600 dark:text-emerald-400">
          <li>≡<span className="font-coptic text-lg">ⲡⲉ</span> <span style={{ fontVariant: 'small-caps' }}>m</span> “hij, het”<Footnote number={5} content={<>In het Koptisch is er geen specifiek woord voor “het”.</>} /></li>
          <li>≡<span className="font-coptic text-lg">ⲧⲉ</span> <span style={{ fontVariant: 'small-caps' }}>v</span> “zij, het”</li>
          <li>≡<span className="font-coptic text-lg">ⲛⲉ</span> <span style={{ fontVariant: 'small-caps' }}>p</span> “zij, het”</li>
        </ul>
        <div className="bg-sky-50 dark:bg-sky-900/30 p-5 rounded-xl border border-sky-100 dark:border-sky-800">
          <h3 className="font-bold text-lg mb-3">Toepassingen:</h3>
          <p className="mb-4 text-sm">
            In het Koptisch (net zoals in Semitische talen zoals Hebreeuws of Arabisch) is er geen werkwoord ‘zijn’. Maar in het Nederlands zijn we verplicht om het te gebruiken, anders is de vertaling fout.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li><span className="font-coptic text-xl">Ⲟⲩⲓⲱⲧ ⲡⲉ.</span> <br />“Hij is een vader.”</li>
            <li><span className="font-coptic text-xl">Ⲡⲁⲓⲱⲧ ⲡⲉ.</span> <br />“Hij is mijn vader.”</li>
            <li><span className="font-coptic text-xl">Ⲡⲁⲓⲓⲱⲧ ⲡⲉ.</span> <br />“Het is deze vader.”</li>
            <li><span className="font-coptic text-xl">Ⲧⲁⲙⲁⲩ ⲧⲉ.</span> <br />“Zij is mijn moeder.”</li>
            <li><span className="font-coptic text-xl">Ⲟⲩⲥ̀ϩⲓⲙⲓ ⲧⲉ.</span> <br />“Zij is een vrouw.”</li>
            <li><span className="font-coptic text-xl">Ϩⲁⲛⲥⲱⲛⲓ ⲛⲉ.</span> <br />“Zij zijn zussen.”</li>
            <li><span className="font-coptic text-xl">Ϩⲁⲛⲣⲱⲙⲓ ⲛⲉ.</span> <br />“Het zijn mannen.”</li>
            <li><span className="font-coptic text-xl">Ⲛⲓⲁⲅⲓⲟⲥ ⲛⲉ.</span> <br />“Het zijn de heiligen.”</li>
          </ul>
        </div>
      </section>

      {/* Independent Pronouns */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Onafhankelijke persoonlijke voornaamwoorden</h2>
        <p className="mt-4 mb-3">
          Naast de verbindingsvoornaamwoorden bestaan er ook de onafhankelijke persoonlijke voornaamwoorden. Bij de tweeledige nominale zin is het gebruik van de verbindingsvoornaamwoorden de standaard (verplicht). Voor het benadrukken van zulke nominale zinnen kan men ook de onafhankelijke persoonlijke voornaamwoorden inschakelen. Deze zijn prepositief:
        </p>
        <ul className="flex flex-wrap gap-4 mb-6">
          <li className="bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-lg"><span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲛ̀ⲑⲟϥ</span> <span style={{ fontVariant: 'small-caps' }}>m</span> “hij, het”</li>
          <li className="bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-lg"><span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲛ̀ⲑⲟⲥ</span> <span style={{ fontVariant: 'small-caps' }}>v</span> “zij, het”</li>
          <li className="bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-lg"><span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲛ̀ⲑⲱⲟⲩ</span> <span style={{ fontVariant: 'small-caps' }}>p</span> “zij, het”</li>
        </ul>
        <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-lg border border-stone-200 dark:border-stone-800">
          <h3 className="font-bold mb-3 text-sm uppercase tracking-widest text-stone-500">Voorbeelden</h3>
          <ul className="space-y-3">
            <li><span className="font-coptic text-xl">Ⲛ̀ⲑⲟϥ</span>, <span className="font-coptic text-lg">ⲡⲁⲓⲱⲧ ⲡⲉ.</span> “<i>Hij</i> is mijn vader.”</li>
            <li><span className="font-coptic text-xl">Ⲛ̀ⲑⲟⲥ</span>, <span className="font-coptic text-lg">ⲧⲁⲙⲁⲩ ⲧⲉ.</span> “<i>Zij</i> is mijn moeder.”</li>
            <li><span className="font-coptic text-xl">Ⲛ̀ⲑⲱⲟⲩ</span>, <span className="font-coptic text-lg">ⲛⲁⲥⲱⲛⲓ ⲛⲉ.</span> “<i>Zij</i> zijn mijn zussen.”</li>
          </ul>
        </div>
      </section>

      {/* Abbreviations */}
      <section>
        <h2 className="text-2xl font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-sky-700 dark:text-sky-400">Afkortingen</h2>
        <p className="mt-4 mb-3">
          In de Koptische literatuur worden enkele veelvoorkomende afkortingen gebruikt, meestal om heilige namen ("nomina sacra"). De conventionele manier om afkortingen in het Koptisch weer te geven, is door een horizontale lijn boven het afgekorte woord te plaatsen.
        </p>
        <p className="mb-4 text-sm text-stone-600 dark:text-stone-400 italic">
          In een liturgische context kunnen woordafkortingen ook soms naar veelvoorkomende zinnen verwijzen:
        </p>
        <ul className="space-y-2 mb-6">
          <li><span className="font-coptic text-lg">ⲕ̅ⲉ̅</span> = <span className="font-coptic text-md">ⲕⲩⲣⲓⲉ̀ ⲉⲗⲏⲥⲟⲛ</span> “heer ontferm U”</li>
          <li><span className="font-coptic text-lg">ⲭ︦ⲉ︦</span> = <span className="font-coptic text-md">ⲭⲉⲣⲉ ⲛⲉ Ⲙⲁⲣⲓⲁ</span> “wees gegroet Maria”</li>
          <li><span className="font-coptic text-lg">ⲛ︦ⲧ︦ⲉ︦ϥ︦</span> = <span className="font-coptic text-md">ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓⲛⲁⲛ ⲉ̀ⲃⲟⲗ</span> “om onze zonden te vergeven”</li>
          <li><span className="font-coptic text-lg">ⲧ︦ⲱ︦ⲃ︦</span> = <span className="font-coptic text-md">ⲧⲱⲃϩ ⲙ̀Ⲡ̀ϭⲱⲓⲥ ⲉ̀ϩ̀ⲣⲏⲓ ⲉ̀ϫⲱⲛ</span> “bid tot de Heer voor ons”</li>
        </ul>

        <div className="w-full rounded-lg border border-stone-200 dark:border-stone-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100 dark:bg-stone-800">
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Voluit</th>
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Afkorting</th>
                <th className="p-3 border-b dark:border-stone-700 font-semibold">Betekenis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲁⲗⲗⲏⲗⲟⲩⲓⲁ̀</td>
                <td className="p-3 font-coptic text-xl">ⲁ̅ⲗ̅</td>
                <td className="p-3">“halleluja”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲁ̀ⲙⲏⲛ</td>
                <td className="p-3 font-coptic text-xl">ⲁ̅ⲙ̅</td>
                <td className="p-3">“amen”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲥⲱⲧⲏⲣ</td>
                <td className="p-3 font-coptic text-xl">ⲥ̅ⲱ̅ⲣ̅, ⲥ̅ⲣ̅</td>
                <td className="p-3">“verlosser”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ϭⲱⲓⲥ<Footnote number={6} content={<>In kerkelijke boeken en presentaties wordt dit vaak (altijd) verouderd geschreven als <span className="font-coptic">ϭⲟⲓⲥ</span>. De standaard Bohairische spelling is <span className="font-coptic">ϭⲱⲓⲥ</span>.</>} /></td>
                <td className="p-3 font-coptic text-xl">͞⳪̅, ϭ̅ⲥ̅</td>
                <td className="p-3">“heer, dame”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲕⲩⲣⲓⲟⲥ (-ⲉ̀)</td>
                <td className="p-3 font-coptic text-xl">ⲕ̅ⲉ̅</td>
                <td className="p-3">“heer”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲭⲉⲣⲉ</td>
                <td className="p-3 font-coptic text-xl">ⲭ̅ⲉ̅</td>
                <td className="p-3">“gegroet”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲓⲏⲥⲟⲩⲥ N<sup className="italic" style={{ fontVariant: 'small-caps' }}>m</sup><Footnote number={7} content={<>N<sup className="italic" style={{ fontVariant: 'small-caps' }}>m</sup> is de afkorting/symbool voor een Nomen (eigennaam).</>} /></td>
                <td className="p-3 font-coptic text-xl">Ⲓⲏ̅ⲥ̅, Ⲓⲥ̅, Ⲓ᷍ⲥ</td>
                <td className="p-3"><i>Jezus</i></td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲡⲓⲭⲣⲓⲥⲧⲟⲥ N<sup className="italic" style={{ fontVariant: 'small-caps' }}>m</sup></td>
                <td className="p-3 font-coptic text-xl">Ⲡⲭ̅ⲥ̅, Ⲡⲭ᷍ⲥ</td>
                <td className="p-3"><i>Christus</i></td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲡ̀ⲛⲉⲩⲙⲁ</td>
                <td className="p-3 font-coptic text-xl">ⲡ̅ⲛ̅ⲁ̅</td>
                <td className="p-3">“geest”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲉ̀ⲑⲟⲩⲁⲃ</td>
                <td className="p-3 font-coptic text-xl">ⲉ̅ⲑ̅ⲩ̅, ⲉ̅ⲑ̅</td>
                <td className="p-3">“heilig”</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲫ̀ⲛⲟⲩϯ</td>
                <td className="p-3 font-coptic text-xl">ⲫ︦ϯ︦, ⲫ᷍ϯ, ⲫ̀ϯ</td>
                <td className="p-3">“(de) God”</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Exercises */}
      <section className="bg-sky-50 dark:bg-sky-900/20 p-6 rounded-xl border border-sky-100 dark:border-sky-900 mt-10">
        <h2 className="text-xl font-bold mb-4 text-sky-700 dark:text-sky-400">🎓 Oefeningen</h2>
        <p className="mb-4">Vertaal de volgende nominale uitdrukkingen in het Koptisch (één oplossing is voldoende).</p>
        <ol className="list-decimal list-inside space-y-2 font-medium">
          <li>Zij is mijn dochter.</li>
          <li>Zij is mijn echtgenote.</li>
          <li>Het is de hemel.</li>
          <li>Zij is een dame.</li>
          <li>Zij zijn de dames.</li>
          <li>Hij is een geest.</li>
          <li>Het is de geest.</li>
          <li>Iedere stad.</li>
          <li>Iedere man.</li>
          <li>De heer, de verlosser.</li>
        </ol>
      </section>

    </div>
  );
}
